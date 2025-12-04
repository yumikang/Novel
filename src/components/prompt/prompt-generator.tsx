'use client';

import { useState } from 'react';
import { Copy, Sparkles, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FanficProject, Character, Episode } from '@/lib/types';

interface PromptGeneratorProps {
    project: FanficProject;
    episodes?: Episode[];
    onProjectUpdate?: () => void;
}

export function PromptGenerator({ project, episodes = [], onProjectUpdate }: PromptGeneratorProps) {
    const [context, setContext] = useState('');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [selectedActiveChars, setSelectedActiveChars] = useState<string[]>(project.activeCharacterIds);
    const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>('');

    // 캐릭터 추가 다이얼로그 상태
    const [addCharDialogOpen, setAddCharDialogOpen] = useState(false);
    const [newCharName, setNewCharName] = useState('');
    const [newCharDescription, setNewCharDescription] = useState('');
    const [newCharPersonality, setNewCharPersonality] = useState('');
    const [newCharSpeechPatterns, setNewCharSpeechPatterns] = useState('');
    const [addingChar, setAddingChar] = useState(false);

    // 즉석에서 추가된 임시 캐릭터 (세션 동안만 유지)
    const [tempCharacters, setTempCharacters] = useState<Character[]>([]);

    const originalWork = project.originalWork;

    // 에피소드 선택 시 본문을 context에 로드
    const handleEpisodeSelect = (episodeId: string) => {
        setSelectedEpisodeId(episodeId);
        if (episodeId && episodeId !== 'none') {
            const episode = episodes.find(e => e.id === episodeId);
            if (episode) {
                setContext(episode.content || '');
            }
        }
    };

    // 원작 캐릭터 + 커스텀 캐릭터 + 임시 캐릭터 합치기
    const allCharacters = [
        ...(originalWork?.canonCharacters || []),
        ...(project.customCharacters || []).map(c => ({ ...c, isCanon: false })),
        ...tempCharacters.map(c => ({ ...c, isCanon: false }))
    ];

    const handleGenerate = () => {
        if (!originalWork) return;

        const characters = allCharacters.filter(c => selectedActiveChars.includes(c.id));

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

    // 콤마로 구분된 문자열을 배열로 변환
    const parseArrayField = (value: string): string[] => {
        return value.split(',').map(s => s.trim()).filter(Boolean);
    };

    // 임시 캐릭터 추가 (세션 동안만 유지)
    const handleAddTempCharacter = () => {
        if (!newCharName.trim()) return;

        const newChar: Character = {
            id: `temp-${Date.now()}`,
            name: newCharName.trim(),
            isCanon: false,
            description: newCharDescription.trim(),
            personality: parseArrayField(newCharPersonality),
            appearance: [],
            abilities: [],
            speechPatterns: parseArrayField(newCharSpeechPatterns),
            relationships: [],
        };

        setTempCharacters(prev => [...prev, newChar]);
        setSelectedActiveChars(prev => [...prev, newChar.id]);

        // 폼 초기화
        setNewCharName('');
        setNewCharDescription('');
        setNewCharPersonality('');
        setNewCharSpeechPatterns('');
        setAddCharDialogOpen(false);
    };

    // 캐릭터를 프로젝트에 영구 저장
    const handleSaveCharacterToProject = async () => {
        if (!newCharName.trim()) return;
        setAddingChar(true);

        try {
            const newChar = {
                name: newCharName.trim(),
                description: newCharDescription.trim(),
                personality: parseArrayField(newCharPersonality),
                speechPatterns: parseArrayField(newCharSpeechPatterns),
            };

            const updatedCustomCharacters = [
                ...(project.customCharacters || []),
                newChar,
            ];

            const res = await fetch(`/api/projects/${project.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customCharacters: updatedCustomCharacters,
                }),
            });

            if (res.ok) {
                // 폼 초기화
                setNewCharName('');
                setNewCharDescription('');
                setNewCharPersonality('');
                setNewCharSpeechPatterns('');
                setAddCharDialogOpen(false);

                // 부모 컴포넌트에 업데이트 알림
                if (onProjectUpdate) {
                    onProjectUpdate();
                }
            } else {
                alert('캐릭터 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to save character:', error);
            alert('오류가 발생했습니다.');
        } finally {
            setAddingChar(false);
        }
    };

    // 임시 캐릭터 제거
    const removeTempCharacter = (id: string) => {
        setTempCharacters(prev => prev.filter(c => c.id !== id));
        setSelectedActiveChars(prev => prev.filter(cId => cId !== id));
    };

    if (!originalWork) return <div className="p-4 text-center text-muted-foreground">원작 정보를 찾을 수 없습니다. 프로젝트 설정에서 원작을 선택해주세요.</div>;

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
                            <div className="flex items-center justify-between">
                                <Label>등장 인물 선택 (이번 장면에 나올 캐릭터)</Label>
                                <Dialog open={addCharDialogOpen} onOpenChange={setAddCharDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Plus className="h-3 w-3 mr-1" /> 캐릭터 추가
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>캐릭터 추가</DialogTitle>
                                            <DialogDescription>
                                                이번 장면에 등장할 새 캐릭터를 추가하세요.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="charName">이름 *</Label>
                                                <Input
                                                    id="charName"
                                                    placeholder="캐릭터 이름"
                                                    value={newCharName}
                                                    onChange={(e) => setNewCharName(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="charDesc">설명</Label>
                                                <Textarea
                                                    id="charDesc"
                                                    placeholder="캐릭터에 대한 간단한 설명"
                                                    value={newCharDescription}
                                                    onChange={(e) => setNewCharDescription(e.target.value)}
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="charPersonality">성격 (쉼표로 구분)</Label>
                                                <Input
                                                    id="charPersonality"
                                                    placeholder="예: 냉철함, 츤데레, 다정함"
                                                    value={newCharPersonality}
                                                    onChange={(e) => setNewCharPersonality(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="charSpeech">말투 예시 (쉼표로 구분)</Label>
                                                <Input
                                                    id="charSpeech"
                                                    placeholder="예: ~다네, ~인 것 같군"
                                                    value={newCharSpeechPatterns}
                                                    onChange={(e) => setNewCharSpeechPatterns(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter className="flex gap-2 sm:gap-0">
                                            <Button
                                                variant="outline"
                                                onClick={handleAddTempCharacter}
                                                disabled={!newCharName.trim()}
                                            >
                                                이번만 사용
                                            </Button>
                                            <Button
                                                onClick={handleSaveCharacterToProject}
                                                disabled={!newCharName.trim() || addingChar}
                                            >
                                                {addingChar ? '저장 중...' : '프로젝트에 저장'}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {allCharacters.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        등록된 캐릭터가 없습니다. 위 버튼으로 캐릭터를 추가해주세요.
                                    </p>
                                ) : (
                                    allCharacters.map(char => {
                                        const isActive = selectedActiveChars.includes(char.id);
                                        const isTemp = char.id.startsWith('temp-');
                                        return (
                                            <Badge
                                                key={char.id}
                                                variant={isActive ? "default" : "outline"}
                                                className="cursor-pointer hover:bg-primary/90 group"
                                                onClick={() => toggleChar(char.id)}
                                            >
                                                {char.name}
                                                {!char.isCanon && <span className="ml-1 opacity-60">(OC)</span>}
                                                {isTemp && (
                                                    <X
                                                        className="ml-1 h-3 w-3 opacity-60 hover:opacity-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeTempCharacter(char.id);
                                                        }}
                                                    />
                                                )}
                                            </Badge>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 flex-1 flex flex-col">
                            <div className="flex items-center justify-between">
                                <Label>현재 줄거리 / 직전 장면</Label>
                                {episodes.length > 0 && (
                                    <Select value={selectedEpisodeId} onValueChange={handleEpisodeSelect}>
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="에피소드에서 불러오기" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">직접 입력</SelectItem>
                                            {episodes.map(ep => (
                                                <SelectItem key={ep.id} value={ep.id}>
                                                    {ep.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
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
