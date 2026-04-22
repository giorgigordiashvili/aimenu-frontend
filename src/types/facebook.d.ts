// Ambient declaration for the Facebook JavaScript SDK. The SDK attaches
// itself to `window.FB` once connect.facebook.net/en_US/sdk.js finishes
// loading — TypeScript has no idea that exists otherwise, so typing it
// inline keeps callers from having to `@ts-ignore` every FB call.

interface FBInitOptions {
  appId?: string;
  cookie: boolean;
  xfbml: boolean;
  version: string;
}

interface FBAuthResponse {
  accessToken: string;
  userID?: string;
  expiresIn?: number;
}

interface FBLoginResponse {
  status: 'connected' | 'not_authorized' | 'unknown';
  authResponse?: FBAuthResponse;
}

interface FBSdk {
  init(options: FBInitOptions): void;
  login(cb: (response: FBLoginResponse) => void, options?: { scope: string }): void;
}

interface Window {
  FB?: FBSdk;
}
