'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { WorldRule } from '@/lib/types';

interface WorldRulesManagerProps {
    rules: WorldRule[];
    onUpdate: (rules: WorldRule[]) => void;
    readOnly?: boolean;
}

export function WorldRulesManager({ rules, onUpdate, readOnly = false }: WorldRulesManagerProps) {
    const [newRuleTitle, setNewRuleTitle] = useState('');
    const [newRuleDescription, setNewRuleDescription] = useState('');

    const addRule = () => {
        if (!newRuleTitle.trim()) return;

        const newRule: WorldRule = {
            id: crypto.randomUUID(),
            title: newRuleTitle,
            description: newRuleDescription,
        };

        onUpdate([...rules, newRule]);
        setNewRuleTitle('');
        setNewRuleDescription('');
    };

    const removeRule = (id: string) => {
        onUpdate(rules.filter(r => r.id !== id));
    };

    return (
        <div className="space-y-6">
            {!readOnly && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">새 설정 추가</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>설정 제목</Label>
                            <Input
                                placeholder="예: 마법 체계, 지리적 특성"
                                value={newRuleTitle}
                                onChange={(e) => setNewRuleTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>설명</Label>
                            <Textarea
                                placeholder="설정에 대한 상세 설명을 입력하세요."
                                value={newRuleDescription}
                                onChange={(e) => setNewRuleDescription(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                        <Button onClick={addRule} disabled={!newRuleTitle.trim()} className="w-full">
                            <Plus className="mr-2 h-4 w-4" /> 설정 추가
                        </Button>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                {rules.map((rule) => (
                    <Card key={rule.id}>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2 flex-1">
                                    <h4 className="font-semibold text-lg">{rule.title}</h4>
                                    <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed">
                                        {rule.description}
                                    </p>
                                </div>
                                {!readOnly && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 shrink-0"
                                        onClick={() => removeRule(rule.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {rules.length === 0 && (
                    <div className="text-center py-10 text-slate-500 border-2 border-dashed rounded-lg">
                        등록된 세계관 설정이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
