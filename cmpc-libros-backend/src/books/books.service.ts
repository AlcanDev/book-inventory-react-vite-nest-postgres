import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Book } from './book.model';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Op, Order, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { stringify } from 'csv-stringify/sync';

type FindAllParams = {
  q?: string;
  genre?: string;
  publisher?: string;
  author?: string;
  available?: string;
  page?: string;
  limit?: string;
  sort?: string;
};

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book) private readonly booksRepo: typeof Book,
    private readonly sequelize: Sequelize,
  ) {}

  private parseOrder(sort?: string): Order {
    if (!sort) return [['createdAt', 'DESC']];
    const whitelist = new Set([
      'title',
      'author',
      'publisher',
      'price',
      'available',
      'genre',
      'createdAt',
      'updatedAt',
    ] as const);

    const order: Order = [];
    for (const pair of sort.split(',')) {
      const [rawField, rawDir] = pair.split(':').map((s) => s?.trim());
      if (!rawField || !whitelist.has(rawField as any)) continue;
      const dir = (rawDir || 'desc').toUpperCase();
      order.push([rawField, dir === 'ASC' ? 'ASC' : 'DESC']);
    }
    return order.length ? order : [['createdAt', 'DESC']];
  }

  private parseWhere(params: FindAllParams): WhereOptions {
    const where: WhereOptions = {};
    if (params.q) {
      const like = `%${params.q}%`;
      Object.assign(where, {
        [Op.or]: [
          { title: { [Op.iLike]: like } },
          { author: { [Op.iLike]: like } },
          { publisher: { [Op.iLike]: like } },
        ],
      });
    }
    if (params.genre) where['genre'] = params.genre;
    if (params.publisher) where['publisher'] = params.publisher;
    if (params.author) where['author'] = params.author;
    if (typeof params.available === 'string') {
      const v = params.available.toLowerCase();
      if (v === 'true' || v === 'false') where['available'] = v === 'true';
    }
    return where;
  }

  async findAll(params: FindAllParams) {
    const page = Math.max(parseInt(params.page ?? '1', 10) || 1, 1);
    const limitRaw = Math.max(parseInt(params.limit ?? '10', 10) || 10, 1);
    const limit = Math.min(limitRaw, 100);
    const offset = (page - 1) * limit;

    const { rows, count } = await this.booksRepo.findAndCountAll({
      where: this.parseWhere(params),
      order: this.parseOrder(params.sort),
      limit,
      offset,
    });

    return {
      items: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit) || 1,
    };
  }

  async create(dto: CreateBookDto) {
    return this.sequelize.transaction(async (t) => {
      const created = await this.booksRepo.create(
        {
          title: dto.title,
          author: dto.author,
          publisher: dto.publisher,
          price: dto.price,
          available: dto.available,
          genre: dto.genre,
          imageUrl: dto.imageUrl ?? null,
        },
        { transaction: t },
      );
      return created;
    });
  }

  async findOne(id: string) {
    const book = await this.booksRepo.findByPk(id);
    if (!book) throw new NotFoundException('Libro no encontrado');
    return book;
  }

  async update(id: string, dto: UpdateBookDto) {
    return this.sequelize.transaction(async (t) => {
      const book = await this.booksRepo.findByPk(id, { transaction: t });
      if (!book) throw new NotFoundException('Libro no encontrado');
      await book.update(
        {
          ...(dto.title !== undefined && { title: dto.title }),
          ...(dto.author !== undefined && { author: dto.author }),
          ...(dto.publisher !== undefined && { publisher: dto.publisher }),
          ...(dto.price !== undefined && { price: dto.price }),
          ...(dto.available !== undefined && { available: dto.available }),
          ...(dto.genre !== undefined && { genre: dto.genre }),
          ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        },
        { transaction: t },
      );
      return book;
    });
  }

  async softDelete(id: string) {
    return this.sequelize.transaction(async (t) => {
      const deleted = await this.booksRepo.destroy({
        where: { id },
        transaction: t,
        individualHooks: true,
      });
      if (!deleted) throw new NotFoundException('Libro no encontrado');
      return { id, deleted: true };
    });
  }

  async exportCsv(params: FindAllParams) {
    const data = await this.findAll({ ...params, page: '1', limit: '10000' });
    const records = data.items.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      publisher: b.publisher,
      price: b.price,
      available: String(b.available),
      genre: b.genre,
    }));
    const csv = stringify(records, { header: true });
    return csv;
  }
}
