import { useCallback, useEffect, useRef, useState } from 'react';

import { ReservationList } from '@/api/generated/interfaces';

import { useActiveReservations, useHistoryReservations } from './useReservations';

export function useReservationsPagination() {
  const [activePage, setActivePage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [allActive, setAllActive] = useState<ReservationList[]>([]);
  const [allHistory, setAllHistory] = useState<ReservationList[]>([]);

  const {
    reservations: activeData,
    count: activeCount,
    hasMore: activeHasMore,
    isLoading: activeLoading,
    mutate: mutateActive,
  } = useActiveReservations(activePage);

  const {
    reservations: historyData,
    count: historyCount,
    hasMore: historyHasMore,
    isLoading: historyLoading,
    mutate: mutateHistory,
  } = useHistoryReservations(historyPage);

  // Stable string keys so effects only fire when actual items change,
  // not on every SWR revalidation that returns a new array reference.
  const activeKey = activeData.map(r => r.id).join(',');
  const historyKey = historyData.map(r => r.id).join(',');

  // Refs let effects read current data without listing it in the dep array.
  const activeDataRef = useRef(activeData);
  activeDataRef.current = activeData;
  const historyDataRef = useRef(historyData);
  historyDataRef.current = historyData;

  useEffect(() => {
    const data = activeDataRef.current;
    if (!activeLoading && data.length > 0) {
      setAllActive(prev =>
        activePage === 1 ? data : [...prev, ...data.filter(r => !prev.find(p => p.id === r.id))]
      );
    }
    if (activePage === 1 && !activeLoading && data.length === 0) {
      setAllActive(prev => (prev.length === 0 ? prev : []));
    }
  }, [activeKey, activePage, activeLoading]);

  useEffect(() => {
    const data = historyDataRef.current;
    if (!historyLoading && data.length > 0) {
      setAllHistory(prev =>
        historyPage === 1 ? data : [...prev, ...data.filter(r => !prev.find(p => p.id === r.id))]
      );
    }
    if (historyPage === 1 && !historyLoading && data.length === 0) {
      setAllHistory(prev => (prev.length === 0 ? prev : []));
    }
  }, [historyKey, historyPage, historyLoading]);

  const loadMoreActive = useCallback(() => setActivePage(p => p + 1), []);
  const collapseActive = useCallback(() => {
    setActivePage(1);
    setAllActive([]);
  }, []);

  const loadMoreHistory = useCallback(() => setHistoryPage(p => p + 1), []);
  const collapseHistory = useCallback(() => {
    setHistoryPage(1);
    setAllHistory([]);
  }, []);

  const resetPagination = useCallback(() => {
    setActivePage(1);
    setHistoryPage(1);
    setAllActive([]);
    setAllHistory([]);
    mutateActive();
    mutateHistory();
  }, [mutateActive, mutateHistory]);

  return {
    allActive,
    allHistory,
    activeCount,
    historyCount,
    activeHasMore,
    historyHasMore,
    activeLoading,
    historyLoading,
    activePage,
    historyPage,
    loadMoreActive,
    collapseActive,
    loadMoreHistory,
    collapseHistory,
    resetPagination,
  };
}
