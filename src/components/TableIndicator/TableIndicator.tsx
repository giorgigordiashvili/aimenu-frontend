'use client';

import { styled } from '@pigment-css/react';

import { useTable } from '@/context/TableContext';

const Indicator = styled('div')({
  position: 'fixed',
  bottom: '100px',
  right: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 16px',
  background: '#ec003f',
  color: '#ffffff',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: 500,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  zIndex: 90,
});

export default function TableIndicator() {
  const { tableData } = useTable();

  if (!tableData || !tableData.code) return null;

  const displayText = tableData.tableNumber
    ? `მაგიდა ${tableData.tableNumber}`
    : tableData.tableName || 'მაგიდა';

  return (
    <Indicator>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 21H21M4 18H20M4 18V14M20 18V14M4 14V10C4 10 4 7 12 7C20 7 20 10 20 10V14M4 14H20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{displayText}</span>
    </Indicator>
  );
}
