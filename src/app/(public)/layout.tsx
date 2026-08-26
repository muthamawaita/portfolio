import type { ReactNode } from "react";
import { MarketingFooter, MarketingHeader } from "@/modules/marketing";
export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) { return <><MarketingHeader />{children}<MarketingFooter /></>; }
