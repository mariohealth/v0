"use client"

import { useState } from "react"
import { Search, Home, Gift, User } from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = "search" | "health-hub" | "rewards" | "profile"

export function BottomNav() {
  const [active, setActive] = useState<NavItem>("search")

  const navItems = [
    { id: "search" as NavItem, icon: Search, label: "Search" },
    { id: "health-hub" as NavItem, icon: Home, label: "Health Hub" },
    { id: "rewards" as NavItem, icon: Gift, label: "Rewards" },
    { id: "profile" as NavItem, icon: User, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive ? "text-[#2E5077]" : "text-gray-500",
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
