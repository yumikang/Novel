'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PromptGenerator } from '@/components/prompt/prompt-generator';
import { getProject } from '@/lib/store';
import { FanficProject } from '@/lib/types';
import { PRESET_ORIGINAL_WORKS } from '@/lib/constants';

export default function ProjectWorkspacePage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<FanficProject | null>(null);

    useEffect(() => {
        if (params.id) {
            const found = getProject(params.id as string);
            if (found) {
                setProject(found);
            } else {
                router.push('/');
            }
        }
    }, [params.id, router]);

    if (!project) return <div className="p-10 text-center">로딩 중...</div>;

    const originalWork = PRESET_ORIGINAL_WORKS.find(w => w.id === project.originalWorkId);

    return (
        <div className="container mx-auto py-6 px-4 h-screen flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">{project.title}</h1>
                        <p className="text-sm text-slate-500">
                            {originalWork?.title} | {project.timelineSetting}
                        </p>
                    </div>
                </div>
                <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" /> 설정
                </Button>
            </header>

            {/* Main Content */}
            <div className="flex-1 min-h-0">
                <PromptGenerator project={project} />
            </div>
        </div>
    );
}
