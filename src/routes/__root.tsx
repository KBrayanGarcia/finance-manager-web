import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased font-sans">
      <Outlet />
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
}

