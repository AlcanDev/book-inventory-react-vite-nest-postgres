import { BooksController } from '../src/books/books.controller';
import { BooksService } from '../src/books/books.service';

describe('BooksController more branches', () => {
  function makeController(overrides?: Partial<BooksService>) {
    const service: any = {
      findAll: jest.fn(async (q) => ({
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        q,
      })),
      exportCsv: jest.fn(async () => 'id,title\n1,A'),
      create: jest.fn(async (dto) => ({ id: '1', ...dto })),
      findOne: jest.fn(async (id) => ({ id })),
      update: jest.fn(async (id, dto) => ({ id, ...dto })),
      softDelete: jest.fn(async (id) => ({ id, deleted: true })),
      ...overrides,
    };
    const ctrl = new BooksController(service);
    return { ctrl, service };
  }

  beforeEach(() => jest.clearAllMocks());

  it('GET /books -> delega en service.findAll con query DTO', async () => {
    const { ctrl, service } = makeController();
    const q: any = {
      q: 'abc',
      genre: 'g1',
      page: '2',
      limit: '5',
      sort: 'title:asc',
    };
    const res = await ctrl.findAll(q);
    expect(service.findAll).toHaveBeenCalledWith(q);
    expect(res).toEqual(expect.objectContaining({ page: 1, limit: 10 })); // mock por defecto
  });

  it('GET /books/export -> setea headers y envía CSV', async () => {
    const { ctrl, service } = makeController();
    const res: any = {
      headers: {} as Record<string, string>,
      body: '',
      setHeader(key: string, val: string) {
        this.headers[key] = val;
      },
      send(payload: string) {
        this.body = payload;
      },
    };
    await ctrl.export({} as any, res);

    expect(service.exportCsv).toHaveBeenCalled();
    expect(res.headers['Content-Type']).toBe('text/csv');
    expect(res.headers['Content-Disposition']).toContain(
      'filename="books.csv"',
    );
    expect(res.body).toBe('id,title\n1,A');
  });

  it('POST /books -> delega create', async () => {
    const { ctrl, service } = makeController();
    const dto: any = { title: 'A', author: 'B' };
    const created = await ctrl.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(created).toEqual(expect.objectContaining({ id: '1', title: 'A' }));
  });

  it('GET /books/:id -> delega findOne', async () => {
    const { ctrl, service } = makeController();
    const result = await ctrl.findOne('123');
    expect(service.findOne).toHaveBeenCalledWith('123');
    expect(result).toEqual({ id: '123' });
  });

  it('PATCH /books/:id -> delega update', async () => {
    const { ctrl, service } = makeController();
    const dto: any = { title: 'N' };
    const result = await ctrl.update('9', dto);
    expect(service.update).toHaveBeenCalledWith('9', dto);
    expect(result).toEqual({ id: '9', title: 'N' });
  });

  it('DELETE /books/:id -> delega softDelete', async () => {
    const { ctrl, service } = makeController();
    const result = await ctrl.remove('7');
    expect(service.softDelete).toHaveBeenCalledWith('7');
    expect(result).toEqual({ id: '7', deleted: true });
  });
});
