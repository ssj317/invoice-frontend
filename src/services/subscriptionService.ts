import { api } from '@/lib/axios';

interface SubscriptionResponse {
  success: boolean;
  message?: string;
  data: {
    subscription: {
      _id: string;
      userId: string;
      plan: 'free' | 'basic' | 'premium' | 'enterprise';
      invoiceLimit: number;
      invoicesCreated: number;
      paymentStatus: string;
      features: {
        unlimitedInvoices: boolean;
        customBranding: boolean;
        advancedReports: boolean;
        prioritySupport: boolean;
        multipleUsers: boolean;
      };
      startDate: string;
      endDate: string | null;
      billingCycle: string | null;
      amount: number;
      currency: string;
    };
    trialInfo: {
      isTrialActive: boolean;
      trialDaysRemaining: number;
      trialEndDate: string;
    } | null;
    planDetails?: {
      name: string;
      invoiceLimit: number;
      amount: number;
      features: any;
    };
    availablePlans?: any;
  };
}

export const subscriptionService = {
  // Get current subscription
  getSubscription: async (): Promise<SubscriptionResponse> => {
    const response = await api.get('/subscription');
    return response.data;
  },

  // Upgrade subscription
  upgradeSubscription: async (plan: string, billingCycle: 'monthly' | 'yearly'): Promise<SubscriptionResponse> => {
    const response = await api.post('/subscription/upgrade', { plan, billingCycle });
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async (): Promise<SubscriptionResponse> => {
    const response = await api.post('/subscription/cancel');
    return response.data;
  },
};
