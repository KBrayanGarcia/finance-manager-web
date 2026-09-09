import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Wallet,
  Tags,
  ArrowLeftRight,
  UserCheck,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

interface NavItem {
  readonly label: string;
  readonly to: string;
  readonly icon: React.ElementType;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Cuentas', to: '/accounts', icon: Wallet },
  { label: 'Categorías', to: '/categories', icon: Tags },
  { label: 'Transacciones', to: '/transactions', icon: ArrowLeftRight },
  { label: 'Perfil', to: '/profile', icon: UserCheck },
] as const;

export function Sidebar(): React.ReactElement {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm">
          W
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground leading-tight m-0">Wallet Manager</h1>
          <p className="text-xs text-muted-foreground m-0">Finanzas Personales</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
