'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Character } from '@/lib/types';
import { FileText, Sparkles } from 'lucide-react';

interface BulkCharacterImportProps {
    onImport: (characters: Character[]) => void;
}

export function BulkCharacterImport({ onImport }: BulkCharacterImportProps) {
    const [text, setText] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const parseText = () => {
        const lines = text.split('\n');
        const newCharacters: Character[] = [];
        let currentCharacter: Character | null = null;

        lines.forEach(line => {
            // Clean up citations like [1], [편집]
            const cleanedLine = line.replace(/\[.*?\]/g, '').trim();
            if (!cleanedLine) return;

            // Heuristic: Check if line defines a new character
            // Pattern 1: "Name: Description"
            // Pattern 2: "Name - Description"
            // Pattern 3: Short name (less than 20 chars) without separators, likely a header or list item

            let isNewChar = false;
            let name = '';
            let description = '';

            if (cleanedLine.includes(':')) {
                const parts = cleanedLine.split(':');
                const potentialName = parts[0].trim();
                // If name is too long, it might just be a sentence with a colon
                if (potentialName.length < 20) {
                    name = potentialName;
                    description = parts.slice(1).join(':').trim();
                    isNewChar = true;
                }
            } else if (cleanedLine.includes('-')) {
                const parts = cleanedLine.split('-');
                const potentialName = parts[0].trim();
                if (potentialName.length < 20) {
                    name = potentialName;
                    description = parts.slice(1).join('-').trim();
                    isNewChar = true;
                }
            } else if (cleanedLine.length < 20 && !cleanedLine.endsWith('.')) {
                // Assume short line without period is a name header
                name = cleanedLine;
                isNewChar = true;
            }

            if (isNewChar) {
                // Clean up name
                name = name.replace(/^[\d\.\-\*\•\s]+/, ''); // Remove bullets/numbers

                if (name) {
                    currentCharacter = {
                        id: crypto.randomUUID(),
                        name,
                        isCanon: true,
                        personality: description ? [description] : [],
                        appearance: [],
                        abilities: [],
                        speechPatterns: [],
                        relationships: []
                    };
                    newCharacters.push(currentCharacter);
                }
            } else {
                // If not a new character, append to previous character's description/personality
                if (currentCharacter) {
                    const lowerLine = cleanedLine.toLowerCase();

                    // Check for keywords
                    if (lowerLine.startsWith('외모:') || lowerLine.startsWith('외모 -')) {
                        const content = cleanedLine.substring(3).trim(); // Remove "외모:"
                        if (content) currentCharacter.appearance.push(content);
                    } else if (lowerLine.startsWith('능력:') || lowerLine.startsWith('능력 -')) {
                        const content = cleanedLine.substring(3).trim();
                        if (content) currentCharacter.abilities.push(content);
                    } else if (lowerLine.startsWith('성격:') || lowerLine.startsWith('성격 -')) {
                        const content = cleanedLine.substring(3).trim();
                        if (content) currentCharacter.personality.push(content);
                    } else {
                        // Default: append to personality if it's just text, or maybe check context?
                        // For now, just add as personality trait if it's not empty
                        if (cleanedLine.length > 0) {
                            // Heuristic: if previous line was appearance, maybe this is too?
                            // But for simplicity, let's just dump into personality unless explicit
                            currentCharacter.personality.push(cleanedLine);
                        }
                    }
                }
            }
        });

        onImport(newCharacters);
        setIsOpen(false);
        setText('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" /> 캐릭터 일괄 추가
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>캐릭터 일괄 추가</DialogTitle>
                    <DialogDescription>
                        위키나 설정집의 텍스트를 붙여넣으세요. 자동으로 이름과 설명을 분리합니다.<br />
                        권장 형식: <code>이름: 성격/설명</code> 또는 <code>이름 - 성격/설명</code>
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Textarea
                        placeholder={`예시:\n탄지로: 착하고 성실함\n네즈코 - 오빠를 좋아함\n젠이츠: 겁이 많지만 잠들면 강함`}
                        className="min-h-[200px]"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setIsOpen(false)}>취소</Button>
                    <Button onClick={parseText} disabled={!text.trim()}>
                        <Sparkles className="mr-2 h-4 w-4" /> 분석 및 추가
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
