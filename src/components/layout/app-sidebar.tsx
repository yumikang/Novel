'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, Settings, BookOpen, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
// import { getProjects } from '@/lib/store'; // Removed
import { FanficProject } from '@/lib/types';

interface AppSidebarProps {
    className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
    const pathname = usePathname();
    const [projects, setProjects] = useState<FanficProject[]>([]);
    // Simple way to refresh projects list. In a real app, use a proper store subscription or context.
    // For now, we'll just fetch on mount and rely on page navigation to refresh.
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects');
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                }
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        };

        fetchProjects();

        // Listen for custom event to refresh sidebar
        const handleRefresh = fetchProjects;
        window.addEventListener('project-updated', handleRefresh);
        return () => window.removeEventListener('project-updated', handleRefresh);
    }, []);

    return (
        <div className={`w-64 border-r bg-slate-50/50 h-screen flex flex-col ${className || 'fixed left-0 top-0'}`}>
            <div className="p-6">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                    NovelMind
                </h1>
            </div>

            <div className="px-4 mb-4">
                <Link href="/projects/new">
                    <Button className="w-full justify-start" size="sm">
                        <Plus className="mr-2 h-4 w-4" /> 새 프로젝트
                    </Button>
                </Link>
            </div>

            <ScrollArea className="flex-1 px-4">
                <div className="space-y-4">
                    <div className="py-2">
                        <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-slate-500">
                            메뉴
                        </h2>
                        <div className="space-y-1">
                            <Link href="/">
                                <Button variant={pathname === '/' ? 'secondary' : 'ghost'} size="sm" className="w-full justify-start">
                                    <Home className="mr-2 h-4 w-4" /> 홈
                                </Button>
                            </Link>
                            <Link href="/originals">
                                <Button variant={pathname.startsWith('/originals') ? 'secondary' : 'ghost'} size="sm" className="w-full justify-start">
                                    <Library className="mr-2 h-4 w-4" /> 원작 관리
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <Separator />

                    <div className="py-2">
                        <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-slate-500">
                            최근 프로젝트
                        </h2>
                        <div className="space-y-1">
                            {projects.length === 0 ? (
                                <div className="px-2 text-xs text-slate-400">프로젝트가 없습니다.</div>
                            ) : (
                                projects.slice(0, 10).map((project) => (
                                    <Link key={project.id} href={`/projects/${project.id}`}>
                                        <Button
                                            variant={pathname === `/projects/${project.id}` ? 'secondary' : 'ghost'}
                                            size="sm"
                                            className="w-full justify-start truncate"
                                        >
                                            <span className="truncate">{project.title}</span>
                                        </Button>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </ScrollArea>

            <div className="p-4 border-t">
                <Button variant="ghost" size="sm" className="w-full justify-start text-slate-500">
                    <Settings className="mr-2 h-4 w-4" /> 설정
                </Button>
            </div>
        </div>
    );
}
