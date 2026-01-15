'use client';

import * as React from 'react';

import { Card } from '@/components/ui/card';
import { MarioPickBadge } from '@/components/ui/mario-badges';
import { cn } from '@/components/ui/utils';

type CardHeader = {
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
};

interface ResultCardShellProps {
  header: CardHeader;
  metadata?: React.ReactNode;
  highlights?: React.ReactNode;
  body?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  mariosPick?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ResultCardShell({
  header,
  metadata,
  highlights,
  body,
  actions,
  children,
  mariosPick = false,
  className,
  onClick,
}: ResultCardShellProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-200 hover:shadow-md border-0 shadow-sm p-5',
        onClick && 'cursor-pointer',
        mariosPick && 'ring-1 ring-[#79D7BE]/30',
        className
      )}
      onClick={onClick}
    >
      {mariosPick && (
        <div className="absolute top-4 left-4 z-10">
          <MarioPickBadge />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start gap-3">
          <div className={cn('flex-1 min-w-0', mariosPick && 'mt-8')}>
            <h3 className={cn('text-xl font-bold text-[#2E5077] truncate', header.titleClassName)}>
              {header.title}
            </h3>
            {header.subtitle && (
              <p
                className={cn(
                  'text-[#4DA1A9] font-medium text-sm truncate',
                  header.subtitleClassName
                )}
              >
                {header.subtitle}
              </p>
            )}
          </div>

          {header.rightContent && (
            <div className="text-right flex flex-col items-end gap-1">
              {header.rightContent}
            </div>
          )}
        </div>

        {metadata && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
            {metadata}
          </div>
        )}

        {highlights && <div className="flex items-center justify-between">{highlights}</div>}

        {body}

        {actions && <div className="pt-4 border-t border-gray-100">{actions}</div>}

        {children}
      </div>
    </Card>
  );
}
