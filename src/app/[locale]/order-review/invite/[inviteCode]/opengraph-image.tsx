import { ImageResponse } from 'next/og';

// Invite OG image: the thumbnail that shows up in messengers when the
// host shares their invite link. We paint a branded card centred on an
// initials avatar built from the inviter's name + surname so the recipient
// immediately recognises who's inviting them.

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ inviteCode: string }>;
}

interface InvitePreview {
  host_name?: string;
  restaurant_name?: string;
  table_number?: string;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://admin.aimenu.ge').replace(/\/$/, '');

async function loadInvite(inviteCode: string): Promise<InvitePreview | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/tables/sessions/join/${inviteCode}/`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    return (await res.json()) as InvitePreview;
  } catch {
    return null;
  }
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Deterministic rose/amber gradient keyed on the name so two different
// inviters get visibly different avatars without us needing to store
// colours on the server.
function gradientFor(name: string): [string, string] {
  const palette: Array<[string, string]> = [
    ['#ec003f', '#f97316'],
    ['#8b5cf6', '#ec4899'],
    ['#0ea5e9', '#6366f1'],
    ['#10b981', '#0ea5e9'],
    ['#f59e0b', '#ef4444'],
    ['#ec4899', '#8b5cf6'],
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length];
}

export default async function Image({ params }: Props) {
  const { inviteCode } = await params;
  const invite = await loadInvite(inviteCode);
  const host = invite?.host_name?.trim() || 'aimenu.ge';
  const restaurant = invite?.restaurant_name?.trim() || '';
  const table = invite?.table_number?.trim() || '';
  const [g1, g2] = gradientFor(host);

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172b',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 30% 30%, ${g1}33 0%, transparent 55%), radial-gradient(circle at 75% 70%, ${g2}33 0%, transparent 55%)`,
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
          color: '#ffffff',
          padding: '48px 72px',
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 4,
            textTransform: 'uppercase',
            opacity: 0.75,
          }}
        >
          aimenu.ge · invitation
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 220,
            height: 220,
            borderRadius: 999,
            background: `linear-gradient(135deg, ${g1} 0%, ${g2} 100%)`,
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: '-2px',
            boxShadow: '0 20px 60px rgba(236, 0, 63, 0.35)',
          }}
        >
          {initials(host)}
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-2px',
            textAlign: 'center',
            maxWidth: 1000,
          }}
        >
          {host}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 32,
            fontWeight: 500,
            opacity: 0.88,
            textAlign: 'center',
            maxWidth: 960,
            lineHeight: 1.3,
          }}
        >
          invites you to join their table
          {restaurant ? ` at ${restaurant}` : ''}
          {table ? ` · Table ${table}` : ''}
        </div>
      </div>
    </div>,
    size
  );
}
