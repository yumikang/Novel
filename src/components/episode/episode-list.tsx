'use client';

import { useState } from 'react';
import { Plus, Folder, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Episode } from '@/lib/types';
import { cn } from '@/lib/utils';

interface EpisodeListProps {
    projectId: string;
    episodes: Episode[];
    selectedEpisodeId: string | null;
    onSelectEpisode: (id: string) => void;
    onUpdateList: () => void;
}

export function EpisodeList({ projectId, episodes, selectedEpisodeId, onSelectEpisode, onUpdateList }: EpisodeListProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const handleCreate = async () => {
        if (!newTitle.trim()) return;

        try {
            const res = await fetch('/api/episodes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle, projectId }),
            });

            if (res.ok) {
                setNewTitle('');
                setIsCreating(false);
                onUpdateList();
            }
        } catch (error) {
            console.error('Failed to create episode:', error);
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editTitle.trim()) return;

        try {
            await fetch(`/api/episodes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle }),
            });
            setEditingId(null);
            onUpdateList();
        } catch (error) {
            console.error('Failed to update episode:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('에피소드를 삭제하시겠습니까? 포함된 모든 메모가 삭제됩니다.')) return;

        try {
            await fetch(`/api/episodes/${id}`, {
                method: 'DELETE',
            });
            if (selectedEpisodeId === id) {
                onSelectEpisode(''); // Deselect
            }
            onUpdateList();
        } catch (error) {
            console.error('Failed to delete episode:', error);
        }
    };

    const startEditing = (episode: Episode) => {
        setEditingId(episode.id);
        setEditTitle(episode.title);
    };

    return (
        <div className="w-64 border-r bg-slate-50 flex flex-col h-full">
            <div className="p-4 border-b bg-white flex justify-between items-center">
                <h3 className="font-semibold text-sm text-slate-500">에피소드 목록</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsCreating(true)}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {isCreating && (
                        <div className="p-2">
                            <Input
                                autoFocus
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCreate();
                                    if (e.key === 'Escape') setIsCreating(false);
                                }}
                                onBlur={() => setIsCreating(false)}
                                placeholder="에피소드 제목"
                                className="h-8 text-sm"
                            />
                        </div>
                    )}

                    {episodes.map(episode => (
                        <div
                            key={episode.id}
                            className={cn(
                                "group flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer transition-colors",
                                selectedEpisodeId === episode.id
                                    ? "bg-slate-200 text-slate-900 font-medium"
                                    : "text-slate-600 hover:bg-slate-100"
                            )}
                            onClick={() => onSelectEpisode(episode.id)}
                        >
                            {editingId === episode.id ? (
                                <Input
                                    autoFocus
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleUpdate(episode.id);
                                        if (e.key === 'Escape') setEditingId(null);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="h-7 text-sm"
                                />
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <Folder className="h-4 w-4 shrink-0 text-slate-400" />
                                        <span className="truncate">{episode.title}</span>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreVertical className="h-3 w-3" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={(e: React.MouseEvent) => { e.stopPropagation(); startEditing(episode); }}>
                                                <Edit2 className="mr-2 h-4 w-4" /> 이름 변경
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDelete(episode.id); }} className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" /> 삭제
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
