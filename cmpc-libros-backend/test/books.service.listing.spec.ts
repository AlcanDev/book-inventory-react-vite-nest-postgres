import { BooksService } from '../src/books/books.service';

// Mocks
const sequelizeMock: any = {};

function makeService(findAndCountAllImpl?: jest.Mock) {
  const booksRepo = {
    findAndCountAll: findAndCountAllImpl || jest.fn().mockResolvedValue({ rows: [], count: 0 }),
  } as any;
  return { service: new BooksService(booksRepo, sequelizeMock), booksRepo } as const;
}

describe('BooksService - listing helpers', () => {
  it('parseOrder: returns default when empty and respects whitelist and directions', () => {
    const { service } = makeService();
    const parseOrder = (service as any).parseOrder.bind(service);

    expect(parseOrder(undefined)).toEqual([["createdAt", "DESC"]]);
    expect(parseOrder('title:asc')).toEqual([["title", "ASC"]]);
    expect(parseOrder('title:asc,author:desc')).toEqual([["title", "ASC"], ["author", "DESC"]]);
    // Unknown field ignored; fallback to default when everything invalid
    expect(parseOrder('unknown:asc')).toEqual([["createdAt", "DESC"]]);
    // Direction normalization
    expect(parseOrder('price:ASC')).toEqual([["price", "ASC"]]);
    expect(parseOrder('price:foo')).toEqual([["price", "DESC"]]);
  });

  it('parseWhere: builds OR like for q and exact matches for filters including available bool', () => {
    const { service } = makeService();
    const parseWhere = (service as any).parseWhere.bind(service);
    const where = parseWhere({ q: 'clean', genre: 'Software', publisher: 'PH', author: 'Uncle', available: 'true' });

    expect(where).toMatchObject({
      genre: 'Software',
      publisher: 'PH',
      author: 'Uncle',
      available: true,
    });
    // Ensure OR like structure exists
    expect(where).toHaveProperty('Symbol(or)');
  });

  it('findAll: applies pagination defaults and caps limit to 100', async () => {
    const findAndCountAll = jest.fn().mockResolvedValue({ rows: [1, 2, 3], count: 1234 });
    const { service, booksRepo } = makeService(findAndCountAll);

    // No params => defaults
    const res = await service.findAll({} as any);
    expect(booksRepo.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 10, offset: 0, order: [["createdAt", "DESC"]] }),
    );
    expect(res.page).toBe(1);
    expect(res.limit).toBe(10);
    expect(res.total).toBe(1234);
    expect(res.totalPages).toBe(Math.ceil(1234 / 10));

    // Limit > 100 caps to 100 and page arithmetic
    await service.findAll({ page: '2', limit: '1000' } as any);
    expect(booksRepo.findAndCountAll).toHaveBeenLastCalledWith(
      expect.objectContaining({ limit: 100, offset: 100 }),
    );
  });

  it('findAll: passes parsed where and order from inputs', async () => {
    const findAndCountAll = jest.fn().mockResolvedValue({ rows: [], count: 0 });
    const { service } = makeService(findAndCountAll);

    await service.findAll({ q: 'abc', sort: 'title:asc,price:desc', genre: 'Tech' } as any);

    const callArg = findAndCountAll.mock.calls[0][0];
    expect(callArg.order).toEqual([["title", "ASC"], ["price", "DESC"]]);
    expect(callArg.where).toMatchObject({ genre: 'Tech' });
  });
});
