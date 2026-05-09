import { useAuth } from './useAuth';

const ALLOWED_EMAILS = ['lokesh916635@gmail.com'];
const ALLOWED_DOMAIN = 'elite8digital.in';

export const useDocumentAccess = (): boolean => {
  const { user } = useAuth();
  const email = user?.email?.toLowerCase() || '';
  return ALLOWED_EMAILS.includes(email) || email.endsWith(`@${ALLOWED_DOMAIN}`);
};
