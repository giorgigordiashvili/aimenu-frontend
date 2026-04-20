'use client';

import { styled, keyframes } from '@pigment-css/react';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';

import { useCart } from '@/context/CartContext';
import { useTranslations } from '@/context/LocaleContext';

import BackButton from '../BackButton';
import MainButton from '../MainButton/MainButton';

const slideUp = keyframes({
  from: { transform: 'translateY(100%)' },
  to: { transform: 'translateY(0)' },
});

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'scale(0.95)' },
  to: { opacity: 1, transform: 'scale(1)' },
});

const Overlay = styled('div')({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  '@media (min-width: 768px)': {
    alignItems: 'center',
    padding: '40px',
  },
});

const Modal = styled('div')({
  background: '#ffffff',
  width: '100%',
  height: '100dvh',
  borderRadius: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  animation: `${slideUp} 0.3s ease-out`,
  '@media (min-width: 768px)': {
    width: '100%',
    maxWidth: '600px',
    height: 'auto',
    maxHeight: '90vh',
    borderRadius: '24px',
    animation: `${fadeIn} 0.2s ease-out`,
  },
});

const ImageContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: '383px',
  flexShrink: 0,
  '@media (min-width: 768px)': {
    height: '300px',
    borderRadius: '24px 24px 0 0',
  },
});

const StyledImage = styled(Image)({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px',
  '@media (min-width: 768px)': {
    borderRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});

// Low-res thumbnail that sits beneath the hi-res image while it loads.
// Because the menu list already requested the same `src` at a ~160px bucket,
// this paints instantly from the browser cache on slow connections.
const ThumbImage = styled(Image)({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  // Slight blur masks the upscaling from w=160 to the container size;
  // the crisp hi-res fades in on top and replaces it.
  filter: 'blur(12px)',
  transform: 'scale(1.05)',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px',
  '@media (min-width: 768px)': {
    borderRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});

interface HiResWrapProps {
  isLoaded?: boolean;
}

// Wraps the priority hi-res <Image fill /> so we can fade it in atop the
// cached thumbnail once decoding finishes.
const HiResLayer = styled('div')<HiResWrapProps>({
  position: 'absolute',
  inset: 0,
  opacity: 0,
  transition: 'opacity 0.25s ease-out',
  variants: [
    {
      props: { isLoaded: true },
      style: { opacity: 1 },
    },
  ],
});

const ImagePlaceholder = styled('div')({
  width: '100%',
  height: '100%',
  background: '#e2e8f0',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px',
  '@media (min-width: 768px)': {
    borderRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});

const BackButtonContainer = styled('div')({
  position: 'absolute',
  top: '67px',
  left: '20px',
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

const CloseButton = styled('button')({
  display: 'none',
  '@media (min-width: 768px)': {
    display: 'flex',
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '36px',
    height: '36px',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    zIndex: 10,
    '&:hover': {
      background: '#ffffff',
    },
    '& svg': {
      width: '20px',
      height: '20px',
      color: '#0f172a',
    },
  },
});

const Content = styled('div')({
  flex: 1,
  overflowY: 'auto',
  padding: '0 20px',
  background: '#ffffff',
  marginTop: '-70px',
  borderTopLeftRadius: '24px',
  borderTopRightRadius: '24px',
  position: 'relative',
  zIndex: 1,
  '@media (min-width: 768px)': {
    marginTop: 0,
    borderRadius: 0,
    padding: '0 24px',
  },
});

const Header = styled('div')({
  paddingTop: '24px',
  paddingBottom: '16px',
  '@media (min-width: 768px)': {
    paddingTop: '20px',
    paddingBottom: '16px',
  },
});

const ProductName = styled('h2')({
  fontSize: '20px',
  fontWeight: 700,
  color: '#0f172a',
  lineHeight: 1.2,
  marginBottom: '8px',
  margin: 0,
  '@media (min-width: 768px)': {
    fontSize: '24px',
  },
});

const ProductDescription = styled('p')({
  fontSize: '13px',
  fontWeight: 400,
  color: '#62748e',
  lineHeight: '20px',
  margin: 0,
  '@media (min-width: 768px)': {
    fontSize: '14px',
    lineHeight: '22px',
  },
});

const Divider = styled('div')({
  height: '1px',
  background: '#e2e8f0',
  margin: '0 0 20px',
});

const ModifierGroup = styled('div')({
  marginBottom: '24px',
});

const GroupTitle = styled('h3')({
  fontSize: '14px',
  fontWeight: 600,
  color: '#0f172a',
  marginBottom: '16px',
  margin: 0,
  '@media (min-width: 768px)': {
    fontSize: '16px',
  },
});

const GroupError = styled('p')({
  fontSize: '12px',
  fontWeight: 500,
  color: '#ec003f',
  margin: '4px 0 12px',
  lineHeight: '16px',
});

const OptionsList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const OptionItem = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 0',
  background: 'none',
  width: '100%',
  textAlign: 'left',
  border: 'none',
  cursor: 'pointer',
});

const OptionLeft = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

interface RadioProps {
  isSelected?: boolean;
}

const Radio = styled('div')<RadioProps>({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  border: '1px solid #e2e8f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'all 0.2s ease',
  background: 'transparent',
  variants: [
    {
      props: { isSelected: true },
      style: {
        border: '1px solid #ec003f',
        background: '#ec003f',
      },
    },
  ],
});

const RadioInner = styled('div')({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: '#ffffff',
});

const OptionName = styled('span')({
  fontSize: '14px',
  fontWeight: 400,
  color: '#0f172a',
  '@media (min-width: 768px)': {
    fontSize: '15px',
  },
});

const OptionPrice = styled('span')({
  fontSize: '14px',
  fontWeight: 500,
  color: '#0f172a',
  '@media (min-width: 768px)': {
    fontSize: '15px',
  },
});

const Footer = styled('div')({
  padding: '20px',
  background: '#ffffff',
  boxShadow: '0px -15px 42.5px 0px rgba(0, 0, 0, 0.05)',
  flexShrink: 0,
  '@media (min-width: 768px)': {
    padding: '20px 24px',
    borderRadius: '0 0 24px 24px',
  },
});

const PriceDisplay = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 0',
});

const PriceLabel = styled('span')({
  fontSize: '16px',
  fontWeight: 500,
  color: '#62748e',
});

const PriceValue = styled('span')({
  fontSize: '20px',
  fontWeight: 700,
  color: '#0f172a',
  '@media (min-width: 768px)': {
    fontSize: '22px',
  },
});

interface Modifier {
  id: string;
  name: string;
  price: number;
}

interface ModifierGroupType {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required?: boolean;
  minSelections?: number;
  maxSelections?: number;
  modifiers: Modifier[];
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Hides the "Add to cart" button. Used on the legacy /restaurant/[slug]
   * menu browser where ordering isn't wired — customers can still see the
   * product + modifiers + price, but can't add anything to the cart.
   */
  readOnly?: boolean;
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    modifierGroups?: ModifierGroupType[];
  };
  initialModifiers?: Record<string, string[]>;
}

