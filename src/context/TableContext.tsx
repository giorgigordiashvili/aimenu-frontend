'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import axiosInstance from '@/api/axios';

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

  // Rehydrate from sessionStorage on mount so navigations (restaurant page →
  // order-review) don't lose the session id / validation state.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = sessionStorage.getItem('tableData');
      if (raw) {
        const parsed = JSON.parse(raw) as TableData;
        if (parsed && typeof parsed === 'object' && parsed.code) {
          setTableDataState(parsed);
          // Verify the session is still alive on the server; if it's
          // been closed by staff the client must drop the stale tableData
          // so order / invite flows stop pointing at a dead session.
          if (parsed.sessionId) {
            axiosInstance
              .get(`/api/v1/tables/sessions/${parsed.sessionId}/`)
              .catch((err: { response?: { status?: number } }) => {
                const code = err?.response?.status;
                if (code === 404 || code === 410) {
                  setTableDataState(null);
                  try {
                    sessionStorage.removeItem('tableCode');
                    sessionStorage.removeItem('tableData');
                  } catch {
                    /* ignore */
                  }
                }
              });
          }
        }
      }
    } catch {
      // Corrupt JSON — ignore.
    }
  }, []);

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
