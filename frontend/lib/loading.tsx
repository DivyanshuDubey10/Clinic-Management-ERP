"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

interface LoadingContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType>({
  showLoading: () => {},
  hideLoading: () => {},
  isLoading: false,
});

export function useLoading() {
  return useContext(LoadingContext);
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState<string | undefined>();

  const showLoading = useCallback((msg?: string) => {
    setMessage(msg);
    setCount((c) => c + 1);
  }, []);

  const hideLoading = useCallback(() => {
    setCount((c) => Math.max(0, c - 1));
  }, []);

  const isLoading = count > 0;

  const value = useMemo(
    () => ({ showLoading, hideLoading, isLoading }),
    [showLoading, hideLoading, isLoading]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadingOverlay visible={isLoading} message={message} />
    </LoadingContext.Provider>
  );
}
