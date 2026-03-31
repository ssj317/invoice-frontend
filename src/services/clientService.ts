import { api } from '@/lib/axios';

export interface ClientData {
  _id?: string;
  businessName: string;
  businessAlias?: string;
  industry?: string;
  country?: string;
  city?: string;
  gstin?: string;
  pan?: string;
  clientType?: string;
  taxTreatment?: string;
  addressCountry?: string;
  state?: string;
  addressCity?: string;
  postalCode?: string;
  streetAddress?: string;
  email?: string;
  showEmailInInvoice?: boolean;
  phoneCode?: string;
  phone?: string;
  showPhoneInInvoice?: boolean;
  defaultDueDays?: string;
  logo?: string;
  uniqueKey?: string;
}

export const clientService = {
  getClients: async (): Promise<ClientData[]> => {
    const res = await api.get('/clients');
    return res.data.data;
  },

  createClient: async (client: ClientData): Promise<ClientData> => {
    const res = await api.post('/clients', client);
    return res.data.data;
  },

  updateClient: async (id: string, client: Partial<ClientData>): Promise<ClientData> => {
    const res = await api.put(`/clients/${id}`, client);
    return res.data.data;
  },

  deleteClient: async (id: string): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};
