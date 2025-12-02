'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { getAllOriginalWorks } from '@/lib/store'; // Removed
import { saveProject } from '@/lib/store';
import { FanficProject, OriginalWork, ToneProfile } from '@/lib/types';

export function CreateProjectForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [availableWorks, setAvailableWorks] = useState<OriginalWork[]>([]);

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                const res = await fetch('/api/originals');
                if (res.ok) {
                    const data = await res.json();
                    setAvailableWorks(data);
                }
            } catch (error) {
                console.error('Failed to fetch works:', error);
            }
        };
        fetchWorks();
    }, []);

    // Form State
    const [originalWorkId, setOriginalWorkId] = useState('');
    const [title, setTitle] = useState('');
    const [timeline, setTimeline] = useState('');
    const [auSettings, setAuSettings] = useState('');
    const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);

    const selectedWork = availableWorks.find(w => w.id === originalWorkId);

    const handleCreate = () => {
        if (!title || !originalWorkId) return;

        const newProject: FanficProject = {
            id: crypto.randomUUID(),
            title,
            originalWorkId,
            timelineSetting: timeline,
            auSettings: auSettings.split(',').map(s => s.trim()).filter(Boolean),
            activeCharacterIds: selectedCharacters,
            customCharacters: [],
            foreshadows: [],
            tone: {
                writingStyle: 'Normal',
                atmosphere: 'Normal',
                pacing: 'Normal',
                dialogueRatio: 50,
                rating: 'All'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        saveProject(newProject);
        router.push(`/projects/${newProject.id}`);
    };

    const toggleCharacter = (id: string) => {
        setSelectedCharacters(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>새 프로젝트 생성</CardTitle>
                    <CardDescription>2차 창작을 위한 기본 설정을 입력해주세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Step 1: Basic Info */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="originalWork">원작 선택</Label>
                            <Select onValueChange={(val) => {
                                setOriginalWorkId(val);
                                setSelectedCharacters([]); // Reset characters when work changes
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="원작을 선택해주세요" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableWorks.map((work) => (
                                        <SelectItem key={work.id} value={work.id}>
                                            [{work.mediaType}] {work.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">프로젝트 제목</Label>
                            <Input
                                id="title"
                                placeholder="예: [귀멸] 현대 AU - 카페 알바생 탄지로"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Step 2: Settings (Only show if work selected) */}
                    {selectedWork && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="timeline">시점 / 타임라인</Label>
                                <Input
                                    id="timeline"
                                    placeholder="예: 무한열차 편 직후, 엔딩 3년 후"
                                    value={timeline}
                                    onChange={(e) => setTimeline(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="au">AU 설정 (쉼표로 구분)</Label>
                                <Input
                                    id="au"
                                    placeholder="예: 현대물, 학원물, 오메가버스"
                                    value={auSettings}
                                    onChange={(e) => setAuSettings(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>등장 캐릭터 선택</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {selectedWork.canonCharacters.map((char) => (
                                        <div
                                            key={char.id}
                                            className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedCharacters.includes(char.id)
                                                ? 'bg-slate-900 text-white border-slate-900'
                                                : 'bg-white hover:bg-slate-50'
                                                }`}
                                            onClick={() => toggleCharacter(char.id)}
                                        >
                                            <div className="font-medium">{char.name}</div>
                                            <div className="text-xs opacity-70">{char.personality.slice(0, 2).join(', ')}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleCreate} disabled={!title || !originalWorkId}>
                        프로젝트 생성
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
