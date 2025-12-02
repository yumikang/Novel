'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Character } from '@/lib/types';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { EditCharacterDialog } from '@/components/original/edit-character-dialog';

interface CharacterListItemProps {
    character: Character;
    onRemove: () => void;
    onUpdate?: (c: Character) => void;
    readOnly?: boolean;
}

export function CharacterListItem({ character, onRemove, onUpdate, readOnly = false }: CharacterListItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-md border transition-all">
            <div
                className="flex justify-between items-center p-3 cursor-pointer hover:bg-slate-50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{character.name}</span>
                    {!isExpanded && (
                        <span className="text-xs text-slate-500 truncate max-w-[200px]">
                            {character.personality.join(', ')}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {!readOnly && onUpdate && (
                        <EditCharacterDialog character={character} onSave={onUpdate} />
                    )}
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400" onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    {!readOnly && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="p-3 border-t bg-slate-50 space-y-3 text-sm">
                    {character.appearance.length > 0 && (
                        <div>
                            <span className="font-semibold text-xs text-slate-500 block mb-1">외모</span>
                            <div className="flex flex-wrap gap-1">
                                {character.appearance.map((item, i) => (
                                    <Badge key={i} variant="outline" className="bg-white">{item}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {character.abilities.length > 0 && (
                        <div>
                            <span className="font-semibold text-xs text-slate-500 block mb-1">능력</span>
                            <div className="flex flex-wrap gap-1">
                                {character.abilities.map((item, i) => (
                                    <Badge key={i} variant="secondary" className="bg-white">{item}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {character.personality.length > 0 && (
                        <div>
                            <span className="font-semibold text-xs text-slate-500 block mb-1">성격 및 특징</span>
                            <div className="bg-white p-3 rounded border text-slate-700 leading-relaxed text-sm max-h-[400px] overflow-y-auto whitespace-pre-wrap">
                                {character.personality.map((item, i) => (
                                    <p key={i} className="mb-2 last:mb-0">{item}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
