/**
 * Parse the backend's error envelope into something forms can show.
 *
 * The API wraps every error as
 *   { success: false, error: { code, message, details, codes, retry_after } }
 * where `details` is DRF's {field: [message]} map and `codes` the matching
 * {field: [code]} map. Raw DRF shapes ({detail} / {field: [...]}) are still
 * understood so a stale server never leaves a form silent.
 */

export interface ApiError {
  status: number | null;
  /** Top-level code (e.g. "no_active_account", "throttled", "validation_error"). */
  code: string | null;
  /** Backend's own human-readable message, English. */
  message: string | null;
  /** {field: first message} */
  fields: Record<string, string>;
  /** {field: [codes]} */
  codes: Record<string, string[]>;
  retryAfter: number | null;
  network: boolean;
}

type Envelope = {
  success?: boolean;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
    codes?: Record<string, string[]>;
    retry_after?: number;
  };
  detail?: unknown;
  [key: string]: unknown;
};

function firstString(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    for (const v of value) {
      const s = firstString(v);
      if (s) return s;
    }
    return null;
  }
  if (value && typeof value === 'object') {
    for (const v of Object.values(value as Record<string, unknown>)) {
      const s = firstString(v);
      if (s) return s;
    }
  }
  return null;
}

export function parseApiError(err: unknown): ApiError {
  const out: ApiError = {
    status: null,
    code: null,
    message: null,
    fields: {},
    codes: {},
    retryAfter: null,
    network: false,
  };
  if (!err || typeof err !== 'object') return out;
  const axiosErr = err as { response?: { status?: number; data?: Envelope }; message?: string };
  if (!axiosErr.response) {
    out.network = axiosErr.message === 'Network Error' || !!axiosErr.message;
    return out;
  }
  out.status = axiosErr.response.status ?? null;
  const data = axiosErr.response.data;
  if (!data || typeof data !== 'object') return out;

  const env = data.error;
  if (env && typeof env === 'object') {
    out.code = env.code ?? null;
    out.message = env.message ?? null;
    out.codes = env.codes ?? {};
    out.retryAfter = typeof env.retry_after === 'number' ? env.retry_after : null;
    if (env.details && typeof env.details === 'object' && !Array.isArray(env.details)) {
      for (const [k, v] of Object.entries(env.details as Record<string, unknown>)) {
        const s = firstString(v);
        if (s) out.fields[k] = s;
      }
    } else if (!out.message) {
      out.message = firstString(env.details);
    }
    return out;
  }

  // Plain DRF shape.
  if (typeof data.detail === 'string') {
    out.message = data.detail;
    return out;
  }
  for (const [k, v] of Object.entries(data)) {
    if (k === 'success') continue;
    const s = firstString(v);
    if (s) out.fields[k] = s;
  }
  out.message = firstString(data);
  return out;
}

export function hasCode(e: ApiError, field: string, code: string): boolean {
  return (e.codes[field] ?? []).includes(code);
}

/** Localized copy for the auth-related error codes the backend emits. */
export interface AuthErrorCopy {
  emailTaken: string;
  invalidEmail: string;
  required: string;
  passwordTooShort: string;
  passwordTooCommon: string;
  passwordNumeric: string;
  passwordSimilar: string;
  passwordMismatch: string;
  invalidCredentials: string;
  accountLocked: string;
  tooManyAttempts: string;
  network: string;
  generic: string;
}

const PASSWORD_CODES: Record<string, keyof AuthErrorCopy> = {
  password_too_short: 'passwordTooShort',
  password_too_common: 'passwordTooCommon',
  password_entirely_numeric: 'passwordNumeric',
  password_too_similar: 'passwordSimilar',
};

/** Localized message for one field, or the backend's text, or null. */
export function fieldMessage(
  e: ApiError,
  field: string,
  copy: AuthErrorCopy,
  fallbackField: string = field
): string | null {
  const codes = e.codes[field] ?? [];
  if (field === 'email' && codes.includes('email_taken')) return copy.emailTaken;
  if (field === 'email' && codes.includes('invalid')) return copy.invalidEmail;
  if (codes.includes('required') || codes.includes('blank')) return copy.required;
  for (const c of codes) {
    const key = PASSWORD_CODES[c];
    if (key) return copy[key];
  }
  if (field === 'password_confirm' && codes.length) return copy.passwordMismatch;
  return e.fields[field] ?? e.fields[fallbackField] ?? null;
}

/** Localized headline message for a whole failed request. */
export function authErrorMessage(e: ApiError, copy: AuthErrorCopy): string {
  if (e.network) return copy.network;
  if (e.status === 429 || e.code === 'throttled') {
    return copy.tooManyAttempts.replace('{seconds}', String(e.retryAfter ?? 60));
  }
  if (hasCode(e, 'detail', 'account_locked')) return copy.accountLocked;
  if (e.status === 401 || e.code === 'no_active_account' || e.code === 'authentication_failed') {
    return copy.invalidCredentials;
  }
  for (const field of Object.keys({ ...e.codes, ...e.fields })) {
    const m = fieldMessage(e, field, copy);
    if (m) return m;
  }
  return e.message ?? copy.generic;
}
