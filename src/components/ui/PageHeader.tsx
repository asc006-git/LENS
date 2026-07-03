"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  aiAssist?: boolean;
  onAiAssist?: () => void;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  aiAssist = false,
  onAiAssist,
}: PageHeaderProps) {
  return (
    <div className="space-y-4 mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant font-semibold">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-outline" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-primary transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-primary">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-on-surface font-headline-lg leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-on-surface-variant font-body-sm max-w-2xl">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {actions}
          {aiAssist && (
            <button
              onClick={onAiAssist}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-tertiary-container/10 text-tertiary hover:bg-tertiary-container/20 rounded-xl font-semibold text-xs transition-colors border border-tertiary-container/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Assist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
