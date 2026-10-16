import type { ServiceVisual as Kind } from "../../data/services";
import { BrowserFrame } from "./BrowserFrame";
import { DashboardMock } from "./DashboardMock";
import { AutomationMock, PhoneMock, SiteMock, StorefrontMock, WorkflowMock } from "./Mocks";

/** The illustrative interface that represents each service. */
export function ServiceVisual({ kind }: { kind: Kind }) {
  switch (kind) {
    case "site":
      return (
        <BrowserFrame url="yourcompany.com">
          <SiteMock />
        </BrowserFrame>
      );
    case "store":
      return (
        <BrowserFrame url="shop.yourbrand.in">
          <StorefrontMock />
        </BrowserFrame>
      );
    case "software":
      return (
        <BrowserFrame url="app.yourcompany.com/requests">
          <WorkflowMock />
        </BrowserFrame>
      );
    case "erp":
      return (
        <BrowserFrame url="erp.yourcompany.com">
          <DashboardMock />
        </BrowserFrame>
      );
    case "phone":
      return (
        <div className="flex justify-center py-6">
          <PhoneMock />
        </div>
      );
    case "automation":
      return (
        <div className="mx-auto max-w-md overflow-hidden rounded-[14px] border border-line shadow-window">
          <AutomationMock />
        </div>
      );
  }
}
