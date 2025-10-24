"use client"

import { Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSearch() {
  return (
    <section className="pt-20 pb-8 px-4">
      <div className="max-w-md mx-auto space-y-6 sm:max-w-lg md:max-w-2xl">
        {/* Headline */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 text-balance sm:text-4xl md:text-5xl">Know what care costs. Choose smart.</h1>
          <p className="text-lg text-gray-700 sm:text-xl">Save with Mario.</p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search services, doctors, or meds..."
            className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-gray-300 focus:border-[#4DA1A9] focus:outline-none text-base sm:h-16 sm:text-lg"
          />
        </div>

        {/* Ask MarioAI Button */}
        <Button
          variant="outline"
          className="w-full h-12 border-2 border-[#4DA1A9] text-[#4DA1A9] hover:bg-[#4DA1A9]/5 rounded-xl font-medium bg-transparent sm:h-14 sm:text-lg"
        >
          <Sparkles className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
          Ask MarioAI
          <Sparkles className="w-4 h-4 ml-2 sm:w-5 sm:h-5" />
        </Button>
      </div>
    </section>
  )
}
