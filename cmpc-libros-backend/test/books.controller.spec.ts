import { BooksController } from '../src/books/books.controller';

const svc = {
  findAll: jest.fn().mockResolvedValue({
    items: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  }),
  exportCsv: jest.fn().mockResolvedValue('id,title\n'),
};

describe('BooksController', () => {
  let c: BooksController;
  beforeEach(() => {
    c = new BooksController(svc as any);
  });

  it('findAll delega en servicio', async () => {
    const res = await c.findAll({});
    expect(res.items).toBeDefined();
  });
});
