import { useState, useEffect, useRef } from 'react';
import { createClient } from '../lib/utils/supabase/client';

export interface UseRequestStatusPollingOptions {
  requestId: string | null;
  intervalMs?: number;
  onStatusChange?: (status: string) => void;
}

export interface UseRequestStatusPollingReturn {
  status: string | null;
  error: string | null;
  isPolling: boolean;
}

export const useRequestStatusPolling = (
  options: UseRequestStatusPollingOptions
): UseRequestStatusPollingReturn => {
  const { requestId, intervalMs = 5000, onStatusChange } = options;
  
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Final states that should stop polling
  const finalStates = ['completed', 'failed', 'cancelled'];

  useEffect(() => {
    
    if (!requestId) {
      setStatus(null);
      setError(null);
      setIsPolling(false);
      return;
    }

    const startPolling = async () => {
      setIsPolling(true);

      // Add 2 second delay before starting to poll to let backend create the request record
      await new Promise(resolve => setTimeout(resolve, 2000));

        const pollStatus = async () => {
          try {
            const supabase = createClient();
            
            const { data, error } = await supabase
              .from('requests')
              .select('status')
              .eq('request_id', requestId)
              .single();

            if (error) {
              if (error.code === 'PGRST116') {
                // No rows returned - request not found, continue polling
                return;
              }
              throw error;
            }

            const currentStatus = data?.status;
            
            if (currentStatus) {
              setStatus(currentStatus);
              setError(null);
              
              // Call status change callback if provided
              if (onStatusChange) {
                onStatusChange(currentStatus);
              }

              // Stop polling when request reaches a final state
              if (finalStates.includes(currentStatus)) {
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
                setIsPolling(false);
              }
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch request status');
            setIsPolling(false);
          }
        };

        // Initial poll
        await pollStatus();

        // Set up interval for subsequent polls
        intervalRef.current = setInterval(pollStatus, intervalMs);
      };

    // Start the polling process
    startPolling();

    // Cleanup on unmount or when requestId changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPolling(false);
    };
  }, [requestId, intervalMs, onStatusChange]);

  return {
    status,
    error,
    isPolling
  };
};