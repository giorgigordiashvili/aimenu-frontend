import { styled } from '@pigment-css/react';

import { slate400, white, slate900 } from '@/tokens';

// ── Styles ────────────────────────────────────────────────────────────────────

const FooterWrapper = styled('footer')({
  background: slate900,
  color: white,
  padding: '48px 20px 24px',
  '@media (min-width: 768px)': {
    padding: '64px 80px 32px',
  },
});

const Grid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '40px',
  maxWidth: '1280px',
  margin: '0 auto',
  '@media (min-width: 640px)': {
    gridTemplateColumns: '1fr 1fr',
  },
  '@media (min-width: 1024px)': {
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
  },
});

const Column = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const BrandName = styled('span')({
  fontSize: '22px',
  fontWeight: 700,
  color: white,
  letterSpacing: '-0.5px',
});

const BrandDescription = styled('p')({
  fontSize: '14px',
  color: slate400,
  lineHeight: '22px',
  margin: 0,
});

const ColumnTitle = styled('h4')({
  fontSize: '14px',
  fontWeight: 600,
  color: white,
  margin: 0,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const LinksList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

const LinkItem = styled('li')({
  fontSize: '14px',
  color: slate400,
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: white,
  },
});

const NavLink = styled('a')({
  fontSize: '14px',
  color: slate400,
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  display: 'block',
  '&:hover': {
    color: white,
  },
});

const ContactItem = styled('p')({
  fontSize: '14px',
  color: slate400,
  margin: 0,
  lineHeight: '22px',
});

const Divider = styled('div')({
  height: '1px',
  background: `rgba(255,255,255,0.1)`,
  maxWidth: '1280px',
  margin: '40px auto 24px',
});

const Copyright = styled('p')({
  fontSize: '13px',
  color: slate400,
  textAlign: 'center',
  margin: 0,
  maxWidth: '1280px',
  marginLeft: 'auto',
  marginRight: 'auto',
});

// ── Component ─────────────────────────────────────────────────────────────────

interface FooterProps {
  locale?: string;
}

export default function Footer({ locale: _locale }: FooterProps = {}) {
  return (
    <FooterWrapper>
      <Grid>
        {/* Brand Column */}
        <Column>
          <BrandName>Magida</BrandName>
          <BrandDescription>
            აღმოაჩინეთ საუკეთესო რესტორნები, დაჯავშნეთ მაგიდა და ისიამოვნეთ გამორჩეული კულინარიით.
          </BrandDescription>
        </Column>

        {/* Navigation Column */}
        <Column>
          <ColumnTitle>ნავიგაცია</ColumnTitle>
          <LinksList>
            <li>
              <NavLink href='/'>მთავარი</NavLink>
            </li>
            <li>
              <NavLink href='/restaurants'>რესტორნები</NavLink>
            </li>
            <li>
              <NavLink href='/blog'>ბლოგი</NavLink>
            </li>
          </LinksList>
        </Column>

        {/* Help Column */}
        <Column>
          <ColumnTitle>დახმარება</ColumnTitle>
          <LinksList>
            <LinkItem>ხშირად დასმული კითხვები</LinkItem>
            <LinkItem>კონფიდენციალობა</LinkItem>
            <LinkItem>წესები და პირობები</LinkItem>
          </LinksList>
        </Column>

        {/* Contact Column */}
        <Column>
          <ColumnTitle>კონტაქტი</ColumnTitle>
          <div>
            <ContactItem>info@magida.ge</ContactItem>
            <ContactItem>+995 32 2 00 00 00</ContactItem>
            <ContactItem>თბილისი, ჭავჭავაძის 1</ContactItem>
          </div>
        </Column>
      </Grid>

      <Divider />

      <Copyright>© 2024 Magida ყველა უფლება დაცულია</Copyright>
    </FooterWrapper>
  );
}
