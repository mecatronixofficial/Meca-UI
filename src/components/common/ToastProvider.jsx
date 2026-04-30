import React from "react";
import { Toaster } from "react-hot-toast";

const commonToastOptions = {
  duration: 5000,
  style: {
    background: "rgba(18, 18, 18, 0.8)",
    backdropFilter: "blur(12px) saturate(180%)",
    WebkitBackdropFilter: "blur(12px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#F9FAFB",
    fontSize: "15px",
    fontWeight: "500",
    padding: "12px 20px",
    borderRadius: "16px",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
    letterSpacing: "0.01em",
  },
};

const ToastProvider = () => {
  return (
    <>
      {/* ✅ Success & Error → TOP RIGHT */}
      <Toaster
        position="top-right"
        gutter={12}
        containerStyle={{ top: 40, right: 20 }}
        toastOptions={{
          ...commonToastOptions,
          success: {
            style: {
              border: "1px solid rgba(16, 185, 129, 0.3)",
            },
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            style: {
              border: "1px solid rgba(244, 63, 94, 0.3)",
            },
            iconTheme: {
              primary: "#f43f5e",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* ⏳ Loading & Custom → BOTTOM RIGHT */}
      <Toaster
        position="bottom-right"
        gutter={12}
        containerStyle={{ bottom: 40, right: 20 }}
        toastOptions={{
          ...commonToastOptions,
          loading: {
            style: {
              border: "1px solid rgba(99, 102, 241, 0.3)",
            },
          },
        }}
      />
    </>
  );
};

export default ToastProvider;
