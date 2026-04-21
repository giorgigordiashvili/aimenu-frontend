'use client';

// Last-resort error boundary that runs when the root layout itself
// fails — at that point neither i18n providers nor styled components
// are guaranteed to work, so this stays plain HTML + inline styles.
// Should almost never fire; mostly a safety net for build-time
// regressions.

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  return (
    <html lang='en'>
      <body
        style={{
          margin: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          background: '#f8fafc',
          color: '#0f172b',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <main style={{ maxWidth: 480, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, marginTop: 0 }}>Something broke.</h1>
          <p style={{ color: '#62748e', lineHeight: 1.5 }}>
            We hit an unexpected error and couldn&apos;t render the page. Please try again.
            {error.digest ? ` (id: ${error.digest})` : ''}
          </p>
          <button
            type='button'
            onClick={() => reset()}
            style={{
              marginTop: 16,
              padding: '12px 20px',
              border: 'none',
              borderRadius: 12,
              background: '#0f172b',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
