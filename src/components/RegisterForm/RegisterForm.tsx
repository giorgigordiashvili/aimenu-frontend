'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import axios from '@/api/axios';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

const Container = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  background: '#f8fafc',
  '@media (max-width: 600px)': {
    padding: '16px',
    alignItems: 'flex-start',
    paddingTop: '40px',
  },
});

const FormCard = styled('div')({
  width: '100%',
  maxWidth: '560px',
  background: '#ffffff',
  borderRadius: '26px',
  boxShadow: '0px 16px 16px -8px rgba(12, 12, 13, 0.1), 0px 4px 4px -4px rgba(12, 12, 13, 0.05)',
  padding: '32px',
  '@media (max-width: 600px)': {
    padding: '24px',
  },
});

const Header = styled('div')({
  textAlign: 'center',
  marginBottom: '24px',
});

const Title = styled('h1')({
  fontSize: '24px',
  fontWeight: 700,
  color: '#0f172a',
  marginBottom: '8px',
  margin: 0,
  '@media (max-width: 600px)': {
    fontSize: '20px',
  },
});

const Subtitle = styled('p')({
  fontSize: '14px',
  color: '#62748e',
  margin: 0,
});

const Steps = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '32px',
  gap: '12px',
  '@media (max-width: 600px)': {
    flexWrap: 'wrap',
  },
});

const Step = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

interface StepNumberProps {
  isActive?: boolean;
  isCompleted?: boolean;
}

const StepNumber = styled('span')<StepNumberProps>({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: '#e2e8f0',
  color: '#62748e',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 600,
  variants: [
    {
      props: { isActive: true },
      style: {
        background: '#ec003f',
        color: '#ffffff',
      },
    },
    {
      props: { isCompleted: true },
      style: {
        background: '#7ccf00',
        color: '#ffffff',
      },
    },
  ],
});

interface StepLabelProps {
  isActive?: boolean;
  isCompleted?: boolean;
}

const StepLabel = styled('span')<StepLabelProps>({
  fontSize: '14px',
  color: '#62748e',
  fontWeight: 500,
  '@media (max-width: 600px)': {
    display: 'none',
  },
  variants: [
    {
      props: { isActive: true },
      style: {
        color: '#0f172a',
      },
    },
    {
      props: { isCompleted: true },
      style: {
        color: '#0f172a',
      },
    },
  ],
});

const StepDivider = styled('div')({
  width: '40px',
  height: '2px',
  background: '#e2e8f0',
  '@media (max-width: 600px)': {
    width: '24px',
  },
});

const ErrorMessage = styled('div')({
  background: '#fff1f2',
  color: '#ec003f',
  padding: '12px 16px',
  borderRadius: '8px',
  fontSize: '14px',
  marginBottom: '24px',
});

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

const Row = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
  '@media (max-width: 600px)': {
    gridTemplateColumns: '1fr',
  },
});

const Field = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

const Label = styled('label')({
  fontSize: '14px',
  fontWeight: 500,
  color: '#0f172a',
});

const inputStyles = {
  padding: '12px 16px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#0f172a',
  background: '#ffffff',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  outline: 'none',
  '&:focus': {
    borderColor: '#ec003f',
    boxShadow: '0 0 0 3px #fff1f2',
  },
  '&::placeholder': {
    color: '#9c9c9c',
  },
};

const Input = styled('input')(inputStyles);

const Textarea = styled('textarea')({
  ...inputStyles,
  resize: 'vertical',
  minHeight: '80px',
});

const Hint = styled('span')({
  fontSize: '12px',
  color: '#62748e',
});

const ButtonRow = styled('div')({
  display: 'flex',
  gap: '12px',
  marginTop: '8px',
  '@media (max-width: 600px)': {
    flexDirection: 'column-reverse',
  },
});

