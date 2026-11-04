/** Shapes returned by the Mecatronix API (mec-api). Dates arrive as ISO strings. */

export type Role = "admin" | "superadmin";

interface Entity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PageMeta;
}

export interface Admin extends Entity {
  name: string;
  email: string;
  phone: string;
  img?: string | null;
  role: Role;
}

export interface Enquiry extends Entity {
  name: string;
  email: string;
  phone: string;
  company_name: string;
  message: string;
  is_opened: boolean;
  opened_at?: string | null;
}

export interface Review extends Entity {
  user_name: string;
  user_email: string;
  company_name: string;
  rating: number;
  comment: string;
  is_verified: boolean;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface SubscriberStats {
  total: number;
  subscribers: Subscriber[];
  dailyStats: { _id: string; count: number }[];
  meta?: PageMeta;
}

export interface Company {
  name: string;
  img: string;
  url: string;
  industry: string;
  year: number;
}

export interface Client extends Entity {
  client_name: string;
  companies: Company[];
  client_emails: string[];
  client_phones: string[];
  is_active: boolean;
}

export interface Project extends Entity {
  project_name: string;
  project_image: string;
  short_description: string;
  project_url: string;
  client_id: string;
  work_id?: string | null;
  is_active: boolean;
  client?: { id: string; client_name: string } | null;
  work?: { id: string; title: string } | null;
}

export interface Work extends Entity {
  title: string;
  info: { heading: string; details: string; img: string }[];
  project_id?: string | null;
  is_active: boolean;
  project?: { id: string; project_name: string } | null;
}

export interface Blog extends Entity {
  blog_name: string;
  blog_images: string[];
  short_description: string;
  blog_descriptions: { heading?: string; content?: string; image?: string }[];
  is_active: boolean;
}

export interface Banner extends Entity {
  name: string;
  description: string;
  img: string;
  position: number;
  time: string;
  is_active: boolean;
}

export type InvoiceStatus = "draft" | "bill_generated" | "sent" | "paid" | "cancelled";

export interface Invoice extends Entity {
  invoiceNo: string;
  invoiceDate: string;
  dueDate?: string | null;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  items: { desc: string; qty: number; rate: number; amount: number }[];
  pageCount: number;
  subtotal: number;
  total: number;
  status: InvoiceStatus;
  billGeneratedAt?: string | null;
  sentAt?: string | null;
  sentBy: { email: boolean; whatsapp: boolean };
  notes: string;
}

export interface Voucher extends Entity {
  title: string;
  img: string[];
  heading: string[];
  msg: string[];
}

type Split<Y extends string, N extends string> = Record<Y | N | "total", number>;

export interface DashboardStats {
  banners: number;
  blogs: number;
  clients: number;
  works: number;
  projects: number;
  subscribers: number;
  reviews: Split<"verified", "unverified">;
  enquiries: Split<"opened", "unopened">;
  admins: Split<"superadmin", "admin">;
}

/** Folders the upload endpoint accepts (img/upload). */
export type UploadFolder = "uploads" | "admins" | "banners" | "blogs" | "clients" | "projects" | "works" | "vouchers" | "invoices";
