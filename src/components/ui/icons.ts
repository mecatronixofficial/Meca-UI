import {
  Blocks,
  Bot,
  Boxes,
  Briefcase,
  Code2,
  Factory,
  GraduationCap,
  Layers,
  LayoutDashboard,
  MessagesSquare,
  MonitorSmartphone,
  MousePointer2,
  Rocket,
  ShoppingBag,
  ShoppingCart,
  Shirt,
  Smartphone,
  Store,
  Target,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { IndustryIcon } from "../../data/industries";
import type { PrincipleGlyph } from "../../data/company";

export const serviceIcons: Record<string, LucideIcon> = {
  "web-development": MonitorSmartphone,
  "custom-software": Blocks,
  "mobile-app-development": Smartphone,
  "ecommerce-development": ShoppingCart,
  "erp-development": LayoutDashboard,
  "ai-automation": Bot,
};

export const industryIcons: Record<IndustryIcon, LucideIcon> = {
  textiles: Shirt,
  manufacturing: Factory,
  retail: Store,
  ecommerce: ShoppingBag,
  education: GraduationCap,
  logistics: Truck,
  services: Briefcase,
  startups: Rocket,
};

export const principleIcons: Record<PrincipleGlyph, LucideIcon> = {
  target: Target,
  layers: Layers,
  cursor: MousePointer2,
  code: Code2,
  chat: MessagesSquare,
  launch: Boxes,
};
