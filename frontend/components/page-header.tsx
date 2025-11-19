import type React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold tracking-tight text-foreground">{title}</h1>
        {children}
      </div>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}
    </div>
  );
}

