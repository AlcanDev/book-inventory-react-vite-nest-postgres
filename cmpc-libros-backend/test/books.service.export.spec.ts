import { BooksService } from '../src/books/books.service';

// Minimal stubs for constructor deps
const modelStub: any = {};
const sequelizeStub: any = { transaction: async (fn: any) => fn({}) };

describe('BooksService - exportCsv', () => {
  it('should generate a CSV with expected headers and values', async () => {
    const service = new BooksService(modelStub, sequelizeStub as any);
    // Spy on findAll to avoid hitting the DB/model
    jest.spyOn(service as any, 'findAll').mockResolvedValue({
      items: [
        {
          id: '1',
          title: 'Clean Code',
          author: 'Robert C. Martin',
          publisher: 'Prentice Hall',
          price: '19990.00',
          available: true,
          genre: 'Software',
        },
      ],
      total: 1,
      page: 1,
      limit: 10000,
      totalPages: 1,
    });

    const csv = await service.exportCsv({ q: 'clean' } as any);

    expect(csv).toContain('id,title,author,publisher,price,available,genre');
    expect(csv).toContain('1');
    expect(csv).toContain('Clean Code');
    expect(csv).toContain('Robert C. Martin');
    expect(csv).toContain('Prentice Hall');
    expect(csv).toContain('19990.00');
    expect(csv).toContain('true');
    expect(csv).toContain('Software');
    expect((service as any).findAll).toHaveBeenCalledWith({ q: 'clean', page: '1', limit: '10000' });
  });
});
