'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Character } from '@/lib/types';
import { Pencil } from 'lucide-react';

interface EditCharacterDialogProps {
    character: Character;
    onSave: (updatedCharacter: Character) => void;
}

export function EditCharacterDialog({ character, onSave }: EditCharacterDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const [name, setName] = useState(character.name);
    const [personality, setPersonality] = useState(character.personality);
    const [appearance, setAppearance] = useState(character.appearance);
    const [abilities, setAbilities] = useState(character.abilities);

    const handleSave = () => {
        if (!name) return;

        const updatedChar: Character = {
            ...character,
            name,
            personality,
            appearance,
            abilities,
        };

        onSave(updatedChar);
        setIsOpen(false);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            // Reset state to current character prop values when opening
            setName(character.name);
            setPersonality(character.personality);
            setAppearance(character.appearance);
            setAbilities(character.abilities);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-blue-500">
                    <Pencil className="h-3 w-3" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>캐릭터 수정</DialogTitle>
                    <DialogDescription>
                        캐릭터의 상세 정보를 수정합니다.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label>이름</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>외모 (줄바꿈으로 구분)</Label>
                            <Textarea
                                value={appearance.join('\n')}
                                onChange={(e) => setAppearance(e.target.value.split('\n'))}
                                className="min-h-[80px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>능력 (줄바꿈으로 구분)</Label>
                            <Textarea
                                value={abilities.join('\n')}
                                onChange={(e) => setAbilities(e.target.value.split('\n'))}
                                className="min-h-[80px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>성격/설명 (줄바꿈으로 구분)</Label>
                            <Textarea
                                value={personality.join('\n')}
                                onChange={(e) => setPersonality(e.target.value.split('\n'))}
                                className="min-h-[200px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>취소</Button>
                        <Button onClick={handleSave}>저장하기</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
