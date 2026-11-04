import type { Metadata } from "next";
import { FeedbackProvider } from "./_components/Feedback";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Mecatronix Admin" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <FeedbackProvider>{children}</FeedbackProvider>;
}
