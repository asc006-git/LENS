import React from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  color = "bg-primary",
  size = "md",
  showLabel = false,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={`w-full bg-surface-container-high rounded-full overflow-hidden ${
          size === "sm" ? "h-1.5" : "h-2"
        }`}
      >
        <div
          className={`${color} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
