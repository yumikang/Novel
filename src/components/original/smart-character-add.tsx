'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Character } from '@/lib/types';
import { Sparkles, UserPlus } from 'lucide-react';

interface SmartCharacterAddProps {
    onAdd: (character: Character) => void;
}

export function SmartCharacterAdd({ onAdd }: SmartCharacterAddProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');

    // Staged data
    const [parsedName, setParsedName] = useState('');
    const [parsedPersonality, setParsedPersonality] = useState<string[]>([]);
    const [parsedAppearance, setParsedAppearance] = useState<string[]>([]);
    const [parsedAbilities, setParsedAbilities] = useState<string[]>([]);

    const [isAnalyzed, setIsAnalyzed] = useState(false);

    const analyzeText = () => {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

        let name = '';
        const personality: string[] = [];
        const appearance: string[] = [];
        const abilities: string[] = [];

        let currentSection: 'none' | 'personality' | 'appearance' | 'abilities' = 'none';

        // Regex for Wiki headers: e.g., "1. 개요[편집]", "2.1. 성격[편집]", "외모 [편집]"
        const headerRegex = /^(\d+(\.\d+)*\.?)?\s*(.*?)\s*(\[편집\])?$/;

        lines.forEach((line, index) => {
            const lowerLine = line.toLowerCase();
            const headerMatch = line.match(headerRegex);
            const isHeader = line.includes('[편집]') || /^\d+\./.test(line) || line.endsWith(':');

            // Clean up citations like [1], [편집]
            const cleanedLine = line.replace(/\[.*?\]/g, '').trim();
            if (!cleanedLine) return;

            // 1. Name Detection (First line logic)
            if (index === 0) {
                // If first line is a header like "2. 인물 소개", ignore it as name
                if (!line.includes('[편집]') && !/^\d+\./.test(line) && cleanedLine.length < 20) {
                    name = cleanedLine;
                    return;
                }
            }

            // 2. Section Detection
            if (isHeader) {
                let headerText = line;
                if (headerMatch && headerMatch[3]) {
                    headerText = headerMatch[3]; // Extract "성격" from "2. 성격[편집]"
                }

                // Remove brackets from header text for checking
                headerText = headerText.replace(/\[.*?\]/g, '');

                if (headerText.includes('외모')) {
                    currentSection = 'appearance';
                    return;
                }
                if (headerText.includes('능력') || headerText.includes('강점') || headerText.includes('기술')) {
                    currentSection = 'abilities';
                    return;
                }
                if (headerText.includes('성격') || headerText.includes('특징') || headerText.includes('인물') || headerText.includes('개요') || headerText.includes('취향') || headerText.includes('여담') || headerText.includes('기타')) {
                    currentSection = 'personality';
                    return;
                }
                // If header but unknown category, maybe reset or keep previous?
                // Usually "History" or "Plot" goes to personality/description context
                if (headerText.includes('행적') || headerText.includes('과거') || headerText.includes('관계')) {
                    currentSection = 'personality';
                    return;
                }
            }

            // 3. Keyword Detection (Inline)
            if (lowerLine.startsWith('외모:') || lowerLine.startsWith('외모 -')) {
                currentSection = 'appearance';
                const content = cleanedLine.replace(/^(외모[:\-]|\s*)/, '').trim();
                if (content) appearance.push(content);
                return;
            }
            if (lowerLine.startsWith('능력:') || lowerLine.startsWith('능력 -')) {
                currentSection = 'abilities';
                const content = cleanedLine.replace(/^(능력[:\-]|\s*)/, '').trim();
                if (content) abilities.push(content);
                return;
            }
            if (lowerLine.startsWith('성격:') || lowerLine.startsWith('성격 -')) {
                currentSection = 'personality';
                const content = cleanedLine.replace(/^(성격[:\-]|\s*)/, '').trim();
                if (content) personality.push(content);
                return;
            }

            // 4. Content Accumulation
            if (currentSection === 'appearance') {
                appearance.push(cleanedLine);
            } else if (currentSection === 'abilities') {
                abilities.push(cleanedLine);
            } else {
                // Default to personality for everything else (Description, History, etc.)
                personality.push(cleanedLine);
            }
        });

        // If name is still empty, try to infer or leave blank
        setParsedName(name);
        setParsedPersonality(personality);
        setParsedAppearance(appearance);
        setParsedAbilities(abilities);
        setIsAnalyzed(true);
    };

    const handleAdd = () => {
        if (!parsedName) return;

        const newChar: Character = {
            id: crypto.randomUUID(),
            name: parsedName,
            isCanon: true,
            personality: parsedPersonality,
            appearance: parsedAppearance,
            abilities: parsedAbilities,
            speechPatterns: [],
            relationships: []
        };

        onAdd(newChar);
        setIsOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setText('');
        setParsedName('');
        setParsedPersonality([]);
        setParsedAppearance([]);
        setParsedAbilities([]);
        setIsAnalyzed(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-12 border-dashed border-2 hover:border-solid hover:bg-slate-50 text-slate-500 hover:text-slate-900">
                    <UserPlus className="mr-2 h-5 w-5" />
                    주요 캐릭터 추가하기 (상세 설정)
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>캐릭터 상세 추가</DialogTitle>
                    <DialogDescription>
                        캐릭터의 상세 설정을 붙여넣으세요. 이름, 외모, 능력, 성격 등을 자동으로 분석합니다.
                    </DialogDescription>
                </DialogHeader>

                {!isAnalyzed ? (
                    <div className="space-y-4 py-4">
                        <Textarea
                            placeholder={`예시:\n박문대\n\n외모: 강아지상, 백금발\n\n능력:\n- 노래\n- 상태창 확인\n\n성격: 냉철하고 계산적이지만 츤데레 같은 면이 있다.`}
                            className="min-h-[300px]"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <Button onClick={analyzeText} className="w-full" disabled={!text.trim()}>
                            <Sparkles className="mr-2 h-4 w-4" /> 분석하기
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label>이름</Label>
                                <Input value={parsedName} onChange={(e) => setParsedName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>외모 (줄바꿈으로 구분)</Label>
                                <Textarea
                                    value={parsedAppearance.join('\n')}
                                    onChange={(e) => setParsedAppearance(e.target.value.split('\n'))}
                                    className="min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>능력 (줄바꿈으로 구분)</Label>
                                <Textarea
                                    value={parsedAbilities.join('\n')}
                                    onChange={(e) => setParsedAbilities(e.target.value.split('\n'))}
                                    className="min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>성격/설명 (줄바꿈으로 구분)</Label>
                                <Textarea
                                    value={parsedPersonality.join('\n')}
                                    onChange={(e) => setParsedPersonality(e.target.value.split('\n'))}
                                    className="min-h-[200px]"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsAnalyzed(false)} className="flex-1">다시 입력</Button>
                            <Button onClick={handleAdd} className="flex-1" disabled={!parsedName.trim()}>
                                {parsedName.trim() ? '추가하기' : '이름을 입력해주세요'}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
