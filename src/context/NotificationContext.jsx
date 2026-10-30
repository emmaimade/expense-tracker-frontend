import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/apiService';

const NotificationContext = createContext();

// Also invalidated by expense and budget changes (useExpenseMutations, useBudget)
const NOTIFICATIONS_KEY = ['notifications'];
const CLEAR_UNDO_MS = 5000;

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

/**
 * Notifications come from the API (budget alerts are created server-side when
 * spending crosses 80/100/120% of a budget), so they're the same on every
 * device. Updates are applied to the cache immediately, then sent.
 */
export const NotificationProvider = ({ children, userId }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: () => apiService.get('/notifications?limit=50'),
    select: (res) => res.data,
    enabled: !!userId,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000,
  });

  // Notifications used to be kept in this browser; remove that old copy
  useEffect(() => {
    if (userId) localStorage.removeItem(`notifications_${userId}`);
  }, [userId]);

  // Apply a change to the cached list right away (rolled back on error)
  const optimistic = useCallback(
    async (change) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous = queryClient.getQueryData(NOTIFICATIONS_KEY);
      queryClient.setQueryData(NOTIFICATIONS_KEY, (old) => {
        if (!old?.data) return old;
        const notifications = change(old.data.notifications);
        return {
          ...old,
          data: { notifications, unreadCount: notifications.filter((n) => !n.read).length },
        };
      });
      return { previous };
    },
    [queryClient]
  );

  const rollback = (_error, _vars, context) => {
    if (context?.previous) queryClient.setQueryData(NOTIFICATIONS_KEY, context.previous);
  };
  const settle = () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });

  const markAsReadMutation = useMutation({
    mutationFn: (id) => apiService.patch(`/notifications/${id}/read`),
    onMutate: (id) => optimistic((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n))),
    onError: rollback,
    onSettled: settle,
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => apiService.patch('/notifications/read-all'),
    onMutate: () => optimistic((list) => list.map((n) => ({ ...n, read: true }))),
    onError: rollback,
    onSettled: settle,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiService.delete(`/notifications/${id}`),
    onMutate: (id) => optimistic((list) => list.filter((n) => n.id !== id)),
    onError: rollback,
    onSettled: settle,
  });

  // "Clear all" hides everything now and only tells the server after a short
  // delay, so Undo can simply restore the cached list
  const pendingClear = useRef(null);

  const clearAll = useCallback(async () => {
    const { previous } = await optimistic(() => []);
    const timer = setTimeout(async () => {
      pendingClear.current = null;
      try {
        await apiService.delete('/notifications');
      } catch {
        if (previous) queryClient.setQueryData(NOTIFICATIONS_KEY, previous);
      }
      settle();
    }, CLEAR_UNDO_MS);
    pendingClear.current = { timer, previous };

    return () => {
      // undo
      if (!pendingClear.current) return;
      clearTimeout(pendingClear.current.timer);
      if (pendingClear.current.previous) queryClient.setQueryData(NOTIFICATIONS_KEY, pendingClear.current.previous);
      pendingClear.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- settle only invalidates the query
  }, [optimistic, queryClient]);

  const value = useMemo(
    () => ({
      notifications: data?.notifications ?? [],
      unreadCount: data?.unreadCount ?? 0,
      isLoading,
      isError,
      refresh: refetch,
      markAsRead: markAsReadMutation.mutate,
      markAllAsRead: markAllAsReadMutation.mutate,
      deleteNotification: deleteMutation.mutate,
      clearAll,
    }),
    [data, isLoading, isError, refetch, markAsReadMutation.mutate, markAllAsReadMutation.mutate, deleteMutation.mutate, clearAll]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
