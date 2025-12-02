'use client';

import { useState } from 'react';
import { Copy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FanficProject, OriginalWork } from '@/lib/types';
// import { PRESET_ORIGINAL_WORKS } from '@/lib/constants'; // Removed

interface PromptGeneratorProps {
    project: FanficProject;
}

export function PromptGenerator({ project }: PromptGeneratorProps) {
    const [context, setContext] = useState('');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [selectedActiveChars, setSelectedActiveChars] = useState<string[]>(project.activeCharacterIds);

    const originalWork = project.originalWork;

    const handleGenerate = () => {
        if (!originalWork) return;

        const characters = originalWork.canonCharacters.filter(c => selectedActiveChars.includes(c.id));

        const worldRules = originalWork.worldRules || [];
        const worldRuleDesc = worldRules.map(r => `- ${r.title}: ${r.description}`).join('\n');

        const charDescriptions = characters.length > 0
            ? characters.map(c => {
                let desc = `- ${c.name} (${c.isCanon ? '원작 캐릭터' : '오리지널 캐릭터'})`;
                if (c.description) desc += `\n  * 설명: ${c.description}`;
                if (c.personality && c.personality.length > 0) desc += `\n  * 성격: ${c.personality.join(', ')}`;
                if (c.appearance && c.appearance.length > 0) desc += `\n  * 외모: ${c.appearance.join(', ')}`;
                if (c.abilities && c.abilities.length > 0) desc += `\n  * 능력: ${c.abilities.join(', ')}`;
                if (c.speechPatterns && c.speechPatterns.length > 0) desc += `\n  * 말투: ${c.speechPatterns.join(', ')}`;
                if (c.relationships && c.relationships.length > 0) desc += `\n  * 관계: ${c.relationships.join(', ')}`;
                return desc;
            }).join('\n\n')
            : `(등록된 캐릭터가 없습니다. 원작 '${originalWork.title}'의 캐릭터 기본 성격을 참고해주세요.)`;

        const toneDesc = (project.tone && project.tone.writingStyle !== 'Normal')
            ? `문체: ${project.tone.writingStyle}, 분위기: ${project.tone.atmosphere}`
            : `(미설정 - 현재 상황 텍스트의 분위기를 참고해주세요)`;

        const prompt = `
# 역할
당신은 작가의 아이디어 구상을 돕는 보조 작가(Brainstorming Partner)입니다.
원작의 설정과 캐릭터성을 완벽하게 이해하고 있으며, 작가가 던져준 거친 아이디어를 구체적인 에피소드나 장면으로 발전시키는 능력이 탁월합니다.

# 작품 설정
- 원작: ${originalWork.title}
- 매체: ${originalWork.mediaType}
- 팬픽 시점(Timeline): ${project.timelineSetting}
- AU 설정: ${project.auSettings.join(', ') || '없음'}
- 톤앤매너: ${toneDesc}

# 세계관 및 주요 설정
${worldRuleDesc || '특별한 세계관 설정 없음'}

# 등장 캐릭터 (성격 및 말투 유지 필수)
${charDescriptions}

# 현재 상황 (Context)
${context}
(참고: 위 내용은 작가의 메모나 트위터 썰 형식일 수 있습니다. 문체보다는 담긴 상황과 감정에 집중해주세요.)

# 요청사항
1. 위 상황에서 이어질 수 있는 흥미로운 전개 아이디어 3가지를 제안해주세요. (직접 소설을 쓰는 것이 아니라, '아이디어'를 제안하는 것입니다.)
2. 각 아이디어는 캐릭터의 성격(OOC 방지)을 철저히 지켜야 합니다.
3. 독자들이 좋아할 만한 '관계성'과 '감정선' 포인트가 무엇인지 짚어주세요.
4. 각 아이디어별로 핵심 대사(Key Dialogue)를 1~2줄 포함해주세요.
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
                                {originalWork.canonCharacters.map(char => {
                                    const isActive = selectedActiveChars.includes(char.id);
                                    return (
                                        <Badge
                                            key={char.id}
                                            variant={isActive ? "default" : "outline"}
                                            className="cursor-pointer hover:bg-primary/90"
                                            onClick={() => toggleChar(char.id)}
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
