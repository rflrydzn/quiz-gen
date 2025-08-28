"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { User } from "@supabase/supabase-js";

interface AppLayoutProps {
  children: React.ReactNode;
  user: User | null;
}

export function AppLayout({ children, user }: AppLayoutProps) {
  // Simple conditional rendering based on the user prop from server
  if (user) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">{children}</main>
      </SidebarProvider>
    );
  }

  return <main className="w-full">{children}</main>;
}
