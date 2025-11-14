"use client";

import React, { useEffect, useState } from "react";

interface BannerProps {
  source: "api" | "mock";
}

export function DataSourceBanner({ source }: BannerProps) {
  const [visible, setVisible] = useState(process.env.NODE_ENV === "development");

  if (!visible) return null;

  const bg = source === "api" ? "bg-green-600" : "bg-amber-600";
  const text = source === "api" ? "LIVE API DATA" : "MOCK DATA (Fallback)";

  return (
    <div
      className={`fixed bottom-2 right-2 z-50 px-3 py-1 text-xs font-semibold text-white rounded-full shadow-lg ${bg}`}
    >
      {text}
    </div>
  );
}

