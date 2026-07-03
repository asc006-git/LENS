"use client";

import React from "react";
import { Check } from "lucide-react";

interface Step {
  num: number;
  label: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (num: number) => void;
}

export function ProgressSteps({ steps, currentStep, onStepClick }: ProgressStepsProps) {
  const percentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative pt-4 pb-10">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-high -translate-y-1/2 z-0" />
      <div
        className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
      <div className="relative z-10 flex justify-between">
        {steps.map((step) => {
          const isActive = currentStep >= step.num;
          const isCurrent = currentStep === step.num;

          return (
            <button
              key={step.num}
              onClick={() => step.num < currentStep && onStepClick?.(step.num)}
              disabled={step.num > currentStep}
              className="flex flex-col items-center gap-2 group focus:outline-none"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                  isCurrent
                    ? "bg-primary text-on-primary ring-4 ring-primary-container/30 scale-110"
                    : isActive
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-highest text-on-surface-variant border border-outline-variant"
                }`}
              >
                {step.num < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.num
                )}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  isActive ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
