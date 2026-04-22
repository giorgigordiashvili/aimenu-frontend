'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import axiosInstance from '@/api/axios';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';

// Shared login-flow glue used by both LoginForm and RegisterForm. The two
// forms differ only in: (a) the register form wants the ?ref= code in the
// URL to flow through, (b) the register form should navigate to the home
// page on success while the login form should honor the ?redirect= param.
// Everything else — token exchange, AuthContext sync, error surfacing — is
// identical, so it lives here.
//
// Flow:
//  1. User clicks "Continue with Google" / "Continue with Facebook".
//  2. Provider SDK opens the popup, user consents, SDK hands us an
//     access_token.
//  3. We POST { access_token, referral_code? } to the corresponding backend
//     endpoint. Backend verifies the token with the provider, creates or
//     links the User, and returns { access, refresh, user }.
//  4. AuthContext.login() writes the tokens + cookie and hydrates user state.
//  5. Push to the post-auth destination.

interface Options {
  /** Referral code to include (register page only). Ignored when blank. */
  referralCode?: string;
  /** Called with the provider's error message on failure. */
  onError?: (message: string) => void;
}

export function useSocialAuth({ referralCode, onError }: Options = {}) {
  const { login } = useAuth();
  const { locale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const postToBackend = useCallback(
    async (provider: 'google' | 'facebook', accessToken: string) => {
      const body: Record<string, string> = { access_token: accessToken };
      if (referralCode) body.referral_code = referralCode.toUpperCase();
      try {
        const { data } = await axiosInstance.post<{
          access: string;
          refresh: string;
          user: unknown;
        }>(`/api/v1/auth/social/${provider}/`, body);
        await login({ access: data.access, refresh: data.refresh });
        const redirect = searchParams.get('redirect');
        router.push(redirect || localePath(locale));
      } catch (err) {
        const axiosErr = err as {
          response?: { data?: { detail?: string; non_field_errors?: string[] } };
        };
        const detail =
          axiosErr?.response?.data?.detail ??
          axiosErr?.response?.data?.non_field_errors?.[0] ??
          null;
        onError?.(detail ?? 'Social login failed. Please try again.');
      }
    },
    [login, locale, onError, referralCode, router, searchParams]
  );

  const google = useGoogleLogin({
    onSuccess: response => postToBackend('google', response.access_token),
    onError: () => onError?.('Google sign-in was cancelled.'),
    flow: 'implicit',
  });

  const facebook = useCallback(() => {
    if (typeof window === 'undefined' || !window.FB) {
      onError?.('Facebook SDK is still loading. Please try again in a moment.');
      return;
    }
    window.FB.login(
      response => {
        if (response.authResponse?.accessToken) {
          postToBackend('facebook', response.authResponse.accessToken);
        } else {
          onError?.('Facebook sign-in was cancelled.');
        }
      },
      { scope: 'email,public_profile' }
    );
  }, [onError, postToBackend]);

  return { google, facebook };
}
