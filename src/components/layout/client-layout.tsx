'use client';

import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname.startsWith('/auth');
    const [open, setOpen] = useState(false);

    if (isAuthPage) {
        return <main className="min-h-screen bg-white">{children}</main>;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <AppSidebar />
            </div>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center p-4 border-b bg-white sticky top-0 z-50">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <AppSidebar className="relative h-full border-none" />
                    </SheetContent>
                </Sheet>
                <div className="ml-4 font-bold text-lg">NovelMind</div>
            </div>

            {/* Main Content */}
            <main className="md:pl-64 min-h-screen">
                {children}
            </main>
        </div>
    );
}
