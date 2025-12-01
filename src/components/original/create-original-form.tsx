'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { saveOriginalWork } from '@/lib/store';
import { Character, MediaType, OriginalWork } from '@/lib/types';

export function CreateOriginalForm() {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [mediaType, setMediaType] = useState<MediaType>('Other');
    const [characters, setCharacters] = useState<Character[]>([]);

    // Temp state for new character input
    const [newCharName, setNewCharName] = useState('');
    const [newCharPersonality, setNewCharPersonality] = useState('');

    const addCharacter = () => {
        if (!newCharName) return;

        const newChar: Character = {
            id: crypto.randomUUID(),
            name: newCharName,
            isCanon: true,
            personality: newCharPersonality.split(',').map(s => s.trim()).filter(Boolean),
            speechPatterns: [],
            relationships: []
        };

        setCharacters([...characters, newChar]);
        setNewCharName('');
        setNewCharPersonality('');
    };

    const removeCharacter = (id: string) => {
        setCharacters(characters.filter(c => c.id !== id));
    };

    const handleSave = () => {
        if (!title) return;

        const newWork: OriginalWork = {
            id: crypto.randomUUID(),
            title,
            mediaType,
            canonCharacters: characters,
            worldRules: [], // TODO: Add world rules input
            source: 'Custom'
        };

        saveOriginalWork(newWork);
        router.push('/originals');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>새 원작 등록</CardTitle>
                    <CardDescription>나만의 원작 세계관과 캐릭터를 등록하세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    <div className="space-y-2">
                        <Label htmlFor="title">원작 제목</Label>
                        <Input
                            id="title"
                            placeholder="예: 나만의 판타지 세계"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mediaType">매체 유형</Label>
                        <Select onValueChange={(val) => setMediaType(val as MediaType)} defaultValue="Other">
                            <SelectTrigger>
                                <SelectValue placeholder="유형 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Novel">소설</SelectItem>
                                <SelectItem value="Webtoon">웹툰</SelectItem>
                                <SelectItem value="Game">게임</SelectItem>
                                <SelectItem value="Anime">애니메이션</SelectItem>
                                <SelectItem value="Drama">드라마</SelectItem>
                                <SelectItem value="Idol">아이돌</SelectItem>
                                <SelectItem value="Other">기타</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4 border rounded-md p-4 bg-slate-50">
                        <div className="flex justify-between items-center">
                            <Label>캐릭터 목록 ({characters.length})</Label>
                        </div>

                        <div className="grid gap-4">
                            <div className="flex gap-2 items-end">
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor="charName" className="text-xs">이름</Label>
                                    <Input
                                        id="charName"
                                        value={newCharName}
                                        onChange={(e) => setNewCharName(e.target.value)}
                                        placeholder="캐릭터 이름"
                                    />
                                </div>
                                <div className="flex-[2] space-y-2">
                                    <Label htmlFor="charPers" className="text-xs">성격 (쉼표 구분)</Label>
                                    <Input
                                        id="charPers"
                                        value={newCharPersonality}
                                        onChange={(e) => setNewCharPersonality(e.target.value)}
                                        placeholder="예: 냉철함, 다정함"
                                        onKeyDown={(e) => e.key === 'Enter' && addCharacter()}
                                    />
                                </div>
                                <Button onClick={addCharacter} size="icon" variant="secondary">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {characters.map((char) => (
                                    <div key={char.id} className="flex justify-between items-center bg-white p-2 rounded border text-sm">
                                        <div>
                                            <span className="font-medium mr-2">{char.name}</span>
                                            <span className="text-slate-500 text-xs">{char.personality.join(', ')}</span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => removeCharacter(char.id)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleSave} disabled={!title}>
                        원작 등록
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
