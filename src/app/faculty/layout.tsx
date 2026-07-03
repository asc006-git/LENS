"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Sidebar, TopNav, Toast } from "@/components/layout";

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, notifications, dismissNotification } = useApp();

  return (
    <div className="font-body-md text-on-surface bg-background antialiased min-h-screen flex flex-col md:flex-row relative">
      <Sidebar
        role="faculty"
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 md:ml-72">
        <TopNav
          title="Faculty Workspace"
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          userName={user?.name || "P"}
        />

        <main className="flex-1 p-6 md:p-8 overflow-x-hidden max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {notifications.map((msg, idx) => (
        <Toast key={idx} message={msg} onDismiss={() => dismissNotification(idx)} />
      ))}
    </div>
  );
}
