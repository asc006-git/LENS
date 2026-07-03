"use client";

import React from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({ label, value, icon, trend, className = "" }: StatCardProps) {
  return (
    <div
      className={`bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-level-1 flex items-center justify-between ${className}`}
    >
      <div>
        <p className="text-[10px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider font-label-sm">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-on-surface font-headline-md">{value}</p>
        {trend && (
          <p
            className={`text-xs font-semibold mt-1 flex items-center gap-0.5 ${
              trend.positive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
        {icon}
      </div>
    </div>
  );
}
