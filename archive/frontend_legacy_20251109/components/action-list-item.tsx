"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"

interface ActionListItemProps {
  icon: LucideIcon | string
  title: string
  description: string
  href?: string
  onClick?: () => void
}

export function ActionListItem({ icon: Icon, title, description, href, onClick }: ActionListItemProps) {
  const handleClick = () => {
    if (href) {
      // Navigation will be handled by Link
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  const content = (
    <div className="w-full flex items-center gap-4 p-4 min-h-[44px] hover:bg-gray-50 active:bg-gray-100 active:scale-[0.98] rounded-lg transition-all duration-150 text-left">
      {/* Icon */}
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
        {typeof Icon === 'string' ? (
          <span className="text-lg">{Icon}</span>
        ) : (
          <Icon className="w-5 h-5 text-gray-600" />
        )}
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-0.5">{title}</h3>
        <p className="text-sm text-gray-600 text-pretty">{description}</p>
      </div>

      {/* Chevron */}
      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={handleClick}>
      {content}
    </button>
  );
}
