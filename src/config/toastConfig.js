import toast from "react-hot-toast";

/**
 * 🔹 Base toast configuration (shared styles)
 */
export const toastConfig = {
  duration: 4000,
  style: {
    fontSize: "16px",
    padding: "16px",
    borderRadius: "12px",
    boxShadow:
      "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
  },
};

/**
 * ✅ Success Toast → TOP RIGHT
 */
export const showSuccessToast = (message, options = {}) => {
  return toast.success(message, {
    ...toastConfig,
    position: "top-right",
    style: {
      ...toastConfig.style,
      background: "#059669",
      color: "#ffffff",
    },
    iconTheme: {
      primary: "#10b981",
      secondary: "#ffffff",
    },
    ...options,
  });
};

/**
 * ❌ Error Toast → TOP RIGHT
 */
export const showErrorToast = (message, options = {}) => {
  return toast.error(message, {
    ...toastConfig,
    position: "top-right",
    style: {
      ...toastConfig.style,
      background: "#dc2626",
      color: "#ffffff",
    },
    iconTheme: {
      primary: "#ef4444",
      secondary: "#ffffff",
    },
    ...options,
  });
};

/**
 * ⏳ Loading Toast → BOTTOM RIGHT
 */
export const showLoadingToast = (message, options = {}) => {
  return toast.loading(message, {
    ...toastConfig,
    position: "bottom-right",
    style: {
      ...toastConfig.style,
      background: "#4b5563",
      color: "#ffffff",
    },
    ...options,
  });
};

/**
 * 🎨 Custom Toast (position optional)
 */
export const showCustomToast = (message, options = {}) => {
  return toast(message, {
    ...toastConfig,
    position: options.position || "bottom-right",
    ...options,
  });
};

/**
 * 🧹 Dismiss specific toast
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * 🧼 Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};
