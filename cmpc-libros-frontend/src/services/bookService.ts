import api from "./api";

/** Local types for service usage (not exported to keep one export per file) */
interface BookDto {
  readonly id?: string;
  readonly title: string;
  readonly author: string;
  readonly publisher: string;
  readonly price: string; // backend expects string decimal
  readonly available: boolean;
  readonly genre: string;
  readonly imageUrl?: string | null;
}

interface BookListQuery {
  readonly q?: string;
  readonly genre?: string;
  readonly publisher?: string;
  readonly author?: string;
  readonly available?: "true" | "false";
  readonly page?: number;
  readonly limit?: number;
  readonly sort?: string; // e.g. "price:asc,title:desc"
}

interface ApiEnvelope<T> {
  readonly success: boolean;
  readonly data: T;
}

interface Paginated<T> {
  readonly items: ReadonlyArray<T>;
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}

/**
 * Book service for CRUD, listing and export operations.
 */
export const bookService = {
  /** Get books with filters, search, pagination and sorting */
  getBooks: async (params: BookListQuery = {}): Promise<ApiEnvelope<Paginated<BookDto>>> => {
    try {
      const response = await api.get<ApiEnvelope<Paginated<BookDto>>>("/books", { params });
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err: any = error as any;
      throw err?.response?.data || error;
    }
  },

  /** Get single book by ID */
  getBook: async (id: string): Promise<ApiEnvelope<BookDto>> => {
    try {
      const response = await api.get<ApiEnvelope<BookDto>>(`/books/${id}`);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err: any = error as any;
      throw err?.response?.data || error;
    }
  },

  /** Create new book */
  createBook: async (bookData: BookDto): Promise<ApiEnvelope<BookDto>> => {
    try {
      const response = await api.post<ApiEnvelope<BookDto>>("/books", bookData);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err: any = error as any;
      throw err?.response?.data || error;
    }
  },

  /** Update book */
  updateBook: async (id: string, bookData: Partial<BookDto>): Promise<ApiEnvelope<BookDto>> => {
    try {
      const response = await api.patch<ApiEnvelope<BookDto>>(`/books/${id}`, bookData);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err: any = error as any;
      throw err?.response?.data || error;
    }
  },

  /** Soft delete book */
  deleteBook: async (id: string): Promise<ApiEnvelope<{ id: string; deleted: boolean }>> => {
    try {
      const response = await api.delete<ApiEnvelope<{ id: string; deleted: boolean }>>(`/books/${id}`);
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err: any = error as any;
      throw err?.response?.data || error;
    }
  },

  /** Export filtered books as CSV blob */
  exportBooks: async (params: BookListQuery = {}): Promise<Blob> => {
    try {
      const response = await api.get<Blob>("/books/export", {
        params,
        responseType: "blob",
      });
      return response.data;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err: any = error as any;
      throw err?.response?.data || error;
    }
  },
};
