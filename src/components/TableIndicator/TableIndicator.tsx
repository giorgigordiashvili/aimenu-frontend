'use client';

import { useTable } from '@/context/TableContext';

import styles from './TableIndicator.module.css';

export default function TableIndicator() {
  const { tableData } = useTable();

  if (!tableData || !tableData.code) return null;

  const displayText = tableData.tableNumber
    ? `მაგიდა ${tableData.tableNumber}`
    : tableData.tableName || 'მაგიდა';

  return (
    <div className={styles.indicator}>
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M3 21H21M4 18H20M4 18V14M20 18V14M4 14V10C4 10 4 7 12 7C20 7 20 10 20 10V14M4 14H20'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      <span>{displayText}</span>
    </div>
  );
}
