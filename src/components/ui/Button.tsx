"use client";

import React from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
  icon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary hover:opacity-90 shadow-sm hover:shadow-md active:scale-[0.98]",
  secondary:
    "bg-secondary text-on-secondary hover:opacity-90 shadow-sm active:scale-[0.98]",
  outline:
    "bg-surface border border-outline-variant text-on-surface hover:bg-surface-container-high active:scale-[0.98]",
  ghost:
    "bg-transparent text-on-surface-variant hover:bg-surface-container-high active:scale-[0.98]",
  danger:
    "bg-error text-on-error hover:opacity-90 shadow-sm active:scale-[0.98]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-xs rounded-xl gap-1.5",
  lg: "px-8 py-3 text-xs rounded-xl gap-2",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  disabled = false,
  className = "",
  type = "button",
  icon,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center font-semibold transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {icon && <span className="w-4 h-4">{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
}
