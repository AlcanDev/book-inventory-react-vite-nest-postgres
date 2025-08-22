import { BooksService } from '../src/books/books.service';
import { Sequelize } from 'sequelize-typescript';

const repo = {
  findAndCountAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  destroy: jest.fn(),
};

const sequelize = {
  // Simula una transacción de Sequelize; el servicio hace "await" sobre esto
  transaction: (fn: any) => Promise.resolve(fn({})),
} as unknown as Sequelize;

describe('BooksService', () => {
  let svc: BooksService;

  beforeEach(() => {
    jest.clearAllMocks();
    svc = new BooksService(repo as any, sequelize);
  });

  it('findAll aplica paginación, orden y retorna metadatos correctos', async () => {
    (repo.findAndCountAll as any).mockResolvedValue({
      rows: [{ id: '1' }],
      count: 12,
    });

    const res = await svc.findAll({
      page: '2',
      limit: '5',
      sort: 'price:asc,title:desc',
    });

    // Verifica parámetros enviados al repo
    expect(repo.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 5,
        offset: 5, // (page-1)*limit = (2-1)*5
        order: [
          ['price', 'ASC'],
          ['title', 'DESC'],
        ],
      }),
    );

    // Verifica forma del resultado
    expect(res.page).toBe(2);
    expect(res.limit).toBe(5);
    expect(res.total).toBe(12);
    expect(res.totalPages).toBe(3);
    expect(res.items).toHaveLength(1);
  });

  it('create usa transacción y retorna el registro creado', async () => {
    (repo.create as any).mockResolvedValue({ id: '1' });

    const dto = {
      title: 't',
      author: 'a',
      publisher: 'p',
      price: '10.00',
      available: true,
      genre: 'g',
      imageUrl: 'http://img.test/x.png',
    };

    const out = await svc.create(dto as any);

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 't',
        author: 'a',
        publisher: 'p',
        price: '10.00',
        available: true,
        genre: 'g',
        imageUrl: 'http://img.test/x.png',
      }),
      { transaction: expect.any(Object) },
    );
    expect(out.id).toBe('1');
  });

  it('findOne lanza NotFound si no existe', async () => {
    (repo.findByPk as any).mockResolvedValue(null);
    await expect(svc.findOne('nope')).rejects.toThrow('Libro no encontrado');
  });

  it('update usa transacción y actualiza campos provistos', async () => {
    const update = jest.fn().mockResolvedValue(true);
    (repo.findByPk as any).mockResolvedValue({ update });

    const dto = { title: 'Nuevo título', available: false } as any;
    const result = await svc.update('1', dto);

    expect(repo.findByPk).toHaveBeenCalledWith('1', {
      transaction: expect.any(Object),
    });
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Nuevo título',
        available: false,
      }),
      { transaction: expect.any(Object) },
    );
    // Devuelve la misma instancia (mock) tras actualizar
    expect(result).toEqual({ update });
  });

  it('softDelete elimina lógicamente y retorna confirmación', async () => {
    (repo.destroy as any).mockResolvedValue(1);

    const res = await svc.softDelete('abc');
    expect(repo.destroy).toHaveBeenCalledWith({
      where: { id: 'abc' },
      transaction: expect.any(Object),
      individualHooks: true,
    });
    expect(res).toEqual({ id: 'abc', deleted: true });
  });

  it('softDelete lanza NotFound si no existe', async () => {
    (repo.destroy as any).mockResolvedValue(0);
    await expect(svc.softDelete('missing')).rejects.toThrow(
      'Libro no encontrado',
    );
  });

  it('exportCsv construye CSV con encabezados esperados', async () => {
    // Espiamos findAll para no depender del repo aquí
    const spy = jest.spyOn(svc, 'findAll').mockResolvedValue({
      items: [
        {
          id: '1',
          title: 'T',
          author: 'A',
          publisher: 'P',
          price: '10.00',
          available: true,
          genre: 'G',
        } as any,
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    const csv = await svc.exportCsv({});
    expect(spy).toHaveBeenCalled();

    // Encabezados y contenido mínimo
    expect(csv).toContain('id,title,author,publisher,price,available,genre');
    expect(csv).toContain('1,T,A,P,10.00,true,G');
  });
});
