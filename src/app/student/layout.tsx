"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Sidebar, TopNav, AiMentorDrawer, Toast } from "@/components/layout";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const { user, notifications, dismissNotification } = useApp();

  return (
    <div className="font-body-md text-on-surface bg-background antialiased min-h-screen flex flex-col md:flex-row relative">
      <Sidebar
        role="student"
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 md:ml-72 ${
          isMentorOpen ? "2xl:mr-80" : "mr-0"
        }`}
      >
        <TopNav
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onAiMentorToggle={() => setIsMentorOpen(!isMentorOpen)}
          showAiMentor
          userName={user?.name || "A"}
        />

        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>

      <AiMentorDrawer isOpen={isMentorOpen} onClose={() => setIsMentorOpen(false)} />

      {notifications.map((msg, idx) => (
        <Toast key={idx} message={msg} onDismiss={() => dismissNotification(idx)} />
      ))}
    </div>
  );
}
