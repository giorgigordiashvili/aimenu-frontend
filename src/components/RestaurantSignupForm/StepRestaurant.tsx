'use client';

import { styled } from '@pigment-css/react';
import type { Dispatch, SetStateAction } from 'react';
import useSWR from 'swr';

import axios from '@/api/axios';
import type { RestaurantCategory } from '@/api/generated/interfaces';
import TextInput from '@/components/TextInput/TextInput';
import { Locale } from '@/i18n/config';
import EmailIcon from '@/icons/Email';
import Location from '@/icons/Location';
import PhoneIcon from '@/icons/Phone';
import RestaurantUtensils from '@/icons/RestaurantUtensils';
import * as tokens from '@/tokens';
import { getTranslation } from '@/utils/translations';

import type { SignupData, SignupErrors, SignupT } from './shared';

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const Row = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  '@media (max-width: 480px)': {
    gridTemplateColumns: '1fr',
  },
});

const Field = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const SectionTitle = styled('h2')({
  fontSize: '16px',
  fontWeight: 600,
  color: tokens.ink,
  margin: '0 0 2px',
});

const SectionSub = styled('p')({
  fontSize: '13px',
  color: tokens.slate500,
  margin: '0 0 8px',
});

const Hint = styled('span')({
  fontSize: '11px',
  color: tokens.muted,
  marginTop: '4px',
});

const FieldLabel = styled('label')({
  fontSize: '14px',
  fontFamily: 'Inter',
  color: '#0A0A0A',
  marginBottom: '8px',
});

const Select = styled('select')({
  fontSize: '14px',
  fontFamily: 'Inter',
  border: '1px solid transparent',
  color: '#717182',
  borderRadius: '8px',
  padding: '12px',
  backgroundColor: '#F3F3F5',
  width: '100%',
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage:
    'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="%2390A1B9" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>\')',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: '36px',
  '&:focus': {
    outline: 'none',
    borderColor: tokens.primary,
  },
});

const TextArea = styled('textarea')({
  fontSize: '14px',
  fontFamily: 'Inter',
  border: '1px solid transparent',
  color: '#0A0A0A',
  borderRadius: '8px',
  padding: '12px',
  backgroundColor: '#F3F3F5',
  width: '100%',
  minHeight: '88px',
  resize: 'vertical',
  '&:focus': {
    outline: 'none',
    borderColor: tokens.primary,
  },
});

const ButtonRow = styled('div')({
  display: 'flex',
  gap: '12px',
  marginTop: '12px',
});

const PrimaryButton = styled('button')({
  flex: 2,
  padding: '14px 16px',
  borderRadius: '10px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '15px',
  fontFamily: 'Inter',
  fontWeight: 600,
  backgroundColor: tokens.redBrand,
  color: tokens.white,
  '&:hover': {
    backgroundColor: tokens.rose700,
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

const SecondaryButton = styled('button')({
  flex: 1,
  padding: '14px 16px',
  borderRadius: '10px',
  border: `1px solid ${tokens.slate200}`,
  cursor: 'pointer',
  fontSize: '15px',
  fontFamily: 'Inter',
  fontWeight: 600,
  backgroundColor: tokens.white,
  color: tokens.ink,
  '&:hover': {
    backgroundColor: tokens.slate50,
  },
});

interface StepRestaurantProps {
  data: SignupData;
  setData: Dispatch<SetStateAction<SignupData>>;
  errors: SignupErrors;
  setErrors: Dispatch<SetStateAction<SignupErrors>>;
  onNext: () => void;
  onBack: () => void;
  t: SignupT;
  locale: Locale;
}

// Until the API client is regenerated post-backend-deploy, hit the endpoint
// directly. The shape matches RestaurantCategorySerializer (id, slug,
// translations). Swap to the generated `restaurantsCategoriesList` helper
// once it lands.
async function fetchCategories(): Promise<RestaurantCategory[]> {
  const res = await axios.get('/api/v1/restaurants/categories/');
  const body = res.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.results)) return body.results;
  if (Array.isArray(body?.data)) return body.data;
  return [];
}

export default function StepRestaurant({
  data,
  setData,
  errors,
  setErrors,
  onNext,
  onBack,
  t,
  locale,
}: StepRestaurantProps) {
  const { data: categories } = useSWR<RestaurantCategory[]>(
    '/api/v1/restaurants/categories/',
    fetchCategories,
    { revalidateOnFocus: false }
  );

  function update<K extends keyof SignupData>(key: K, value: SignupData[K]) {
    setData(prev => ({ ...prev, [key]: value }));
    if (errors[key as keyof SignupErrors]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  }

  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        onNext();
      }}
      noValidate
    >
      <SectionTitle>{t.restaurantSectionTitle}</SectionTitle>
      <SectionSub>{t.restaurantSectionSubtitle}</SectionSub>

      <Field>
        <TextInput
          variant='outlined'
          label={t.restaurantName}
          id='signup-restaurant-name'
          type='text'
          required
          value={data.restaurantName}
          leftIcon={RestaurantUtensils}
          errorMessage={errors.restaurantName}
          onChange={e => update('restaurantName', e.target.value)}
        />
        <Hint>{t.restaurantNameHint}</Hint>
      </Field>

      <Field>
        <FieldLabel htmlFor='signup-category'>{t.category}</FieldLabel>
        <Select
          id='signup-category'
          value={data.categoryId}
          onChange={e => update('categoryId', e.target.value)}
        >
          <option value=''>{t.categoryPlaceholder}</option>
          {categories?.map(cat => {
            const name = getTranslation(
              (cat as unknown as { translations?: Record<string, { name?: string }> }).translations,
              'name',
              locale
            );
            return (
              <option key={cat.id} value={cat.id}>
                {name || cat.slug}
              </option>
            );
          })}
        </Select>
      </Field>

      <Row>
        <Field>
          <TextInput
            variant='outlined'
            label={t.country}
            id='signup-country'
            type='text'
            value={data.country}
            onChange={e => update('country', e.target.value)}
          />
        </Field>
        <Field>
          <TextInput
            variant='outlined'
            label={t.city}
            id='signup-city'
            type='text'
            required
            value={data.city}
            errorMessage={errors.city}
            onChange={e => update('city', e.target.value)}
          />
        </Field>
      </Row>

      <Field>
        <TextInput
          variant='outlined'
          label={t.address}
          id='signup-address'
          type='text'
          value={data.address}
          leftIcon={Location}
          onChange={e => update('address', e.target.value)}
        />
      </Field>

      <Row>
        <Field>
          <TextInput
            variant='outlined'
            label={t.restaurantPhone}
            id='signup-restaurant-phone'
            type='tel'
            value={data.restaurantPhone}
            leftIcon={PhoneIcon}
            onChange={e => update('restaurantPhone', e.target.value)}
          />
        </Field>
        <Field>
          <TextInput
            variant='outlined'
            label={t.website}
            id='signup-website'
            type='url'
            value={data.website}
            leftIcon={EmailIcon}
            onChange={e => update('website', e.target.value)}
          />
        </Field>
      </Row>

      <Field>
        <FieldLabel htmlFor='signup-description'>{t.description}</FieldLabel>
        <TextArea
          id='signup-description'
          placeholder={t.descriptionPlaceholder}
          value={data.description}
          maxLength={500}
          onChange={e => update('description', e.target.value)}
        />
      </Field>

      <ButtonRow>
        <SecondaryButton type='button' onClick={onBack}>
          {t.backButton}
        </SecondaryButton>
        <PrimaryButton type='submit'>{t.nextButton}</PrimaryButton>
      </ButtonRow>
    </Form>
  );
}
