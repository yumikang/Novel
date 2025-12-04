'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Settings, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PromptGenerator } from '@/components/prompt/prompt-generator';
import { EpisodeList } from '@/components/episode/episode-list';
import { EpisodeBoard } from '@/components/episode/episode-board';
import { ProjectSettingsDialog } from '@/components/project/project-settings-dialog';
import { FanficProject, Episode } from '@/lib/types';

export default function ProjectWorkspacePage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<FanficProject | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);

    const fetchProject = async () => {
        if (params.id) {
            try {
                const res = await fetch(`/api/projects/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProject(data);
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error('Failed to fetch project:', error);
                router.push('/');
            }
        }
    };

    const fetchEpisodes = async () => {
        if (params.id) {
            try {
                const res = await fetch(`/api/episodes?projectId=${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setEpisodes(data);
                    // Select first episode if none selected and episodes exist
                    if (!selectedEpisodeId && data.length > 0) {
                        setSelectedEpisodeId(data[0].id);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch episodes:', error);
            }
        }
    };

    useEffect(() => {
        fetchProject();
        fetchEpisodes();
    }, [params.id, router]);

    if (!project) return <div className="p-10 text-center">로딩 중...</div>;

    const originalWorkTitle = project.originalWork?.title || project.originalWorkId;
    const selectedEpisode = episodes.find(e => e.id === selectedEpisodeId);

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
                            {originalWorkTitle} | {project.timelineSetting}
                        </p>
                    </div>
                </div>
                <ProjectSettingsDialog project={project} onUpdate={fetchProject} />
            </header>

            {/* Main Content */}
            <div className="flex-1 min-h-0">
                <Tabs defaultValue="episodes" className="h-full flex flex-col">
                    <TabsList className="w-fit mb-4">
                        <TabsTrigger value="episodes">
                            <BookOpen className="mr-2 h-4 w-4" /> 에피소드 관리
                        </TabsTrigger>
                        <TabsTrigger value="prompt">
                            <Sparkles className="mr-2 h-4 w-4" /> 프롬프트 생성
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="episodes" className="flex-1 min-h-0 border rounded-lg overflow-hidden flex">
                        <EpisodeList
                            projectId={project.id}
                            episodes={episodes}
                            selectedEpisodeId={selectedEpisodeId}
                            onSelectEpisode={setSelectedEpisodeId}
                            onUpdateList={fetchEpisodes}
                        />
                        <div className="flex-1 bg-slate-50/50">
                            {selectedEpisode ? (
                                <EpisodeBoard
                                    episode={selectedEpisode}
                                    onUpdateEpisode={fetchEpisodes}
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400">
                                    에피소드를 선택하거나 새로 만드세요
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="prompt" className="flex-1 min-h-0">
                        <PromptGenerator project={project} episodes={episodes} onProjectUpdate={fetchProject} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
