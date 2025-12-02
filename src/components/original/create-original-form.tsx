'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { saveOriginalWork } from '@/lib/store';
import { Character, MediaType, OriginalWork } from '@/lib/types';

import { BulkCharacterImport } from '@/components/original/bulk-character-import';
import { SmartCharacterAdd } from '@/components/original/smart-character-add';
import { CharacterListItem } from '@/components/original/character-list-item';

export function CreateOriginalForm() {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [mediaType, setMediaType] = useState<MediaType>('Other');
    const [characters, setCharacters] = useState<Character[]>([]);

    const handleBulkImport = (newChars: Character[]) => {
        setCharacters(prev => [...prev, ...newChars]);
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
        alert('원작이 성공적으로 등록되었습니다.');
        router.push('/originals');
    };

    const updateCharacter = (updatedChar: Character) => {
        setCharacters(characters.map(c => c.id === updatedChar.id ? updatedChar : c));
    };

    return (
        <div className="w-full">
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
                        <Label>매체 유형</Label>
                        <div className="flex flex-wrap gap-2">
                            {(['Novel', 'Webtoon', 'Game', 'Anime', 'Drama', 'Idol', 'Other'] as MediaType[]).map((type) => (
                                <Button
                                    key={type}
                                    type="button"
                                    variant={mediaType === type ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setMediaType(type)}
                                >
                                    {type === 'Novel' && '소설'}
                                    {type === 'Webtoon' && '웹툰'}
                                    {type === 'Game' && '게임'}
                                    {type === 'Anime' && '애니메이션'}
                                    {type === 'Drama' && '드라마'}
                                    {type === 'Idol' && '아이돌'}
                                    {type === 'Other' && '기타'}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 border rounded-md p-4 bg-slate-50">
                        <div className="flex justify-between items-center">
                            <Label>캐릭터 목록 ({characters.length})</Label>
                            <BulkCharacterImport onImport={handleBulkImport} />
                        </div>

                        <div className="grid gap-4">
                            <div className="flex justify-end">
                                <SmartCharacterAdd onAdd={(char) => setCharacters([...characters, char])} />
                            </div>

                            <div className="space-y-2">
                                {characters.map((char, index) => (
                                    <CharacterListItem
                                        key={char.id}
                                        character={char}
                                        onRemove={() => removeCharacter(char.id)}
                                        onUpdate={updateCharacter}
                                    />
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
