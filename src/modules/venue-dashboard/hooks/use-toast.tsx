"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Icon } from "../components/ui/icon";

const TOAST_MS = 3500;

const ToastContext = createContext<((message: string) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const element = useRef<HTMLDivElement>(null);

  const show = useCallback((next: string) => {
    setMessage(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), TOAST_MS);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  // A popover sits in the top layer, so toasts stay above open modals.
  useEffect(() => {
    if (message) element.current?.showPopover();
  }, [message]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {message && (
        <div
          ref={element}
          popover="manual"
          role="status"
          className="fixed inset-x-4 top-auto bottom-7 mx-auto flex w-fit max-w-[calc(100%-2rem)] animate-pop items-center gap-3 rounded-xl border-0 bg-ink px-4.5 py-3.5 text-[15px] text-paper shadow-[0_16px_40px_-16px_rgb(0_0_0/0.5)]"
        >
          <Icon name="check" size={18} />
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast needs ToastProvider");
  return context;
}
