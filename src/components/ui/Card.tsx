import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-level-1 ${
        hover ? "hover:shadow-level-2 transition-shadow duration-300" : ""
      } ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
