import axiosInstance from '@/api/axios';

export interface EmailCheckResult {
  exists: boolean;
  has_restaurants: boolean;
}

/** Does an account with this email already exist? (POST /api/v1/auth/email-check/) */
export async function emailCheck(email: string): Promise<EmailCheckResult> {
  const { data } = await axiosInstance.post<{ success: boolean; data: EmailCheckResult }>(
    '/api/v1/auth/email-check/',
    { email }
  );
  return data.data;
}
