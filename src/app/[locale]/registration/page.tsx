'use client';

import React from 'react';

import TextArea from '@/components/TextArea/TextArea';
import TextInput from '@/components/TextInput/TextInput';
import CalendarIcon from '@/icons/Calendar';
import ClockIcon from '@/icons/Clock';
import EyeIcon from '@/icons/Eye';
import LocationIcon from '@/icons/Location';
import SearchIcon from '@/icons/Search';

function Page() {
  return (
    <>
      <TextInput />
      <TextInput
        label='Email'
        type='email'
        required
        placeholder='email@example.com'
        errorMessage='Please enter a valid email'
      />
      <TextInput label='Phone' type='tel' required placeholder='+995 555 12 34 56' />
      <TextInput label='Number' type='number' required placeholder='0' />
      <TextInput label='Password' type='password' required placeholder='Enter your password' />
      <TextInput disabled={true} />
      <TextInput label='Search' icon={SearchIcon} placeholder='Search...' />
      <TextInput
        label='Password'
        type='password'
        icon={EyeIcon}
        placeholder='Enter your password'
      />
      <TextInput
        label='Location'
        type='location'
        icon={LocationIcon}
        placeholder='Enter your location'
      />
      <TextInput label='Date' type='date' icon={CalendarIcon} placeholder='Select a date' />
      <TextInput label='Time' type='time' icon={ClockIcon} placeholder='Select a time' />
      <TextArea label='TextArea' placeholder='Type your message here...' rows={5} />
    </>
  );
}

export default Page;
