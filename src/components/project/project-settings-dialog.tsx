'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Trash2 } from 'lucide-react';
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
import { FanficProject } from '@/lib/types';

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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>프로젝트 설정</DialogTitle>
                    <DialogDescription>
                        프로젝트의 기본 정보를 수정하거나 삭제할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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
                </div>
                <DialogFooter className="flex justify-between sm:justify-between">
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
