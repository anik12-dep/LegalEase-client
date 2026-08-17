"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";
import type { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
