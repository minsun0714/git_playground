import * as React from "react";

import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentProps<"div"> {
  value?: number;
}

export function Progress({ value = 0, className, ...props }: ProgressProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const indicatorWidth =
    normalizedValue > 0 ? `${Math.max(normalizedValue, 2)}%` : "0%";

  return (
    <div
      data-slot="progress"
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full border border-primary/20 bg-primary/10",
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(normalizedValue)}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className="h-full rounded-full bg-primary transition-all duration-300"
        style={{ width: indicatorWidth }}
      />
    </div>
  );
}
