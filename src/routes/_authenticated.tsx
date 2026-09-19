import { useState } from "react";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth-store";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

export const Route = createFileRoute("/_authenticated")({
    beforeLoad: async ({ location }) => {
        const token = useAuthStore.getState().token;
        if (!token) {
            throw redirect({
                to: "/login",
                search: {
                    redirect: location.href,
                },
            });
        }
    },
    component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar isMobileOpen={isMobileNavOpen} onCloseMobile={() => setIsMobileNavOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <Navbar onOpenMobileNav={() => setIsMobileNavOpen(true)} />
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
