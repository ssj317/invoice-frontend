// ﻿import { api } from '@/lib/axios';

// interface LoginCredentials {
//   email: string;
//   password: string;
// }

// interface SignupData {
//   fullName: string;
//   email: string;
//   password: string;
//   companyName?: string;
// }

// interface AuthResponse {
//   success: boolean;
//   message: string;
//   data: {
//     user: {
//       id: string;
//       fullName: string;
//       email: string;
//       companyName?: string;
//     };
//     token: string;
//   };
// }

// interface LoginInitResponse {
//   success: boolean;
//   requiresOtp: boolean;
//   message: string;
//   email: string;
// }

// export const authService = {
//   login: async (credentials: LoginCredentials): Promise<LoginInitResponse> => {
//     const response = await api.post('/auth/login', credentials);
//     return response.data;
//   },

//   verifyOtp: async (email: string, otp: string): Promise<AuthResponse> => {
//     const response = await api.post('/auth/verify-otp', { email, otp });
//     return response.data;
//   },

//   resendOtp: async (email: string): Promise<{ success: boolean; message: string }> => {
//     const response = await api.post('/auth/resend-otp', { email });
//     return response.data;
//   },

//   signup: async (data: SignupData): Promise<AuthResponse> => {
//     const response = await api.post('/auth/signup', data);
//     return response.data;
//   },

//   getCurrentUser: async () => {
//     const response = await api.get('/auth/me');
//     return response.data;
//   },

//   logout: () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     localStorage.removeItem('isAuthenticated');
//   },
// };

import { api } from '@/lib/axios';

interface LoginCredentials {
  email: string;
}

interface SignupData {
  fullName: string;
  email: string;
  companyName?: string;
}

interface OtpInitResponse {
  success: boolean;
  requiresOtp: boolean;
  message: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: { id: string; fullName: string; email: string; companyName?: string; };
    token: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<OtpInitResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  signup: async (data: SignupData): Promise<OtpInitResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  verifyOtp: async (email: string, otp: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  resendOtp: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  },
};

