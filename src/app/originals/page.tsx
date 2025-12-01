'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAllOriginalWorks } from '@/lib/store';
import { OriginalWork } from '@/lib/types';
import { CreateOriginalForm } from '@/components/original/create-original-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OriginalsPage() {
    const [works, setWorks] = useState<OriginalWork[]>([]);

    useEffect(() => {
        setWorks(getAllOriginalWorks());
    }, []);

    return (
        <div className="container mx-auto py-10 px-4">
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
                            <Card key={work.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">{work.title}</CardTitle>
                                            <CardDescription>{work.mediaType}</CardDescription>
                                        </div>
                                        {work.source === 'Custom' && (
                                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Custom</span>
                                        )}
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
