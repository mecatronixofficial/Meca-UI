"use client";

import { useFeedback } from "../../_components/Feedback";
import { Badge } from "../../_components/ui";
import { api } from "../../_lib/api";
import { formatMoney } from "../../_lib/format";
import type { Invoice, InvoiceStatus } from "../../_lib/types";

export const STATUS: Record<InvoiceStatus, { label: string; tone: "neutral" | "info" | "success" | "accent" | "danger" }> = {
  draft: { label: "Draft", tone: "neutral" },
  bill_generated: { label: "Bill generated", tone: "info" },
  sent: { label: "Sent", tone: "accent" },
  paid: { label: "Paid", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
};

export const StatusBadge = ({ status }: { status: InvoiceStatus }) => <Badge tone={STATUS[status]?.tone ?? "neutral"}>{STATUS[status]?.label ?? status}</Badge>;

/** Invoice workflow calls shared by the list and the invoice page. Each resolves true on success. */
export function useInvoiceActions() {
  const { toast, confirm } = useFeedback();

  const run = async (request: () => Promise<{ message: string }>) => {
    try {
      const { message } = await request();
      toast.success(message);
      return true;
    } catch (error) {
      toast.error((error as Error).message);
      return false;
    }
  };

  return {
    generateBill: (invoice: Invoice) => run(() => api(`invoice/generate-bill/${invoice.id}`, { method: "PATCH" })),

    sendEmail: async (invoice: Invoice) => {
      if (!invoice.clientEmail) {
        toast.error("Add a client email to this invoice first.");
        return false;
      }
      const ok = await confirm({
        title: "Email this invoice?",
        message: `Invoice ${invoice.invoiceNo} (${formatMoney(invoice.total)}) will be emailed to ${invoice.clientEmail}.`,
        confirmLabel: "Send email",
        tone: "primary",
      });
      return ok && run(() => api(`invoice/send-email/${invoice.id}`, { method: "POST" }));
    },

    /** Opens WhatsApp with a prepared message, then records it as sent. */
    sendWhatsapp: async (invoice: Invoice) => {
      const phone = invoice.clientPhone.replace(/\D/g, "");
      const text = `Hello ${invoice.clientName}, this is Mecatronix. Your invoice ${invoice.invoiceNo} for ${formatMoney(invoice.total)} is ready.${invoice.dueDate ? ` Due date: ${invoice.dueDate}.` : ""} Thank you!`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      return run(() => api(`invoice/send-whatsapp/${invoice.id}`, { method: "PATCH" }));
    },
  };
}
