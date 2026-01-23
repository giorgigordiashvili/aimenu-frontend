'use client';

import React from 'react';

import Dropdown from '@/components/Dropdown/Dropdown';
import PeopleIcon from '@/icons/People';

function Page() {
  const [department, setDepartment] = React.useState<string>('');
  return (
    <>
      <Dropdown
        label='Department'
        placeholder='Choose department'
        value={department}
        onChange={setDepartment}
        icon={<PeopleIcon />}
        options={[
          { label: 'Design', value: 'design' },
          { label: 'Development', value: 'dev' },
        ]}
      />
      <Dropdown
        label='Department (disabled)'
        placeholder='Choose department'
        value={department}
        onChange={setDepartment}
        options={[
          { label: 'Design', value: 'design' },
          { label: 'Development', value: 'dev' },
        ]}
        disabled
      />
    </>
  );
}

export default Page;
