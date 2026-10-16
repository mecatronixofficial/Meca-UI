import { useCallback } from "react";
import type { ToastOptions } from "react-hot-toast";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  showCustomToast,
  dismissToast,
  dismissAllToasts,
} from "../config/toastConfig"; // ✅ make sure path is correct

/**
 * 🔔 Custom hook for toast notifications
 * Clean API for success, error, loading & custom toasts
 */
export const useToast = () => {
  /**
   * ✅ Success Toast (Top Right)
   */
  const success = useCallback((message: string, options: ToastOptions = {}) => {
    return showSuccessToast(message, options);
  }, []);

  /**
   * ❌ Error Toast (Top Right)
   */
  const error = useCallback((message: string, options: ToastOptions = {}) => {
    return showErrorToast(message, options);
  }, []);

  /**
   * ⏳ Loading Toast (Bottom Right)
   */
  const loading = useCallback((message: string, options: ToastOptions = {}) => {
    return showLoadingToast(message, options);
  }, []);

  /**
   * 🎨 Custom Toast
   */
  const custom = useCallback((message: string, options: ToastOptions = {}) => {
    return showCustomToast(message, options);
  }, []);

  /**
   * 🧹 Dismiss specific toast
   */
  const dismiss = useCallback((toastId?: string) => {
    dismissToast(toastId);
  }, []);

  /**
   * 🧼 Dismiss all toasts
   */
  const dismissAll = useCallback(() => {
    dismissAllToasts();
  }, []);

  return {
    success,
    error,
    loading,
    custom,
    dismiss,
    dismissAll,
  };
};
