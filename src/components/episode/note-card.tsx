'use client';

import { useState, useEffect, useRef } from 'react';
import { X, MoreVertical, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { EpisodeNote } from '@/lib/types';

interface NoteCardProps {
    note: EpisodeNote;
    onUpdate: (id: string, content: string, type: string) => void;
    onDelete: (id: string) => void;
}

const NOTE_TYPES = {
    'General': { label: '일반', color: 'bg-slate-100' },
    'Dialogue': { label: '대사', color: 'bg-blue-50' },
    'Plot': { label: '줄거리', color: 'bg-green-50' },
    'Draft': { label: '초안', color: 'bg-yellow-50' },
};

export function NoteCard({ note, onUpdate, onDelete }: NoteCardProps) {
    const [content, setContent] = useState(note.content);
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [content]);

    const handleBlur = () => {
        setIsEditing(false);
        if (content !== note.content) {
            onUpdate(note.id, content, note.type);
        }
    };

    const handleTypeChange = (newType: string) => {
        onUpdate(note.id, content, newType);
    };

    const typeConfig = NOTE_TYPES[note.type as keyof typeof NOTE_TYPES] || NOTE_TYPES['General'];

    return (
        <Card className={`group relative transition-all hover:shadow-md ${typeConfig.color}`}>
            <CardHeader className="p-3 pb-0 flex flex-row justify-between items-start space-y-0">
                <Badge variant="secondary" className="bg-white/50 hover:bg-white/80 transition-colors">
                    {typeConfig.label}
                </Badge>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleTypeChange('General')}>일반</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTypeChange('Dialogue')}>대사</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTypeChange('Plot')}>줄거리</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTypeChange('Draft')}>초안</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(note.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> 삭제
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="p-3">
                <Textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onBlur={handleBlur}
                    className="min-h-[60px] resize-none border-none bg-transparent focus-visible:ring-0 p-0 text-sm leading-relaxed"
                    placeholder="메모를 입력하세요..."
                />
            </CardContent>
        </Card>
    );
}
