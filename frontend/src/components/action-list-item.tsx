"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

interface ActionListItemProps {
  icon: LucideIcon
  title: string
  subtitle: string
  onClick?: () => void
}

export function ActionListItem({ icon: Icon, title, subtitle, onClick }: ActionListItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors text-left"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-0.5">{title}</h3>
        <p className="text-sm text-gray-600 text-pretty">{subtitle}</p>
      </div>

      {/* Chevron */}
      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </button>
  )
}