// Helper to compute initial selections
function getInitialSelections(modifierGroups?: ModifierGroupType[]): Record<string, string[]> {
  const initialSelections: Record<string, string[]> = {};
  modifierGroups?.forEach(group => {
    if (group.type === 'single' && group.modifiers.length > 0) {
      initialSelections[group.id] = [group.modifiers[0].id];
    } else {
      initialSelections[group.id] = [];
    }
  });
  return initialSelections;
}

function validateGroup(
  group: ModifierGroupType,
  selected: string[],
  t: {
    required: string;
    pickAtLeast: string;
    pickAtMost: string;
  }
): string | null {
  const min = group.minSelections ?? 0;
  const max = group.maxSelections ?? 0;
  if (group.required && selected.length === 0) {
    return t.required;
  }
  if (min > 0 && selected.length < min) {
    return t.pickAtLeast.replace('{count}', String(min));
  }
  if (max > 0 && selected.length > max) {
    return t.pickAtMost.replace('{count}', String(max));
  }
  return null;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
  initialModifiers,
  readOnly = false,
}: ProductDetailModalProps) {
  // Compute initial selections based on product (or pre-loaded modifiers from cart)
  const initialSelections = useMemo(
    () => initialModifiers ?? getInitialSelections(product.modifierGroups),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [product.modifierGroups]
  );

  const [selectedModifiers, setSelectedModifiers] =
    useState<Record<string, string[]>>(initialSelections);

  // Progressive image: start with the cached thumbnail, swap in the
  // hi-res once it's decoded. Resets per-product so reopening the modal
  // on a different item doesn't flash the previous hi-res.
  const [hiResLoaded, setHiResLoaded] = useState(false);

  // Reset selections when modal opens with new product
  useEffect(() => {
    if (isOpen) {
      setSelectedModifiers(initialModifiers ?? getInitialSelections(product.modifierGroups));
      setHiResLoaded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, product.id]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const { addItem } = useCart();
  const t = useTranslations();

  if (!isOpen) return null;

  const handleSingleSelect = (groupId: string, modifierId: string) => {
    setSelectedModifiers(prev => ({
      ...prev,
      [groupId]: [modifierId],
    }));
  };

  const handleMultipleSelect = (groupId: string, modifierId: string) => {
    setSelectedModifiers(prev => {
      const current = prev[groupId] || [];
      if (current.includes(modifierId)) {
        return {
          ...prev,
          [groupId]: current.filter(id => id !== modifierId),
        };
      }
      return {
        ...prev,
        [groupId]: [...current, modifierId],
      };
    });
  };

  const violations: Record<string, string> = {};
  product.modifierGroups?.forEach(group => {
    const error = validateGroup(group, selectedModifiers[group.id] || [], {
      required: t.product.required,
      pickAtLeast: t.product.pickAtLeast,
      pickAtMost: t.product.pickAtMost,
    });
    if (error) violations[group.id] = error;
  });
  const hasViolations = Object.keys(violations).length > 0;

  const calculateTotalPrice = () => {
    let total = product.price;
    product.modifierGroups?.forEach(group => {
      const selected = selectedModifiers[group.id] || [];
      selected.forEach(modId => {
        const modifier = group.modifiers.find(m => m.id === modId);
        if (modifier) {
          total += modifier.price;
        }
      });
    });
    return total;
  };

  const totalPrice = calculateTotalPrice();

  const selectedModifiersList = Object.entries(selectedModifiers).flatMap(([groupId, modIds]) => {
    const group = product.modifierGroups?.find(g => g.id === groupId);
    return modIds.map(modId => {
      const mod = group?.modifiers.find(m => m.id === modId);
      return { id: modId, name: mod?.name ?? '', price: mod?.price ?? 0 };
    });
  });

  function handleAddToCart() {
    if (hasViolations) return;

    // Generate a unique cart ID per modifier combination so different selections
    // are stored as separate line items and don't overwrite each other's price.
    const modKey = selectedModifiersList
      .map(m => m.id)
      .sort()
      .join('_');
    const cartItemId = modKey ? `${product.id}_${modKey}` : product.id;

    addItem({
      id: cartItemId,
      menuItemId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      modifiers: selectedModifiersList,
    });
    onClose();
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        {/* Product Image */}
        <ImageContainer>
          {product.image ? (
            <>
              {/* Low-res backdrop — same URL the menu list just fetched at
                  the 160px bucket, so it's usually an instant cache hit. */}
              <ThumbImage
                src={product.image}
                alt=''
                aria-hidden='true'
                fill
                sizes='80px'
                priority
              />
              {/* Hi-res fades in over the thumbnail when decoded. */}
              <HiResLayer isLoaded={hiResLoaded}>
                <StyledImage
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes='(min-width: 768px) 600px, 393px'
                  priority
                  onLoad={() => setHiResLoaded(true)}
                />
              </HiResLayer>
            </>
          ) : (
            <ImagePlaceholder />
          )}
          <BackButtonContainer>
            <BackButton onClick={onClose} />
          </BackButtonContainer>
          {/* Desktop close button */}
          <CloseButton onClick={onClose} aria-label='Close'>
            <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M18 6L6 18M6 6L18 18'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </CloseButton>
        </ImageContainer>

        {/* Content */}
        <Content>
          <Header>
            <ProductName>{product.name}</ProductName>
            {product.description && <ProductDescription>{product.description}</ProductDescription>}
          </Header>

          <Divider />

          {/* Modifier Groups */}
          {product.modifierGroups?.map(group => (
            <ModifierGroup key={group.id}>
              <GroupTitle>{group.name}</GroupTitle>
              <OptionsList>
                {group.modifiers.map(modifier => {
                  const isSelected = (selectedModifiers[group.id] || []).includes(modifier.id);
                  return (
                    <OptionItem
                      key={modifier.id}
                      onClick={() =>
                        group.type === 'single'
                          ? handleSingleSelect(group.id, modifier.id)
                          : handleMultipleSelect(group.id, modifier.id)
                      }
                    >
                      <OptionLeft>
                        <Radio isSelected={isSelected}>{isSelected && <RadioInner />}</Radio>
                        <OptionName>{modifier.name}</OptionName>
                      </OptionLeft>
                      <OptionPrice>+ {modifier.price.toFixed(2)} ₾</OptionPrice>
                    </OptionItem>
                  );
                })}
              </OptionsList>
              {violations[group.id] && <GroupError>{violations[group.id]}</GroupError>}
            </ModifierGroup>
          ))}
        </Content>

        {/* Price Display */}
        <Footer>
          <PriceDisplay>
            <PriceLabel>{t.product.total}:</PriceLabel>
            <PriceValue>{totalPrice.toFixed(2)} ₾</PriceValue>
          </PriceDisplay>
          {!readOnly && (
            <MainButton
              variant='rose_cta'
              title={t.restaurant.addToCart}
              onClick={handleAddToCart}
              disabled={hasViolations}
              fullWidth
            />
          )}
        </Footer>
      </Modal>
    </Overlay>
  );
}
