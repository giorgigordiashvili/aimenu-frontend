import type { Metadata } from 'next';

// Facebook's data-deletion callback (on the backend, at
// admin.aimenu.ge/data-deletion/) hands this URL back in its JSON response.
// Meta displays the URL to users after they request deletion from their
// Facebook privacy settings — the user clicks it to check status.
//
// Kept outside the [locale] tree so the URL is short and the middleware
// doesn't rewrite it (Meta sees aimenu.ge/data-deletion?code=XYZ and that's
// exactly what they get).

export const metadata: Metadata = {
  title: 'Data deletion status — aimenu.ge',
  description: 'Status of your Facebook-linked data deletion request.',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ code?: string }>;
}

export default async function DataDeletionStatusPage({ searchParams }: Props) {
  const { code = '' } = await searchParams;

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#0F172B',
        background: '#F8FAFC',
      }}
    >
      <div
        style={{
          maxWidth: 560,
          width: '100%',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          padding: '32px 28px',
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px' }}>
          Data deletion request received
        </h1>
        <p style={{ fontSize: 15, lineHeight: '24px', margin: '0 0 16px', color: '#475569' }}>
          We&apos;ve received your request via Facebook to remove Facebook-linked data from your
          aimenu.ge account.
        </p>
        <p style={{ fontSize: 15, lineHeight: '24px', margin: '0 0 16px', color: '#475569' }}>
          Your Facebook sign-in connection has been removed. If you also want to delete your
          aimenu.ge account (orders, reservations, profile), email{' '}
          <a
            href='mailto:info@telos.ge'
            style={{ color: '#0F172B', textDecoration: 'underline' }}
          >
            info@telos.ge
          </a>{' '}
          and we&apos;ll process the full deletion within 30 days.
        </p>
        {code ? (
          <p
            style={{
              fontSize: 13,
              fontFamily: 'monospace',
              color: '#62748E',
              margin: '24px 0 0',
              padding: '12px 14px',
              background: '#F1F5F9',
              borderRadius: 8,
              wordBreak: 'break-all',
            }}
          >
            Confirmation code: {code}
          </p>
        ) : null}
      </div>
    </main>
  );
}
