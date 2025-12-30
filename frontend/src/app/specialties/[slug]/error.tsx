"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

function messageFor(errorMessage: string) {
  const msg = errorMessage.toLowerCase();
  if (msg.includes("specialty not found")) {
    return "Specialty not found. Please try another specialty.";
  }
  if (msg.includes("zip") && msg.includes("invalid")) {
    return "Invalid ZIP code. Please check the ZIP and try again.";
  }
  return "We couldn’t load providers right now. Please try again.";
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Specialty providers page error:", error);
  }, [error]);

  const friendly = messageFor(error.message || "");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full space-y-4 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Specialty providers unavailable
        </h1>
        <p className="text-sm text-muted-foreground">{friendly}</p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 mario-transition"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-md border text-sm text-foreground hover:bg-accent mario-transition"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}

