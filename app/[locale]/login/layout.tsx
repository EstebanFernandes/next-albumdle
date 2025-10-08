// app/admin/login/layout.tsx
import { ReactNode } from "react";

export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>; // no header
}

