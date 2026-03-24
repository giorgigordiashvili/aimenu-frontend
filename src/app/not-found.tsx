import Link from 'next/link';

export default function RootNotFound() {
  return (
    <html>
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            fontFamily: 'sans-serif',
          }}
        >
          <h1 style={{ fontSize: 48, fontWeight: 700 }}>404</h1>
          <p style={{ color: '#64748b', marginTop: 12 }}>Page not found</p>
          <Link href='/' style={{ marginTop: 24, color: '#FF2056' }}>
            Go home
          </Link>
        </div>
      </body>
    </html>
  );
}
