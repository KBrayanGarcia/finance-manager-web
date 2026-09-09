import React from 'react';
import { useAuthStore } from '@/store/auth-store';
import { User as UserIcon } from 'lucide-react';

export function Navbar(): React.ReactElement {
  const user = useAuthStore((state) => state.user);

  const displayName = user ? `${user.firstName} ${user.lastName ?? ''}`.trim() : 'Usuario';
  const email = user?.email ?? '';

  return (
    <header className="h-16 border-b border-border bg-card px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Bienvenido,</span>
        <span className="text-sm font-semibold text-foreground">{displayName}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-foreground m-0">{displayName}</p>
          <p className="text-xs text-muted-foreground m-0">{email}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground border border-border">
          <UserIcon className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
