import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  readonly title: string;
  readonly description?: string;
  readonly actions?: React.ReactNode;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export function PageContainer({
  title,
  description,
  actions,
  children,
  className,
}: PageContainerProps): React.ReactElement {
  return (
    <div className={cn('p-8 space-y-6 max-w-7xl mx-auto w-full', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground m-0">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 m-0">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
