import React from 'react';
import { useAuthStore } from '@/store/auth-store';
import { User as UserIcon, Menu } from 'lucide-react';

interface NavbarProps {
  readonly onOpenMobileNav?: () => void;
}

export function Navbar({ onOpenMobileNav }: NavbarProps): React.ReactElement {
  const user = useAuthStore((state) => state.user);

  const displayName = user ? `${user.firstName} ${user.lastName ?? ''}`.trim() : 'Usuario';
  const email = user?.email ?? '';

  return (
    <header className="h-16 border-b border-border bg-card px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground hidden sm:inline">Bienvenido,</span>
          <span className="text-xs sm:text-sm font-semibold text-foreground truncate">{displayName}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
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
