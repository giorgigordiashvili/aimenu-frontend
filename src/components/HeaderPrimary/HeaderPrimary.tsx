'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useAuth } from '@/context/AuthContext';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import CloseIcon from '@/icons/Close';
import HeartOutlineIcon from '@/icons/HeartOutline';
import HistoryIcon from '@/icons/History';
import LogoutIcon from '@/icons/Logout';
import MenuIcon from '@/icons/Menu';
import UserIcon from '@/icons/User';
import {
  border,
  foreground,
  muted,
  primary,
  rose50,
  shadowMd,
  slate100,
  slate200,
  white,
} from '@/tokens';

// ── Wrapper ───────────────────────────────────────────────────────────────────

const HeaderWrapper = styled('header')({
  position: 'sticky',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 20px',
  background: 'rgba(255, 255, 255, 0.92)',
  backdropFilter: 'blur(12px)',
  zIndex: 200,
  height: '64px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  gap: '16px',
  '@media (min-width: 768px)': {
    padding: '0 40px',
  },
});

// ── Logo ──────────────────────────────────────────────────────────────────────

const LogoLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
  flexShrink: 0,
});

const LogoText = styled('span')({
  fontSize: '18px',
  fontWeight: 700,
  color: primary,
});

// ── Desktop Nav ───────────────────────────────────────────────────────────────

const DesktopNav = styled('nav')({
  display: 'none',
  '@media (min-width: 768px)': {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flex: 1,
    justifyContent: 'center',
  },
});

const NavLink = styled(Link)({
  padding: '6px 14px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  color: foreground,
  textDecoration: 'none',
  transition: 'background 0.15s, color 0.15s',
  whiteSpace: 'nowrap',
  '&:hover': { background: slate100 },
  '&[data-active="true"]': { color: primary, background: rose50 },
});

// ── Right group ───────────────────────────────────────────────────────────────

const RightGroup = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flexShrink: 0,
});

const DesktopControls = styled('div')({
  display: 'none',
  alignItems: 'center',
  gap: '10px',
  '@media (min-width: 768px)': {
    display: 'flex',
  },
});

// ── Mobile burger ─────────────────────────────────────────────────────────────

const BurgerButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  borderRadius: '8px',
  '&:hover': { background: slate100 },
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

// ── Auth buttons ──────────────────────────────────────────────────────────────

const LoginButton = styled(Link)({
  padding: '7px 14px',
  border: `1px solid ${border}`,
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  color: foreground,
  textDecoration: 'none',
  background: white,
  transition: 'background 0.15s',
  '&:hover': { background: slate100 },
});

const RegisterButton = styled(Link)({
  padding: '7px 14px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  color: white,
  textDecoration: 'none',
  background: primary,
  transition: 'opacity 0.15s',
  '&:hover': { opacity: 0.9 },
});

// ── User menu button ──────────────────────────────────────────────────────────

const UserButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '5px 12px 5px 6px',
  border: `1px solid ${border}`,
  borderRadius: '24px',
  background: white,
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  color: foreground,
  transition: 'box-shadow 0.15s',
  '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
});

const UserAvatar = styled('div')({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: rose50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const UserName = styled('span')({
  maxWidth: '120px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

// ── Dropdown ──────────────────────────────────────────────────────────────────

const DropdownWrap = styled('div')({
  position: 'relative',
});

const DropdownMenu = styled('div')({
  position: 'absolute',
  top: 'calc(100% + 8px)',
  right: 0,
  width: '220px',
  background: white,
  border: `1px solid ${border}`,
  borderRadius: '12px',
  boxShadow: shadowMd,
  overflow: 'hidden',
  zIndex: 300,
});

const DropdownItem = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '11px 16px',
  fontSize: '14px',
  fontWeight: 400,
  color: foreground,
  textDecoration: 'none',
  transition: 'background 0.1s',
  '&:hover': { background: slate100 },
});

const DropdownDivider = styled('div')({
  height: '1px',
  background: slate200,
  margin: '4px 0',
});

const LogoutItem = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '11px 16px',
  width: '100%',
  fontSize: '14px',
  fontWeight: 400,
  color: primary,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background 0.1s',
  '&:hover': { background: rose50 },
});

const IconWrap = styled('span')({
  display: 'flex',
  alignItems: 'center',
  color: muted,
});

// ── Mobile Drawer (full width) ────────────────────────────────────────────────

const DrawerOverlay = styled('div')<{ open: boolean }>({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  zIndex: 400,
  transition: 'opacity 0.25s',
  variants: [
    { props: { open: true }, style: { opacity: 1, pointerEvents: 'auto' } },
    { props: { open: false }, style: { opacity: 0, pointerEvents: 'none' } },
  ],
});

