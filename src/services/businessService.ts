import { api } from '@/lib/axios';

export interface BusinessProfileData {
  vendorName?: string;
  country?: string;
  city?: string;
  gstin?: string;
  pan?: string;
  addressCountry?: string;
  state?: string;
  addressCity?: string;
  postalCode?: string;
  streetAddress?: string;
  logo?: string;
}

export const businessService = {
  // Fetch the current user's business profile
  getProfile: async (): Promise<BusinessProfileData | null> => {
    const res = await api.get('/business-profile');
    return res.data.data; // null if not set yet
  },

  // Create or update the current user's business profile
  saveProfile: async (data: BusinessProfileData): Promise<BusinessProfileData> => {
    const res = await api.put('/business-profile', data);
    return res.data.data;
  },
};
