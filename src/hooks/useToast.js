import { useCallback } from "react";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  showCustomToast,
  dismissToast,
  dismissAllToasts,
} from "../config/toastConfig.js"; // ✅ make sure path is correct

/**
 * 🔔 Custom hook for toast notifications
 * Clean API for success, error, loading & custom toasts
 */
export const useToast = () => {
  /**
   * ✅ Success Toast (Top Right)
   */
  const success = useCallback((message, options = {}) => {
    return showSuccessToast(message, options);
  }, []);

  /**
   * ❌ Error Toast (Top Right)
   */
  const error = useCallback((message, options = {}) => {
    return showErrorToast(message, options);
  }, []);

  /**
   * ⏳ Loading Toast (Bottom Right)
   */
  const loading = useCallback((message, options = {}) => {
    return showLoadingToast(message, options);
  }, []);

  /**
   * 🎨 Custom Toast
   */
  const custom = useCallback((message, options = {}) => {
    return showCustomToast(message, options);
  }, []);

  /**
   * 🧹 Dismiss specific toast
   */
  const dismiss = useCallback((toastId) => {
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
