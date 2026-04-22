'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import Script from 'next/script';

// Client-side wrapper for the third-party auth SDKs. Sits inside the server
// layout so Next renders the tree fine; the 'use client' marker is what
// lets @react-oauth/google mount (it uses React hooks internally).
//
// Google: GoogleOAuthProvider loads gsi/client from Google's CDN and exposes
// a context that useGoogleLogin() reads to open the popup.
//
// Facebook: next/script loads sdk.js at idle time (strategy=afterInteractive
// keeps it off the critical path). Once it's loaded, window.FB.init()
// registers the app id so FB.login() can open the dialog.

interface Props {
  googleClientId?: string;
  facebookAppId?: string;
  children: React.ReactNode;
}

export default function AuthScripts({ googleClientId, facebookAppId, children }: Props) {
  // When no client_id is configured (local dev without credentials), skip
  // GoogleOAuthProvider so it doesn't throw at mount. The password flow
  // still works; the Google button call will just fail at click time.
  const body = googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>{children}</GoogleOAuthProvider>
  ) : (
    <>{children}</>
  );

  return (
    <>
      {body}
      {facebookAppId ? (
        <Script
          id='facebook-sdk'
          strategy='afterInteractive'
          src='https://connect.facebook.net/en_US/sdk.js'
          onLoad={() => {
            window.FB?.init({
              appId: facebookAppId,
              cookie: false,
              xfbml: false,
              version: 'v19.0',
            });
          }}
        />
      ) : null}
    </>
  );
}
