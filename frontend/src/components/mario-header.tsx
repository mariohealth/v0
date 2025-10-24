"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function MarioHeader() {
  const [selectedDemo, setSelectedDemo] = useState("Demo")

  const demoOptions = ["Returning User", "Landing", "Login", "Sign Up", "MarioCare", "Ask AI"]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#2E5077] flex items-center justify-center">
            <span className="text-white font-semibold text-sm">m</span>
          </div>
          <span className="text-[#2E5077] font-semibold text-lg">mario</span>
        </div>

        {/* Right: Demo Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger 
            className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md px-2 py-1"
            aria-label="Select demo mode"
          >
            {selectedDemo}
            <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {demoOptions.map((option) => (
              <DropdownMenuItem key={option} onClick={() => setSelectedDemo(option)} className="cursor-pointer">
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
