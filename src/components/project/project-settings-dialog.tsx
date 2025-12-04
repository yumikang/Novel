'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Trash2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FanficProject, Character, OriginalWork } from '@/lib/types';

interface ProjectSettingsDialogProps {
    project: FanficProject;
    onUpdate: () => void;
}

export function ProjectSettingsDialog({ project, onUpdate }: ProjectSettingsDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(project.title);
    const [timeline, setTimeline] = useState(project.timelineSetting);
    const [auSettings, setAuSettings] = useState(project.auSettings.join(', '));
    const [customCharacters, setCustomCharacters] = useState<Character[]>(
        project.customCharacters || []
    );
    const [originalWorkId, setOriginalWorkId] = useState(project.originalWorkId || '');
    const [availableWorks, setAvailableWorks] = useState<OriginalWork[]>([]);

    // 원작 목록 가져오기
    useEffect(() => {
        if (open) {
            fetch('/api/originals')
                .then(res => res.json())
                .then(data => setAvailableWorks(data))
                .catch(err => console.error('Failed to fetch originals:', err));
        }
    }, [open]);

    // 새 캐릭터 추가
    const addCharacter = () => {
        const newChar: Character = {
            id: `temp-${Date.now()}`,
            name: '',
            isCanon: false,
            personality: [],
            appearance: [],
            abilities: [],
            speechPatterns: [],
            relationships: [],
            description: '',
        };
        setCustomCharacters([...customCharacters, newChar]);
    };

    // 캐릭터 삭제
    const removeCharacter = (id: string) => {
        setCustomCharacters(customCharacters.filter(c => c.id !== id));
    };

    // 캐릭터 필드 업데이트
    const updateCharacter = (id: string, field: keyof Character, value: string | string[]) => {
        setCustomCharacters(customCharacters.map(c =>
            c.id === id ? { ...c, [field]: value } : c
        ));
    };

    // 콤마로 구분된 문자열을 배열로 변환
    const parseArrayField = (value: string): string[] => {
        return value.split(',').map(s => s.trim()).filter(Boolean);
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/projects/${project.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    timelineSetting: timeline,
                    auSettings: auSettings.split(',').map(s => s.trim()).filter(Boolean),
                    customCharacters: customCharacters.filter(c => c.name.trim() !== ''),
                    originalWorkId: originalWorkId || undefined,
                }),
            });

            if (res.ok) {
                onUpdate();
                setOpen(false);
            } else {
                alert('프로젝트 수정 실패');
            }
        } catch (error) {
            console.error(error);
            alert('오류 발생');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/projects/${project.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.push('/');
            } else {
                alert('프로젝트 삭제 실패');
            }
        } catch (error) {
            console.error(error);
            alert('오류 발생');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" /> 설정
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>프로젝트 설정</DialogTitle>
                    <DialogDescription>
                        프로젝트의 기본 정보를 수정하거나 삭제할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="basic">기본 정보</TabsTrigger>
                        <TabsTrigger value="characters">커스텀 캐릭터</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4 mt-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                제목
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="original" className="text-right">
                                원작
                            </Label>
                            <div className="col-span-3">
                                <Select value={originalWorkId} onValueChange={setOriginalWorkId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="원작을 선택하세요" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableWorks.map(work => (
                                            <SelectItem key={work.id} value={work.id}>
                                                {work.title} ({work.mediaType})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {availableWorks.length === 0 && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        원작 관리에서 먼저 원작을 등록하세요
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="timeline" className="text-right">
                                시점
                            </Label>
                            <Input
                                id="timeline"
                                value={timeline}
                                onChange={(e) => setTimeline(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="au" className="text-right">
                                AU 설정
                            </Label>
                            <Input
                                id="au"
                                value={auSettings}
                                onChange={(e) => setAuSettings(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="characters" className="space-y-4 mt-4">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                                이 프로젝트에만 등장하는 오리지널 캐릭터를 추가하세요.
                            </p>
                            <Button variant="outline" size="sm" onClick={addCharacter}>
                                <Plus className="h-4 w-4 mr-1" /> 캐릭터 추가
                            </Button>
                        </div>

                        {customCharacters.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                                등록된 커스텀 캐릭터가 없습니다.
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {customCharacters.map((char, index) => (
                                    <Card key={char.id}>
                                        <CardContent className="pt-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm font-medium text-muted-foreground">
                                                    캐릭터 #{index + 1}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeCharacter(char.id)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>이름 *</Label>
                                                <Input
                                                    placeholder="캐릭터 이름"
                                                    value={char.name}
                                                    onChange={(e) => updateCharacter(char.id, 'name', e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>설명</Label>
                                                <Textarea
                                                    placeholder="캐릭터에 대한 간단한 설명"
                                                    value={char.description || ''}
                                                    onChange={(e) => updateCharacter(char.id, 'description', e.target.value)}
                                                    rows={2}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>성격 (쉼표로 구분)</Label>
                                                <Input
                                                    placeholder="예: 냉철함, 츤데레, 다정함"
                                                    value={char.personality?.join(', ') || ''}
                                                    onChange={(e) => updateCharacter(char.id, 'personality', parseArrayField(e.target.value))}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>외모 (쉼표로 구분)</Label>
                                                <Input
                                                    placeholder="예: 검은 머리, 키가 큼"
                                                    value={char.appearance?.join(', ') || ''}
                                                    onChange={(e) => updateCharacter(char.id, 'appearance', parseArrayField(e.target.value))}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>말투 예시 (쉼표로 구분)</Label>
                                                <Input
                                                    placeholder="예: ~다네, ~인 것 같군"
                                                    value={char.speechPatterns?.join(', ') || ''}
                                                    onChange={(e) => updateCharacter(char.id, 'speechPatterns', parseArrayField(e.target.value))}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <DialogFooter className="flex justify-between sm:justify-between mt-4">
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        <Trash2 className="mr-2 h-4 w-4" /> 삭제
                    </Button>
                    <Button onClick={handleUpdate} disabled={loading}>
                        {loading ? '저장 중...' : '저장'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
