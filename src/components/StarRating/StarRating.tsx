'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

import Star from '@/icons/Star';
import { slate200, yellow500 } from '@/tokens';

interface BaseProps {
  value: number;
  size?: number;
  className?: string;
}

interface ReadOnlyProps extends BaseProps {
  readOnly: true;
  onChange?: never;
}

interface EditableProps extends BaseProps {
  readOnly?: false;
  onChange: (next: number) => void;
  label?: string;
}

type Props = ReadOnlyProps | EditableProps;

const Row = styled('div')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2px',
});

const StarButton = styled('button')({
  background: 'transparent',
  border: 'none',
  padding: '2px',
  cursor: 'pointer',
  lineHeight: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:focus-visible': {
    outline: `2px solid ${yellow500}`,
    outlineOffset: '2px',
    borderRadius: '4px',
  },
});

export default function StarRating(props: Props) {
  const { value, size = 18, className } = props;
  const [hover, setHover] = useState<number | null>(null);
  const max = 5;
  const effective = hover ?? value;

  if (props.readOnly) {
    return (
      <Row className={className} aria-label={`${value} out of ${max} stars`}>
        {Array.from({ length: max }, (_, i) => (
          <Star key={i} color={i < value ? yellow500 : slate200} size={size} />
        ))}
      </Row>
    );
  }

  const { onChange, label } = props;

  return (
    <Row
      className={className}
      role='radiogroup'
      aria-label={label ?? 'Rating'}
      onMouseLeave={() => setHover(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        return (
          <StarButton
            key={i}
            type='button'
            role='radio'
            aria-checked={value === starValue}
            aria-label={`${starValue} ${starValue === 1 ? 'star' : 'stars'}`}
            onMouseEnter={() => setHover(starValue)}
            onFocus={() => setHover(starValue)}
            onBlur={() => setHover(null)}
            onClick={() => onChange(starValue)}
          >
            <Star color={starValue <= effective ? yellow500 : slate200} size={size} />
          </StarButton>
        );
      })}
    </Row>
  );
}
