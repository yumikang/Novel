'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { getAllOriginalWorks, deleteOriginalWork } from '@/lib/store'; // Removed
import { OriginalWork } from '@/lib/types';
import { CreateOriginalForm } from '@/components/original/create-original-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OriginalsPage() {
    const [works, setWorks] = useState<OriginalWork[]>([]);

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                const res = await fetch('/api/originals');
                if (res.ok) {
                    const data = await res.json();
                    setWorks(data);
                }
            } catch (error) {
                console.error('Failed to fetch works:', error);
            }
        };

        fetchWorks();

        // Listen for updates to refresh list
        window.addEventListener('original-work-updated', fetchWorks);
        return () => window.removeEventListener('original-work-updated', fetchWorks);
    }, []);

    return (
        <div className="w-full py-10 px-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">원작 관리</h1>
                    <p className="text-slate-500 mt-2">프리셋 원작을 확인하거나 나만의 원작을 등록하세요.</p>
                </div>
            </header>

            <Tabs defaultValue="list" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="list">목록 보기</TabsTrigger>
                    <TabsTrigger value="new">새 원작 등록</TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {works.map((work) => (
                            <div key={work.id} className="relative group">
                                <Link href={`/originals/${work.id}`}>
                                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg">{work.title}</CardTitle>
                                                    <CardDescription>{work.mediaType}</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-sm text-slate-600">
                                                <p>등록된 캐릭터: {work.canonCharacters.length}명</p>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {work.canonCharacters.slice(0, 3).map(c => (
                                                        <span key={c.id} className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{c.name}</span>
                                                    ))}
                                                    {work.canonCharacters.length > 3 && <span className="text-xs text-slate-400">...</span>}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                                {work.source === 'Custom' && (
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (confirm('정말 이 원작을 삭제하시겠습니까?')) {
                                                try {
                                                    const res = await fetch(`/api/originals/${work.id}`, {
                                                        method: 'DELETE',
                                                    });
                                                    if (res.ok) {
                                                        window.dispatchEvent(new Event('original-work-updated'));
                                                    } else {
                                                        alert('삭제에 실패했습니다.');
                                                    }
                                                } catch (e) {
                                                    console.error(e);
                                                    alert('삭제 중 오류가 발생했습니다.');
                                                }
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="new">
                    <CreateOriginalForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}
