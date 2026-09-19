import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Wallet,
  Tags,
  ArrowLeftRight,
  UserCheck,
  LogOut,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

interface NavItem {
  readonly label: string;
  readonly to: string;
  readonly icon: React.ElementType;
}

interface SidebarProps {
  readonly isMobileOpen?: boolean;
  readonly onCloseMobile?: () => void;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Cuentas', to: '/accounts', icon: Wallet },
  { label: 'Categorías', to: '/categories', icon: Tags },
  { label: 'Transacciones', to: '/transactions', icon: ArrowLeftRight },
  { label: 'Perfil', to: '/profile', icon: UserCheck },
] as const;

export function Sidebar({ isMobileOpen = false, onCloseMobile }: SidebarProps): React.ReactElement {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const logout = useAuthStore((state) => state.logout);

  const handleLinkClick = () => {
    onCloseMobile?.();
  };

  const handleLogout = () => {
    onCloseMobile?.();
    logout();
  };

  const renderContent = (isMobile: boolean) => (
    <>
      <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm">
            W
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight m-0">Wallet Manager</h1>
            <p className="text-xs text-muted-foreground m-0">Finanzas Personales</p>
          </div>
        </div>

        {isMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors md:hidden"
            aria-label="Cerrar navegación"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={handleLinkClick}
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

      <div className="p-4 border-t border-border mt-auto">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Sidebar de escritorio para pantallas md en adelante */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0 flex-shrink-0">
        {renderContent(false)}
      </aside>

      {/* Overlay oscuro para pantallas móviles */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Drawer deslizable para dispositivos móviles */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-card border-r border-border flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out md:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {renderContent(true)}
      </aside>
    </>
  );
}
