'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface TableData {
  code: string;
  tableNumber?: string;
  tableName?: string;
  restaurantSlug?: string;
  sessionId?: string;
  isValidated: boolean;
}

interface TableContextType {
  tableData: TableData | null;
  setTableCode: (code: string) => void;
  setTableData: (data: TableData) => void;
  clearTable: () => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export function TableProvider({ children }: { children: ReactNode }) {
  const [tableData, setTableDataState] = useState<TableData | null>(null);

  const setTableCode = useCallback((code: string) => {
    setTableDataState({
      code,
      isValidated: false,
    });
    // Also store in sessionStorage for persistence
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('tableCode', code);
    }
  }, []);

  const setTableData = useCallback((data: TableData) => {
    setTableDataState(data);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('tableCode', data.code);
      sessionStorage.setItem('tableData', JSON.stringify(data));
    }
  }, []);

  const clearTable = useCallback(() => {
    setTableDataState(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('tableCode');
      sessionStorage.removeItem('tableData');
    }
  }, []);

  return (
    <TableContext.Provider
      value={{
        tableData,
        setTableCode,
        setTableData,
        clearTable,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
}