const Drawer = styled('div')<{ open: boolean }>({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  background: white,
  zIndex: 401,
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.25s ease',
  variants: [
    { props: { open: true }, style: { transform: 'translateX(0)' } },
    { props: { open: false }, style: { transform: 'translateX(100%)' } },
  ],
});

const DrawerHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 20px',
  height: '64px',
  borderBottom: `1px solid ${slate200}`,
  flexShrink: 0,
});

const DrawerLogoText = styled('span')({
  fontSize: '18px',
  fontWeight: 700,
  color: primary,
});

const DrawerCloseButton = styled('button')({
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  borderRadius: '8px',
  '&:hover': { background: slate100 },
});

const DrawerBody = styled('div')({
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

// Nav section in drawer
const DrawerNav = styled('nav')({
  padding: '8px 12px',
  borderBottom: `1px solid ${slate200}`,
});

const DrawerNavItem = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '14px 16px',
  fontSize: '16px',
  fontWeight: 500,
  color: foreground,
  textDecoration: 'none',
  borderRadius: '10px',
  transition: 'background 0.1s',
  '&:hover': { background: slate100 },
  '&[data-active="true"]': { color: primary, background: rose50 },
});

const DrawerUserSection = styled('div')({
  padding: '16px 12px',
  flex: 1,
});

const DrawerUserInfo = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  background: slate100,
  borderRadius: '10px',
  marginBottom: '8px',
});

const DrawerUserName = styled('span')({
  fontSize: '15px',
  fontWeight: 600,
  color: foreground,
});

const DrawerMenuNavItem = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '14px 16px',
  fontSize: '15px',
  fontWeight: 400,
  color: foreground,
  textDecoration: 'none',
  borderRadius: '10px',
  transition: 'background 0.1s',
  '&:hover': { background: slate100 },
});

const DrawerLogoutButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '14px 16px',
  width: '100%',
  fontSize: '15px',
  fontWeight: 400,
  color: primary,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  borderRadius: '10px',
  textAlign: 'left',
  transition: 'background 0.1s',
  '&:hover': { background: rose50 },
});

const DrawerAuthButtons = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '16px 20px',
});

const DrawerLoginBtn = styled(Link)({
  display: 'block',
  padding: '14px 16px',
  border: `1px solid ${border}`,
  borderRadius: '10px',
  fontSize: '16px',
  fontWeight: 500,
  color: foreground,
  textDecoration: 'none',
  textAlign: 'center',
  transition: 'background 0.15s',
  '&:hover': { background: slate100 },
});

const DrawerRegisterBtn = styled(Link)({
  display: 'block',
  padding: '14px 16px',
  border: 'none',
  borderRadius: '10px',
  fontSize: '16px',
  fontWeight: 500,
  color: white,
  textDecoration: 'none',
  textAlign: 'center',
  background: primary,
  transition: 'opacity 0.15s',
  '&:hover': { opacity: 0.9 },
});

const DrawerFooter = styled('div')({
  padding: '16px 20px',
  borderTop: `1px solid ${slate200}`,
  flexShrink: 0,
});

// ── Component ─────────────────────────────────────────────────────────────────

