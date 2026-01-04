'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import axios from '@/api/axios';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

import styles from './RegisterForm.module.css';

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

type Step = 'user' | 'restaurant';

export default function RegisterForm({ locale }: RegisterFormProps) {
  const router = useRouter();
  const t = getDictionary(locale);
  const [step, setStep] = useState<Step>('user');
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
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {step === 'user' ? t.register.createAccount : t.register.restaurantDetails}
          </h1>
          <p className={styles.subtitle}>
            {step === 'user' ? t.register.userSubtitle : t.register.restaurantSubtitle}
          </p>
        </div>

        <div className={styles.steps}>
          <div className={`${styles.step} ${step === 'user' ? styles.active : styles.completed}`}>
            <span className={styles.stepNumber}>1</span>
            <span className={styles.stepLabel}>{t.register.accountStep}</span>
          </div>
          <div className={styles.stepDivider} />
          <div className={`${styles.step} ${step === 'restaurant' ? styles.active : ''}`}>
            <span className={styles.stepNumber}>2</span>
            <span className={styles.stepLabel}>{t.register.restaurantStep}</span>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {step === 'user' ? (
          <form onSubmit={handleUserSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor='firstName' className={styles.label}>
                  {t.register.firstName}
                </label>
                <input
                  type='text'
                  id='firstName'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor='lastName' className={styles.label}>
                  {t.register.lastName}
                </label>
                <input
                  type='text'
                  id='lastName'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor='email' className={styles.label}>
                {t.register.email}
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='phoneNumber' className={styles.label}>
                {t.register.phoneNumber}
              </label>
              <input
                type='tel'
                id='phoneNumber'
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleChange}
                className={styles.input}
                placeholder='+995 XXX XXX XXX'
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='password' className={styles.label}>
                {t.register.password}
              </label>
              <input
                type='password'
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                required
                minLength={8}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='passwordConfirm' className={styles.label}>
                {t.register.confirmPassword}
              </label>
              <input
                type='password'
                id='passwordConfirm'
                name='passwordConfirm'
                value={formData.passwordConfirm}
                onChange={handleChange}
                className={styles.input}
                required
                minLength={8}
              />
            </div>

            <button type='submit' className={styles.submitButton} disabled={isLoading}>
              {isLoading ? t.common.loading : t.register.continue}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRestaurantSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor='restaurantName' className={styles.label}>
                {t.register.restaurantName}
              </label>
              <input
                type='text'
                id='restaurantName'
                name='restaurantName'
                value={formData.restaurantName}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='restaurantSlug' className={styles.label}>
                {t.register.restaurantSlug}
              </label>
              <input
                type='text'
                id='restaurantSlug'
                name='restaurantSlug'
                value={formData.restaurantSlug}
                onChange={handleChange}
                className={styles.input}
                pattern='[a-z0-9-]+'
                required
              />
              <span className={styles.hint}>{t.register.slugHint}</span>
            </div>

            <div className={styles.field}>
              <label htmlFor='restaurantDescription' className={styles.label}>
                {t.register.restaurantDescription}
              </label>
              <textarea
                id='restaurantDescription'
                name='restaurantDescription'
                value={formData.restaurantDescription}
                onChange={handleChange}
                className={styles.textarea}
                rows={3}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor='restaurantEmail' className={styles.label}>
                  {t.register.restaurantEmail}
                </label>
                <input
                  type='email'
                  id='restaurantEmail'
                  name='restaurantEmail'
                  value={formData.restaurantEmail}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder={formData.email}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor='restaurantPhone' className={styles.label}>
                  {t.register.restaurantPhone}
                </label>
                <input
                  type='tel'
                  id='restaurantPhone'
                  name='restaurantPhone'
                  value={formData.restaurantPhone}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder={formData.phoneNumber}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor='restaurantWebsite' className={styles.label}>
                {t.register.restaurantWebsite}
              </label>
              <input
                type='url'
                id='restaurantWebsite'
                name='restaurantWebsite'
                value={formData.restaurantWebsite}
                onChange={handleChange}
                className={styles.input}
                placeholder='https://'
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='restaurantAddress' className={styles.label}>
                {t.register.address}
              </label>
              <input
                type='text'
                id='restaurantAddress'
                name='restaurantAddress'
                value={formData.restaurantAddress}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor='restaurantCity' className={styles.label}>
                  {t.register.city}
                </label>
                <input
                  type='text'
                  id='restaurantCity'
                  name='restaurantCity'
                  value={formData.restaurantCity}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor='restaurantPostalCode' className={styles.label}>
                  {t.register.postalCode}
                </label>
                <input
                  type='text'
                  id='restaurantPostalCode'
                  name='restaurantPostalCode'
                  value={formData.restaurantPostalCode}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor='restaurantCountry' className={styles.label}>
                {t.register.country}
              </label>
              <input
                type='text'
                id='restaurantCountry'
                name='restaurantCountry'
                value={formData.restaurantCountry}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.buttonRow}>
              <button
                type='button'
                className={styles.backButton}
                onClick={() => setStep('user')}
                disabled={isLoading}
              >
                {t.common.back}
              </button>
              <button type='submit' className={styles.submitButton} disabled={isLoading}>
                {isLoading ? t.common.loading : t.register.createRestaurant}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
