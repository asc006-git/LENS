"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export function Input({ label, icon, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-on-surface-variant font-label-sm">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-surface border border-outline-variant rounded-xl ${
            icon ? "pl-10" : "px-4"
          } pr-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-on-surface placeholder:text-outline ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-error font-semibold">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = "", ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-on-surface-variant font-label-sm">
          {label}
        </label>
      )}
      <textarea
        className={`w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-on-surface placeholder:text-outline resize-none ${className}`}
        {...props}
      />
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-on-surface-variant font-label-sm">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