export default function HeaderPrimary() {
  const { locale } = useLocale();
  const t = useTranslations();
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setDrawerOpen(false);
    await logout();
  };

  const displayName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
    : '';

  const navLinks = [
    { label: t.header.home, href: `/${locale}` },
    { label: t.header.restaurants, href: `/${locale}/restaurants` },
    { label: t.header.about, href: `/${locale}/about` },
    { label: t.header.contact, href: `/${locale}/contact` },
  ];

  return (
    <>
      <HeaderWrapper>
        {/* Logo */}
        <LogoLink href={`/${locale}`}>
          <Image
            src='/logo.png'
            alt='AiMenu'
            width={32}
            height={32}
            style={{ height: '32px', width: '32px', objectFit: 'contain' }}
            priority
          />
          <LogoText>AiMenu</LogoText>
        </LogoLink>

        {/* Desktop center nav */}
        <DesktopNav>
          {navLinks.map(link => (
            <NavLink
              key={link.href}
              href={link.href}
              data-active={pathname === link.href ? 'true' : undefined}
            >
              {link.label}
            </NavLink>
          ))}
        </DesktopNav>

        <RightGroup>
          {/* Desktop auth controls */}
          <DesktopControls>
            <LanguageSwitcher currentLocale={locale} />

            {isAuthenticated ? (
              <DropdownWrap ref={dropdownRef}>
                <UserButton onClick={() => setUserMenuOpen(p => !p)}>
                  <UserAvatar>
                    <UserIcon width={16} height={16} />
                  </UserAvatar>
                  {displayName && <UserName>{displayName}</UserName>}
                </UserButton>

                {userMenuOpen && (
                  <DropdownMenu>
                    <DropdownItem href={`/${locale}/profile`} onClick={() => setUserMenuOpen(false)}>
                      <IconWrap><UserIcon width={16} height={16} /></IconWrap>
                      {t.header.profile}
                    </DropdownItem>
                    <DropdownItem href={`/${locale}/profile?tab=favorites`} onClick={() => setUserMenuOpen(false)}>
                      <IconWrap><HeartOutlineIcon variant='outlined' /></IconWrap>
                      {t.header.favorites}
                    </DropdownItem>
                    <DropdownItem href={`/${locale}/profile/reservations`} onClick={() => setUserMenuOpen(false)}>
                      <IconWrap><HistoryIcon /></IconWrap>
                      {t.header.myBookings}
                    </DropdownItem>
                    <DropdownDivider />
                    <LogoutItem onClick={handleLogout}>
                      <IconWrap><LogoutIcon /></IconWrap>
                      {t.header.logout}
                    </LogoutItem>
                  </DropdownMenu>
                )}
              </DropdownWrap>
            ) : (
              <>
                <LoginButton href={`/${locale}/login`}>{t.header.login}</LoginButton>
                <RegisterButton href={`/${locale}/register`}>{t.header.register}</RegisterButton>
              </>
            )}
          </DesktopControls>

          {/* Mobile burger */}
          <BurgerButton onClick={() => setDrawerOpen(true)} aria-label='Open menu'>
            <MenuIcon />
          </BurgerButton>
        </RightGroup>
      </HeaderWrapper>

      {/* Mobile Full-Width Drawer */}
      <DrawerOverlay open={drawerOpen} onClick={() => setDrawerOpen(false)} />
      <Drawer open={drawerOpen}>
        <DrawerHeader>
          <DrawerLogoText>AiMenu</DrawerLogoText>
          <DrawerCloseButton onClick={() => setDrawerOpen(false)} aria-label='Close menu'>
            <CloseIcon />
          </DrawerCloseButton>
        </DrawerHeader>

        <DrawerBody>
          {/* Nav links */}
          <DrawerNav>
            {navLinks.map(link => (
              <DrawerNavItem
                key={link.href}
                href={link.href}
                data-active={pathname === link.href ? 'true' : undefined}
                onClick={() => setDrawerOpen(false)}
              >
                {link.label}
              </DrawerNavItem>
            ))}
          </DrawerNav>

          {/* User section */}
          <DrawerUserSection>
            {isAuthenticated ? (
              <>
                <DrawerUserInfo>
                  <UserAvatar>
                    <UserIcon width={16} height={16} />
                  </UserAvatar>
                  <DrawerUserName>{displayName}</DrawerUserName>
                </DrawerUserInfo>

                <DrawerMenuNavItem href={`/${locale}/profile`} onClick={() => setDrawerOpen(false)}>
                  <IconWrap><UserIcon width={16} height={16} /></IconWrap>
                  {t.header.profile}
                </DrawerMenuNavItem>
                <DrawerMenuNavItem href={`/${locale}/profile?tab=favorites`} onClick={() => setDrawerOpen(false)}>
                  <IconWrap><HeartOutlineIcon variant='outlined' /></IconWrap>
                  {t.header.favorites}
                </DrawerMenuNavItem>
                <DrawerMenuNavItem href={`/${locale}/profile/reservations`} onClick={() => setDrawerOpen(false)}>
                  <IconWrap><HistoryIcon /></IconWrap>
                  {t.header.myBookings}
                </DrawerMenuNavItem>
                <DrawerLogoutButton onClick={handleLogout}>
                  <IconWrap><LogoutIcon /></IconWrap>
                  {t.header.logout}
                </DrawerLogoutButton>
              </>
            ) : (
              <DrawerAuthButtons>
                <DrawerLoginBtn href={`/${locale}/login`} onClick={() => setDrawerOpen(false)}>
                  {t.header.login}
                </DrawerLoginBtn>
                <DrawerRegisterBtn href={`/${locale}/register`} onClick={() => setDrawerOpen(false)}>
                  {t.header.register}
                </DrawerRegisterBtn>
              </DrawerAuthButtons>
            )}
          </DrawerUserSection>
        </DrawerBody>

        <DrawerFooter>
          <LanguageSwitcher currentLocale={locale} />
        </DrawerFooter>
      </Drawer>
    </>
  );
}
