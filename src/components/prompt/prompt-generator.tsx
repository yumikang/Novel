'use client';

import { useState } from 'react';
import { Copy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FanficProject, OriginalWork } from '@/lib/types';
import { PRESET_ORIGINAL_WORKS } from '@/lib/constants';

interface PromptGeneratorProps {
    project: FanficProject;
}

export function PromptGenerator({ project }: PromptGeneratorProps) {
    const [context, setContext] = useState('');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [selectedActiveChars, setSelectedActiveChars] = useState<string[]>(project.activeCharacterIds);

    const originalWork = PRESET_ORIGINAL_WORKS.find(w => w.id === project.originalWorkId);

    const handleGenerate = () => {
        if (!originalWork) return;

        const characters = originalWork.canonCharacters.filter(c => selectedActiveChars.includes(c.id));

        const charDescriptions = characters.map(c =>
            `- ${c.name}: ${c.personality.join(', ')} (말투: ${c.speechPatterns.join(', ') || '특이사항 없음'})`
        ).join('\n');

        const prompt = `
# 역할
당신은 베스트셀러 웹소설 작가이자, 원작의 설정을 완벽하게 이해하고 있는 보조 작가입니다.
다음 설정을 바탕으로 소설의 다음 전개를 제안해주세요.

# 작품 설정
- 원작: ${originalWork.title}
- 시점: ${project.timelineSetting}
- AU 설정: ${project.auSettings.join(', ') || '없음'}

# 등장 캐릭터 (성격 유지 필수)
${charDescriptions}

# 현재 상황 (Context)
${context}

# 요청사항
1. 위 상황에 이어질 자연스러운 전개 3가지를 제안해주세요.
2. 각 전개는 캐릭터의 성격(OOC 방지)을 철저히 지켜야 합니다.
3. 포스타입 독자들이 좋아할 만한 포인트(감정선, 관계성)를 살려주세요.
    `.trim();

        setGeneratedPrompt(prompt);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedPrompt);
        alert('프롬프트가 복사되었습니다!');
    };

    const toggleChar = (id: string) => {
        setSelectedActiveChars(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    if (!originalWork) return <div>원작 정보를 찾을 수 없습니다.</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Left: Input */}
            <div className="space-y-6 flex flex-col h-full">
                <Card className="flex-1 flex flex-col">
                    <CardHeader>
                        <CardTitle>상황 입력</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                        <div className="space-y-2">
                            <Label>등장 인물 선택 (이번 장면에 나올 캐릭터)</Label>
                            <div className="flex flex-wrap gap-2">
                                {project.activeCharacterIds.map(charId => {
                                    const char = originalWork.canonCharacters.find(c => c.id === charId);
                                    if (!char) return null;
                                    const isActive = selectedActiveChars.includes(charId);
                                    return (
                                        <Badge
                                            key={charId}
                                            variant={isActive ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => toggleChar(charId)}
                                        >
                                            {char.name}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2 flex-1 flex flex-col">
                            <Label>현재 줄거리 / 직전 장면</Label>
                            <Textarea
                                placeholder="예: 탄지로가 임무를 마치고 돌아오는 길에 이상한 냄새를 맡았다. 네즈코가 상자 안에서 끙끙거리는 소리가 들린다..."
                                className="flex-1 resize-none min-h-[200px]"
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                            />
                        </div>

                        <Button onClick={handleGenerate} className="w-full">
                            <Sparkles className="mr-2 h-4 w-4" /> 프롬프트 생성
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Right: Output */}
            <div className="h-full">
                <Card className="h-full flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>생성된 프롬프트</CardTitle>
                        <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!generatedPrompt}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <Textarea
                            readOnly
                            className="h-full resize-none font-mono text-sm bg-slate-50"
                            value={generatedPrompt}
                            placeholder="프롬프트가 여기에 생성됩니다. 복사해서 Claude나 ChatGPT에 붙여넣으세요."
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
