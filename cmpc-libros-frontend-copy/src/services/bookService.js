import api from "./api";

export const bookService = {
  // Get books with filters, search, pagination, and sorting
  getBooks: async (params = {}) => {
    try {
      const response = await api?.get("/books", { params });
      console.log("Books fetched:", response?.data);
      return response?.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Get single book by ID
  getBook: async (id) => {
    try {
      const response = await api?.get(`/books/${id}`);
      return response?.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Create new book
  createBook: async (bookData) => {
    try {
      const response = await api?.post("/books", bookData);
      return response?.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Update book
  updateBook: async (id, bookData) => {
    try {
      const response = await api?.patch(`/books/${id}`, bookData);
      return response?.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Delete book
  deleteBook: async (id) => {
    try {
      const response = await api?.delete(`/books/${id}`);
      return response?.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Export books as CSV
  exportBooks: async (params = {}) => {
    try {
      const response = await api?.get("/books/export", {
        params,
        responseType: "blob",
      });
      return response?.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};
