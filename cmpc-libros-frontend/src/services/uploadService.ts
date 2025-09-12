import api from './api';

export interface UploadResponse {
  readonly success: boolean;
  readonly data: {
    readonly filename: string;
    readonly originalName: string;
    readonly size: number;
    readonly mimetype: string;
    readonly imageUrl: string;
  };
}

export const uploadService = {
  /**
   * Uploads a book image file to the backend
   */
  uploadBookImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/upload/book-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