const SubmitButton = styled('button')({
  flex: 1,
  padding: '14px 24px',
  background: '#ec003f',
  color: '#ffffff',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.2s, transform 0.1s',
  '&:hover:not(:disabled)': {
    background: '#d10038',
  },
  '&:active:not(:disabled)': {
    transform: 'scale(0.98)',
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
});

const BackButton = styled('button')({
  padding: '14px 24px',
  background: '#f1f5f9',
  color: '#0f172a',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.2s',
  '&:hover:not(:disabled)': {
    background: '#e2e8f0',
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  '@media (max-width: 600px)': {
    width: '100%',
  },
});

interface RegisterFormProps {
  locale: Locale;
}

interface FormData {
  // User fields
  email: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  // Restaurant fields
  restaurantName: string;
  restaurantSlug: string;
  restaurantDescription: string;
  restaurantEmail: string;
  restaurantPhone: string;
  restaurantWebsite: string;
  restaurantAddress: string;
  restaurantCity: string;
  restaurantPostalCode: string;
  restaurantCountry: string;
}

type StepType = 'user' | 'restaurant';

export default function RegisterForm({ locale }: RegisterFormProps) {
  const router = useRouter();
  const t = getDictionary(locale);
  const [step, setStep] = useState<StepType>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<{ access: string; refresh: string } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    passwordConfirm: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    restaurantName: '',
    restaurantSlug: '',
    restaurantDescription: '',
    restaurantEmail: '',
    restaurantPhone: '',
    restaurantWebsite: '',
    restaurantAddress: '',
    restaurantCity: '',
    restaurantPostalCode: '',
    restaurantCountry: 'Georgia',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-generate slug from restaurant name
    if (name === 'restaurantName') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, restaurantSlug: slug }));
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/v1/auth/register/', {
        email: formData.email,
        password: formData.password,
        password_confirm: formData.passwordConfirm,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        preferred_language: locale,
      });

      if (response.data.success) {
        setTokens(response.data.data.tokens);
        setStep('restaurant');
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as {
          response?: { data?: { detail?: string; email?: string[]; password?: string[] } };
        };
        const errorData = axiosErr.response?.data;
        if (errorData?.detail) {
          setError(errorData.detail);
        } else if (errorData?.email) {
          setError(errorData.email[0]);
        } else if (errorData?.password) {
          setError(errorData.password[0]);
        } else {
          setError(t.register.registrationFailed);
        }
      } else {
        setError(t.register.registrationFailed);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestaurantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await axios.post(
        '/api/v1/restaurants/create/',
        {
          name: formData.restaurantName,
          slug: formData.restaurantSlug,
          description: formData.restaurantDescription,
          email: formData.restaurantEmail || formData.email,
          phone: formData.restaurantPhone || formData.phoneNumber,
          website: formData.restaurantWebsite,
          address: formData.restaurantAddress,
          city: formData.restaurantCity,
          postal_code: formData.restaurantPostalCode,
          country: formData.restaurantCountry,
        },
        {
          headers: {
            Authorization: `Bearer ${tokens?.access}`,
          },
        }
      );

      // Redirect to success or dashboard
      router.push(`/${locale}`);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as {
          response?: { data?: { detail?: string; slug?: string[]; name?: string[] } };
        };
        const errorData = axiosErr.response?.data;
        if (errorData?.detail) {
          setError(errorData.detail);
        } else if (errorData?.slug) {
          setError(errorData.slug[0]);
        } else if (errorData?.name) {
          setError(errorData.name[0]);
        } else {
          setError(t.register.restaurantCreationFailed);
        }
      } else {
        setError(t.register.restaurantCreationFailed);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <FormCard>
        <Header>
          <Title>{step === 'user' ? t.register.createAccount : t.register.restaurantDetails}</Title>
          <Subtitle>
            {step === 'user' ? t.register.userSubtitle : t.register.restaurantSubtitle}
          </Subtitle>
        </Header>

        <Steps>
          <Step>
            <StepNumber isActive={step === 'user'} isCompleted={step === 'restaurant'}>
              1
            </StepNumber>
            <StepLabel isActive={step === 'user'} isCompleted={step === 'restaurant'}>
              {t.register.accountStep}
            </StepLabel>
          </Step>
          <StepDivider />
          <Step>
            <StepNumber isActive={step === 'restaurant'}>2</StepNumber>
            <StepLabel isActive={step === 'restaurant'}>{t.register.restaurantStep}</StepLabel>
          </Step>
        </Steps>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {step === 'user' ? (
          <Form onSubmit={handleUserSubmit}>
            <Row>
              <Field>
                <Label htmlFor='firstName'>{t.register.firstName}</Label>
                <Input
                  type='text'
                  id='firstName'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <Label htmlFor='lastName'>{t.register.lastName}</Label>
                <Input
                  type='text'
                  id='lastName'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Field>
            </Row>

            <Field>
              <Label htmlFor='email'>{t.register.email}</Label>
              <Input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Field>

            <Field>
              <Label htmlFor='phoneNumber'>{t.register.phoneNumber}</Label>
              <Input
                type='tel'
                id='phoneNumber'
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder='+995 XXX XXX XXX'
              />
            </Field>

            <Field>
              <Label htmlFor='password'>{t.register.password}</Label>
              <Input
                type='password'
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </Field>

            <Field>
              <Label htmlFor='passwordConfirm'>{t.register.confirmPassword}</Label>
              <Input
                type='password'
                id='passwordConfirm'
                name='passwordConfirm'
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
                minLength={8}
              />
            </Field>

            <SubmitButton type='submit' disabled={isLoading}>
              {isLoading ? t.common.loading : t.register.continue}
            </SubmitButton>
          </Form>
        ) : (
          <Form onSubmit={handleRestaurantSubmit}>
            <Field>
              <Label htmlFor='restaurantName'>{t.register.restaurantName}</Label>
              <Input
                type='text'
                id='restaurantName'
                name='restaurantName'
                value={formData.restaurantName}
                onChange={handleChange}
                required
              />
            </Field>

            <Field>
              <Label htmlFor='restaurantSlug'>{t.register.restaurantSlug}</Label>
              <Input
                type='text'
                id='restaurantSlug'
                name='restaurantSlug'
                value={formData.restaurantSlug}
                onChange={handleChange}
                pattern='[a-z0-9-]+'
                required
              />
              <Hint>{t.register.slugHint}</Hint>
            </Field>

            <Field>
              <Label htmlFor='restaurantDescription'>{t.register.restaurantDescription}</Label>
              <Textarea
                id='restaurantDescription'
                name='restaurantDescription'
                value={formData.restaurantDescription}
                onChange={handleChange}
                rows={3}
              />
            </Field>

            <Row>
              <Field>
                <Label htmlFor='restaurantEmail'>{t.register.restaurantEmail}</Label>
                <Input
                  type='email'
                  id='restaurantEmail'
                  name='restaurantEmail'
                  value={formData.restaurantEmail}
                  onChange={handleChange}
                  placeholder={formData.email}
                />
              </Field>
              <Field>
                <Label htmlFor='restaurantPhone'>{t.register.restaurantPhone}</Label>
                <Input
                  type='tel'
                  id='restaurantPhone'
                  name='restaurantPhone'
                  value={formData.restaurantPhone}
                  onChange={handleChange}
                  placeholder={formData.phoneNumber}
                />
              </Field>
            </Row>

            <Field>
              <Label htmlFor='restaurantWebsite'>{t.register.restaurantWebsite}</Label>
              <Input
                type='url'
                id='restaurantWebsite'
                name='restaurantWebsite'
                value={formData.restaurantWebsite}
                onChange={handleChange}
                placeholder='https://'
              />
            </Field>

            <Field>
              <Label htmlFor='restaurantAddress'>{t.register.address}</Label>
              <Input
                type='text'
                id='restaurantAddress'
                name='restaurantAddress'
                value={formData.restaurantAddress}
                onChange={handleChange}
                required
              />
            </Field>

            <Row>
              <Field>
                <Label htmlFor='restaurantCity'>{t.register.city}</Label>
                <Input
                  type='text'
                  id='restaurantCity'
                  name='restaurantCity'
                  value={formData.restaurantCity}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <Label htmlFor='restaurantPostalCode'>{t.register.postalCode}</Label>
                <Input
                  type='text'
                  id='restaurantPostalCode'
                  name='restaurantPostalCode'
                  value={formData.restaurantPostalCode}
                  onChange={handleChange}
                />
              </Field>
            </Row>

            <Field>
              <Label htmlFor='restaurantCountry'>{t.register.country}</Label>
              <Input
                type='text'
                id='restaurantCountry'
                name='restaurantCountry'
                value={formData.restaurantCountry}
                onChange={handleChange}
                required
              />
            </Field>

            <ButtonRow>
              <BackButton type='button' onClick={() => setStep('user')} disabled={isLoading}>
                {t.common.back}
              </BackButton>
              <SubmitButton type='submit' disabled={isLoading}>
                {isLoading ? t.common.loading : t.register.createRestaurant}
              </SubmitButton>
            </ButtonRow>
          </Form>
        )}
      </FormCard>
    </Container>
  );
}
