"use client";

import React from "react";
import { CircleCheck, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onDismiss: () => void;
}

export function Toast({ message, type = "success", onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-on-background text-background border border-outline-variant/30 rounded-xl px-5 py-3 shadow-level-2 animate-slide-in flex items-center gap-2 text-xs font-semibold max-w-sm">
      <CircleCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} className="flex-shrink-0 hover:opacity-70">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
