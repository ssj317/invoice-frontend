import { api } from '@/lib/axios';

export type DocumentType = 'service-proposal' | 'service-agreement' | 'tax-invoice' | 'zorintech';

export interface DocumentResponse {
  success: boolean;
  message?: string;
  data: { document: any };
}

export interface DocumentsListResponse {
  success: boolean;
  data: { documents: any[]; total: number; page: number };
}

export const documentService = {
  save: async (documentType: DocumentType, data: any, title?: string, status: 'draft' | 'completed' = 'draft'): Promise<DocumentResponse> => {
    const response = await api.post('/documents', { documentType, data, title, status });
    return response.data;
  },

  update: async (id: string, data: any, status?: 'draft' | 'completed'): Promise<DocumentResponse> => {
    const response = await api.put(`/documents/${id}`, { data, ...(status ? { status } : {}) });
    return response.data;
  },

  getAll: async (documentType?: DocumentType, page = 1, limit = 20): Promise<DocumentsListResponse> => {
    const response = await api.get('/documents', { params: { ...(documentType ? { documentType } : {}), page, limit } });
    return response.data;
  },

  getOne: async (id: string): Promise<DocumentResponse> => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },

  sendEmail: async (
    id: string,
    payload: { to: string; subject?: string; message?: string; pdfBase64?: string; fileName?: string }
  ) => {
    const response = await api.post(`/documents/${id}/send-email`, payload);
    return response.data;
  }
};












// import { api } from '@/lib/axios';

// export type DocumentType = 'service-proposal' | 'service-agreement' | 'tax-invoice';

// export interface DocumentResponse {
//   success: boolean;
//   message?: string;
//   data: { document: any };
// }

// export interface DocumentsListResponse {
//   success: boolean;
//   data: { documents: any[]; total: number; page: number };
// }

// export const documentService = {
//   save: async (documentType: DocumentType, data: any, title?: string): Promise<DocumentResponse> => {
//     const response = await api.post('/documents', { documentType, data, title });
//     return response.data;
//   },

//   update: async (id: string, data: any): Promise<DocumentResponse> => {
//     const response = await api.put(`/documents/${id}`, { data });
//     return response.data;
//   },

//   getAll: async (documentType?: DocumentType): Promise<DocumentsListResponse> => {
//     const response = await api.get('/documents', { params: documentType ? { documentType } : {} });
//     return response.data;
//   },

//   getOne: async (id: string): Promise<DocumentResponse> => {
//     const response = await api.get(`/documents/${id}`);
//     return response.data;
//   },

//   delete: async (id: string) => {
//     const response = await api.delete(`/documents/${id}`);
//     return response.data;
//   },

//   sendEmail: async (
//     id: string,
//     payload: { to: string; subject?: string; message?: string; pdfBase64?: string; fileName?: string }
//   ) => {
//     const response = await api.post(`/documents/${id}/send-email`, payload);
//     return response.data;
//   }
// };
