import { api } from '@/lib/axios';
import { InvoiceData } from '@/store/invoiceSlice';

interface InvoiceResponse {
  success: boolean;
  message?: string;
  data: {
    invoice: any;
    subscription?: {
      invoicesCreated: number;
      invoiceLimit: number;
      remainingInvoices: number;
    };
  };
}

interface InvoicesListResponse {
  success: boolean;
  data: {
    invoices: any[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

interface InvoiceStatsResponse {
  success: boolean;
  data: {
    stats: Array<{
      _id: string;
      count: number;
      totalAmount: number;
    }>;
    totalInvoices: number;
    subscription: {
      plan: string;
      invoicesCreated: number;
      invoiceLimit: number;
      remainingInvoices: number;
    } | null;
  };
}

// Helper function to clean invoice data for API
const cleanInvoiceData = (data: any) => {
  console.log('cleanInvoiceData input:', data);
  
  // Deep clone
  const cleaned = JSON.parse(JSON.stringify(data));
  
  console.log('After JSON parse/stringify:', cleaned);
  console.log('columnConfiguration after clone:', cleaned.columnConfiguration, typeof cleaned.columnConfiguration);
  
  // Ensure columnConfiguration is an array
  if (cleaned.columnConfiguration) {
    if (typeof cleaned.columnConfiguration === 'string') {
      console.log('columnConfiguration is a string, attempting to parse...');
      try {
        cleaned.columnConfiguration = JSON.parse(cleaned.columnConfiguration);
        console.log('Successfully parsed columnConfiguration:', cleaned.columnConfiguration);
      } catch (e) {
        console.error('Failed to parse columnConfiguration:', e);
        cleaned.columnConfiguration = [];
      }
    } else if (!Array.isArray(cleaned.columnConfiguration)) {
      console.warn('columnConfiguration is not an array, converting to empty array');
      cleaned.columnConfiguration = [];
    }
  } else {
    cleaned.columnConfiguration = [];
  }
  
  // Ensure other array fields are arrays
  const arrayFields = ['items', 'groups', 'terms', 'attachments', 'customFields', 'additionalInfo'];
  arrayFields.forEach(field => {
    if (cleaned[field]) {
      if (typeof cleaned[field] === 'string') {
        try {
          cleaned[field] = JSON.parse(cleaned[field]);
        } catch (e) {
          cleaned[field] = [];
        }
      } else if (!Array.isArray(cleaned[field])) {
        cleaned[field] = [];
      }
    } else {
      cleaned[field] = [];
    }
  });
  
  console.log('Final cleaned data:', cleaned);
  return cleaned;
};

export const invoiceService = {
  // Create invoice
  createInvoice: async (invoiceData: Partial<InvoiceData>): Promise<InvoiceResponse> => {
    console.log('invoiceService.createInvoice - raw input:', invoiceData);
    console.log('columnConfiguration before sending:', invoiceData.columnConfiguration);
    
    // Send data directly without any transformation
    const response = await api.post('/invoices', invoiceData);
    return response.data;
  },

  // Get all invoices
  getInvoices: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    templateType?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<InvoicesListResponse> => {
    const response = await api.get('/invoices', { params });
    return response.data;
  },

  // Get single invoice
  getInvoice: async (id: string): Promise<InvoiceResponse> => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  // Update invoice
  updateInvoice: async (id: string, invoiceData: Partial<InvoiceData>): Promise<InvoiceResponse> => {
    const response = await api.put(`/invoices/${id}`, invoiceData);
    return response.data;
  },

  // Delete invoice
  deleteInvoice: async (id: string) => {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },

  // Get invoice statistics
  getInvoiceStats: async (): Promise<InvoiceStatsResponse> => {
    const response = await api.get('/invoices/stats');
    return response.data;
  },

  // Get last invoice by template type
  getLastInvoice: async (templateType: string): Promise<InvoiceResponse> => {
    const response = await api.get(`/invoices/last/${templateType}`);
    return response.data;
  },

  // Send invoice via email
  sendInvoiceEmail: async (id: string, payload: { to: string; subject?: string; message?: string; pdfBase64?: string; fileName?: string }) => {
    const response = await api.post(`/invoices/${id}/send-email`, payload);
    return response.data;
  },
};
