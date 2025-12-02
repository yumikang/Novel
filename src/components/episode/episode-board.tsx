'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NoteCard } from './note-card';
import { Episode, EpisodeNote } from '@/lib/types';

interface EpisodeBoardProps {
    episode: Episode;
    onUpdateEpisode: () => void; // Trigger refresh
}

export function EpisodeBoard({ episode, onUpdateEpisode }: EpisodeBoardProps) {
    const [notes, setNotes] = useState<EpisodeNote[]>(episode.notes || []);

    useEffect(() => {
        setNotes(episode.notes || []);
    }, [episode]);

    const handleAddNote = async () => {
        try {
            const res = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    episodeId: episode.id,
                    content: '',
                    type: 'General',
                }),
            });
            if (res.ok) {
                onUpdateEpisode();
            }
        } catch (error) {
            console.error('Failed to create note:', error);
        }
    };

    const handleUpdateNote = async (id: string, content: string, type: string) => {
        // Optimistic update
        setNotes(prev => prev.map(n => n.id === id ? { ...n, content, type } : n));

        try {
            await fetch(`/api/notes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, type }),
            });
            // No need to refresh whole episode for content update usually, but maybe for order?
        } catch (error) {
            console.error('Failed to update note:', error);
            onUpdateEpisode(); // Revert on error
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        // Optimistic update
        setNotes(prev => prev.filter(n => n.id !== id));

        try {
            await fetch(`/api/notes/${id}`, {
                method: 'DELETE',
            });
            onUpdateEpisode();
        } catch (error) {
            console.error('Failed to delete note:', error);
            onUpdateEpisode();
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50/50">
            <div className="p-4 border-b flex justify-between items-center bg-white">
                <h2 className="text-lg font-semibold">{episode.title}</h2>
                <Button onClick={handleAddNote} size="sm">
                    <Plus className="mr-2 h-4 w-4" /> 메모 추가
                </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                    {notes.map(note => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onUpdate={handleUpdateNote}
                            onDelete={handleDeleteNote}
                        />
                    ))}

                    {notes.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed rounded-lg">
                            <p>작성된 메모가 없습니다.</p>
                            <Button variant="link" onClick={handleAddNote}>
                                첫 번째 메모를 추가해보세요
                            </Button>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
