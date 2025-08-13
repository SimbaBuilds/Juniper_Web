import { useState, useEffect, useRef, useCallback } from 'react';
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
  const previousRequestIdRef = useRef<string | null>(null);

  // Final states that should stop polling
  const finalStates = ['completed', 'failed', 'cancelled'];

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const startPolling = useCallback(async () => {
    if (!requestId) return;

    setIsPolling(true);
    setError(null);

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
            // No rows returned - request not found
            console.log(`Request ${requestId} not found, continuing to poll...`);
            return;
          }
          throw error;
        }

        const currentStatus = data?.status;
        
        if (currentStatus !== null) {
          setStatus(currentStatus);
          
          // Call status change callback if provided
          if (onStatusChange) {
            onStatusChange(currentStatus);
          }

          // Stop polling if we've reached a final state
          if (finalStates.includes(currentStatus)) {
            console.log(`Request ${requestId} reached final state: ${currentStatus}`);
            stopPolling();
          }
        } else {
          // Request not found in database yet, continue polling
          console.log(`Request ${requestId} not found, continuing to poll...`);
        }
      } catch (err) {
        console.error('Error polling request status:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        stopPolling();
      }
    };

    // Poll immediately, then set up interval
    await pollStatus();
    
    // Only set up interval if we haven't stopped polling (i.e., not in final state)
    if (isPolling && !finalStates.includes(status || '')) {
      intervalRef.current = setInterval(pollStatus, intervalMs);
    }
  }, [requestId, intervalMs, onStatusChange, isPolling, status, finalStates, stopPolling]);

  useEffect(() => {
    // Reset state when requestId changes
    if (requestId !== previousRequestIdRef.current) {
      setStatus(null);
      setError(null);
      stopPolling();
      previousRequestIdRef.current = requestId;
    }

    if (requestId) {
      startPolling();
    } else {
      stopPolling();
    }

    // Cleanup on unmount or requestId change
    return () => {
      stopPolling();
    };
  }, [requestId, startPolling, stopPolling]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    status,
    error,
    isPolling
  };
};