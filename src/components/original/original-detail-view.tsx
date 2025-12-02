'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OriginalWork, Character, WorldRule } from '@/lib/types';
// import { saveOriginalWork } from '@/lib/store'; // Removed
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Globe } from 'lucide-react';
import { CharacterListItem } from '@/components/original/character-list-item';
import { SmartCharacterAdd } from '@/components/original/smart-character-add';
import { BulkCharacterImport } from '@/components/original/bulk-character-import';
import { WorldRulesManager } from '@/components/original/world-rules-manager';
import { Badge } from '@/components/ui/badge';

interface OriginalDetailViewProps {
    work: OriginalWork;
}

export function OriginalDetailView({ work: initialWork }: OriginalDetailViewProps) {
    const router = useRouter();
    const [work, setWork] = useState<OriginalWork>(initialWork);
    const [activeTab, setActiveTab] = useState('characters');

    // Update local state if prop changes (though usually it won't in this flow)
    useEffect(() => {
        setWork(initialWork);
    }, [initialWork]);

    const handleSave = async (updatedWork: OriginalWork) => {
        try {
            const res = await fetch(`/api/originals/${updatedWork.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedWork),
            });

            if (res.ok) {
                const savedWork = await res.json();
                setWork(savedWork);
            } else {
                alert('저장에 실패했습니다.');
            }
        } catch (e) {
            console.error(e);
            alert('오류가 발생했습니다.');
        }
    };

    const updateCharacters = (newCharacters: Character[]) => {
        const updatedWork = { ...work, canonCharacters: newCharacters };
        handleSave(updatedWork);
    };

    const updateWorldRules = (newRules: WorldRule[]) => {
        const updatedWork = { ...work, worldRules: newRules };
        handleSave(updatedWork);
    };

    // Character Actions
    const addCharacter = (char: Character) => {
        updateCharacters([...work.canonCharacters, char]);
    };

    const addBulkCharacters = (chars: Character[]) => {
        updateCharacters([...work.canonCharacters, ...chars]);
    };

    const updateCharacter = (updatedChar: Character) => {
        updateCharacters(work.canonCharacters.map(c => c.id === updatedChar.id ? updatedChar : c));
    };

    const removeCharacter = (id: string) => {
        if (confirm('정말 이 캐릭터를 삭제하시겠습니까?')) {
            updateCharacters(work.canonCharacters.filter(c => c.id !== id));
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-8 px-6">
            <div className="mb-6">
                <Button variant="ghost" className="pl-0 hover:pl-2 transition-all" onClick={() => router.push('/originals')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> 목록으로 돌아가기
                </Button>
            </div>

            <header className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-slate-900">{work.title}</h1>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                    <span className="font-medium">{work.mediaType}</span>
                    <span>•</span>
                    <span>캐릭터 {work.canonCharacters.length}명</span>
                    <span>•</span>
                    <span>설정 {work.worldRules.length}개</span>
                </div>
            </header>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="characters" className="flex items-center gap-2">
                        <Users className="h-4 w-4" /> 캐릭터 관리
                    </TabsTrigger>
                    <TabsTrigger value="world" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" /> 세계관 설정
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="characters" className="space-y-6">
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border">
                        <div>
                            <h3 className="font-semibold text-slate-900">캐릭터 목록</h3>
                            <p className="text-sm text-slate-500">원작에 등장하는 주요 인물과 주변 인물을 관리합니다.</p>
                        </div>
                        <div className="flex gap-2">
                            <BulkCharacterImport onImport={addBulkCharacters} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <SmartCharacterAdd onAdd={addCharacter} />

                        <div className="space-y-2 mt-4">
                            {work.canonCharacters.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 border-2 border-dashed rounded-lg">
                                    등록된 캐릭터가 없습니다. 위 버튼을 눌러 추가해보세요.
                                </div>
                            ) : (
                                work.canonCharacters.map((char) => (
                                    <CharacterListItem
                                        key={char.id}
                                        character={char}
                                        onRemove={() => removeCharacter(char.id)}
                                        onUpdate={updateCharacter}
                                        readOnly={work.source === 'Preset'} // Presets might be read-only? For now assume editable or check source
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="world" className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-lg border mb-6">
                        <h3 className="font-semibold text-slate-900">세계관 설정 (Lore)</h3>
                        <p className="text-sm text-slate-500">마법 체계, 지리, 역사, 종족 등 원작의 중요한 설정을 기록합니다.</p>
                    </div>

                    <WorldRulesManager
                        rules={work.worldRules}
                        onUpdate={updateWorldRules}
                        readOnly={work.source === 'Preset'}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
