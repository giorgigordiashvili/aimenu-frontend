import { styled } from '@pigment-css/react';
import Image from 'next/image';

import { CONTACT_EMAIL, CONTACT_PHONE } from '@/config/contact';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
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

const BrandRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
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
  locale?: Locale;
}

export default function Footer({ locale = 'ka' }: FooterProps) {
  const t = getDictionary(locale);
  const year = new Date().getFullYear();
  const copyright = t.footer.copyright.replace('{year}', String(year));

  return (
    <FooterWrapper>
      <Grid>
        {/* Brand Column */}
        <Column>
          <BrandRow>
            <Image
              src='/logo.png'
              alt='AiMenu'
              width={32}
              height={32}
              style={{ height: '32px', width: '32px', objectFit: 'contain' }}
            />
            <BrandName>AiMenu</BrandName>
          </BrandRow>
          <BrandDescription>{t.footer.brandDescription}</BrandDescription>
        </Column>

        {/* Navigation Column */}
        <Column>
          <ColumnTitle>{t.footer.navigation}</ColumnTitle>
          <LinksList>
            <li>
              <NavLink href={`/${locale}/`}>{t.footer.home}</NavLink>
            </li>
            <li>
              <NavLink href={`/${locale}/restaurants`}>{t.footer.restaurants}</NavLink>
            </li>
            <li>
              <NavLink href={`/${locale}/blog`}>{t.footer.blog}</NavLink>
            </li>
          </LinksList>
        </Column>

        {/* Help Column */}
        <Column>
          <ColumnTitle>{t.footer.help}</ColumnTitle>
          <LinksList>
            <li>
              <NavLink href={`/${locale}/faq`}>{t.footer.faq}</NavLink>
            </li>
            <li>
              <NavLink href={`/${locale}/privacy`}>{t.footer.privacy}</NavLink>
            </li>
            <li>
              <NavLink href={`/${locale}/terms`}>{t.footer.terms}</NavLink>
            </li>
          </LinksList>
        </Column>

        {/* Contact Column */}
        <Column>
          <ColumnTitle>{t.footer.contact}</ColumnTitle>
          <div>
            <ContactItem>{CONTACT_EMAIL}</ContactItem>
            <ContactItem>{CONTACT_PHONE}</ContactItem>
          </div>
        </Column>
      </Grid>

      <Divider />

      <Copyright>{copyright}</Copyright>
    </FooterWrapper>
  );
}
