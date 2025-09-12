import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from '../src/books/books.controller';
import { BooksService } from '../src/books/books.service';
import { AuditService } from '../src/audit/audit.service';
import { Reflector } from '@nestjs/core';

describe('BooksController - export', () => {
  let controller: BooksController;
  let service: { exportCsv: jest.Mock };

  beforeEach(async () => {
    service = { exportCsv: jest.fn().mockResolvedValue('id,title\n1,Test\n') } as any;
    const mockAuditService = { log: jest.fn() };
    const mockReflector = { get: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        { provide: BooksService, useValue: service },
        { provide: AuditService, useValue: mockAuditService },
        { provide: Reflector, useValue: mockReflector },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  it('should send CSV with proper headers', async () => {
    const res = {
      setHeader: jest.fn(),
      send: jest.fn(),
    } as any;

    await controller.export({ q: 'test' } as any, res);

    expect(service.exportCsv).toHaveBeenCalledWith({ q: 'test' });
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename="books.csv"',
    );
    expect(res.send).toHaveBeenCalledWith('id,title\n1,Test\n');
  });
});
