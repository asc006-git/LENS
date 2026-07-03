"use client";

import React from "react";
import { Menu, Search, Bell, BellDot, Sparkles } from "lucide-react";

interface TopNavProps {
  title?: string;
  onMenuToggle: () => void;
  onAiMentorToggle?: () => void;
  showAiMentor?: boolean;
  userAvatar?: string;
  userName?: string;
}

export function TopNav({
  title,
  onMenuToggle,
  onAiMentorToggle,
  showAiMentor = false,
  userAvatar,
  userName,
}: TopNavProps) {
  return (
    <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-30 w-full border-b border-outline-variant shadow-sm flex justify-between items-center h-16 px-6 md:px-8">
      <div className="flex-1 flex items-center">
        <button
          onClick={onMenuToggle}
          className="md:hidden mr-4 text-on-surface hover:text-primary transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {title && (
          <h2 className="text-lg font-bold text-on-surface font-headline-sm hidden md:block">
            {title}
          </h2>
        )}

        <div className="relative w-full max-w-md hidden md:block ml-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-high border-transparent focus:border-primary focus:bg-white rounded-full text-xs text-on-surface transition-all outline-none"
            placeholder="Search courses, concepts, or ask AI..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full" />
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
          <BellDot className="w-5 h-5" />
        </button>

        {onAiMentorToggle && (
          <button
            onClick={onAiMentorToggle}
            className="flex items-center gap-2 ml-2 px-4 py-2 bg-tertiary-container text-on-tertiary-container rounded-full hover:bg-tertiary-container/80 transition-colors font-semibold text-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Mentor</span>
          </button>
        )}

        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm ml-1">
          {userName?.charAt(0) || "A"}
        </div>
      </div>
    </header>
  );
}
