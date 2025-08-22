import { NotFoundException } from '@nestjs/common';
import { BooksService } from '../src/books/books.service';
import { Op } from 'sequelize';

describe('BooksService branches', () => {
  function makeService(overrides?: Partial<any>) {
    const repo = {
      findAndCountAll: jest.fn(async () => ({ rows: [], count: 0 })),
      findByPk: jest.fn(),
      create: jest.fn(async (data) => ({ id: '1', ...data })),
      destroy: jest.fn(async () => 1),
      ...overrides,
    };
    const sequelize = {
      transaction: jest.fn(async (cb: any) => cb({})),
    };

    const svc = new BooksService(repo as any, sequelize as any);
    return { svc, repo, sequelize };
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('findAll: usa defaults (order por createdAt DESC, where vacío, page=1, limit=10)', async () => {
    const { svc, repo } = makeService();

    const res = await svc.findAll({});
    expect(repo.findAndCountAll).toHaveBeenCalledTimes(1);
    const args = (repo.findAndCountAll as jest.Mock).mock.calls[0][0];

    expect(args.order).toEqual([['createdAt', 'DESC']]);
    expect(args.where).toEqual({});
    expect(res.page).toBe(1);
    expect(res.limit).toBe(10);
    expect(res.totalPages).toBe(1);
  });

  it('findAll: parseOrder whitelist + direcciones + ignora campos inválidos', async () => {
    const { svc, repo } = makeService();

    await svc.findAll({ sort: 'title:asc,price:desc,unknown:asc' });
    const args = (repo.findAndCountAll as jest.Mock).mock.calls[0][0];

    expect(args.order).toEqual([
      ['title', 'ASC'],
      ['price', 'DESC'],
    ]);
  });

  it('findAll: parseWhere con q (iLike OR), genre/publisher/author y available=true', async () => {
    const { svc, repo } = makeService();

    await svc.findAll({
      q: 'harry',
      genre: 'fantasy',
      publisher: 'penguin',
      author: 'rowling',
      available: 'true',
    });

    const args = (repo.findAndCountAll as jest.Mock).mock.calls[0][0];
    const where = args.where;

    // tiene símbolo Op.or y available true
    const symbols = Object.getOwnPropertySymbols(where);
    const orSym = symbols.find((s) => s === (Op as any).or);
    expect(orSym).toBeDefined();
    const orArray = where[orSym as any];
    expect(Array.isArray(orArray)).toBe(true);
    expect(orArray).toHaveLength(3);
    expect(where.genre).toBe('fantasy');
    expect(where.publisher).toBe('penguin');
    expect(where.author).toBe('rowling');
    expect(where.available).toBe(true);
  });

  it('findAll: available=false y valor inválido (no agrega available)', async () => {
    const { svc, repo } = makeService();

    await svc.findAll({ available: 'false' });
    let where = (repo.findAndCountAll as jest.Mock).mock.calls[0][0].where;
    expect(where.available).toBe(false);

    (repo.findAndCountAll as jest.Mock).mockClear();
    await svc.findAll({ available: 'maybe' as any });
    where = (repo.findAndCountAll as jest.Mock).mock.calls[0][0].where;
    expect('available' in where).toBe(false);
  });

  it('findAll: paginación y cap de limit a 100', async () => {
    const { svc, repo } = makeService();

    await svc.findAll({ page: '2', limit: '5' });
    let args = (repo.findAndCountAll as jest.Mock).mock.calls[0][0];
    expect(args.limit).toBe(5);
    expect(args.offset).toBe(5);

    (repo.findAndCountAll as jest.Mock).mockClear();
    await svc.findAll({ page: '3', limit: '10000' });
    args = (repo.findAndCountAll as jest.Mock).mock.calls[0][0];
    expect(args.limit).toBe(100); // cap
    expect(args.offset).toBe(200);
  });

  it('findOne: lanza NotFound cuando no existe', async () => {
    const { svc, repo } = makeService({ findByPk: jest.fn(async () => null) });

    await expect(svc.findOne('xx')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('findOne: retorna cuando existe', async () => {
    const book = { id: '1', title: 'T' };
    const { svc, repo } = makeService({ findByPk: jest.fn(async () => book) });

    const res = await svc.findOne('1');
    expect(res).toBe(book);
  });

  it('update: actualiza cuando existe', async () => {
    const updateMock = jest.fn(async () => void 0);
    const book = { id: '1', update: updateMock };
    const { svc, repo, sequelize } = makeService({
      findByPk: jest.fn(async () => book),
    });

    const dto = { title: 'N', available: true };
    const res = await svc.update('1', dto as any);

    expect(sequelize.transaction).toHaveBeenCalledTimes(1);
    expect(repo.findByPk).toHaveBeenCalledTimes(1);
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining(dto),
      expect.any(Object),
    );
    expect(res).toBe(book);
  });

  it('update: lanza NotFound cuando no existe', async () => {
    const { svc } = makeService({ findByPk: jest.fn(async () => null) });
    await expect(svc.update('bad', {} as any)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('softDelete: ok cuando destroy>0', async () => {
    const { svc, repo } = makeService({ destroy: jest.fn(async () => 1) });
    const res = await svc.softDelete('1');
    expect(repo.destroy).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: '1' }, individualHooks: true }),
    );
    expect(res).toEqual({ id: '1', deleted: true });
  });

  it('softDelete: NotFound cuando destroy=0', async () => {
    const { svc } = makeService({ destroy: jest.fn(async () => 0) });
    await expect(svc.softDelete('x')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('exportCsv: genera CSV con headers y filas', async () => {
    const rows = [
      {
        id: '1',
        title: 'A',
        author: 'AA',
        publisher: 'P1',
        price: 10,
        available: true,
        genre: 'G',
      },
    ];
    const { svc, repo } = makeService({
      findAndCountAll: jest.fn(async () => ({ rows, count: 1 })),
    });

    const csv = await svc.exportCsv({});
    expect(csv).toContain('id,title,author,publisher,price,available,genre');
    expect(csv).toContain('1,A,AA,P1,10,true,G');
  });
});
