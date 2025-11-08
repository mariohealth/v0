import * as React from "react";
import { cn } from "./utils";

/**
 * VisuallyHidden component for accessibility
 * Hides content visually but keeps it accessible to screen readers
 */
export function VisuallyHidden({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
        className
      )}
      style={{
        clip: "rect(0, 0, 0, 0)",
        clipPath: "inset(50%)"
      }}
      {...props}
    />
  );
}
