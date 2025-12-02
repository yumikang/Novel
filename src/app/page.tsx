'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { getProjects } from '@/lib/store'; // Removed
import { FanficProject } from '@/lib/types';
// import { PRESET_ORIGINAL_WORKS } from '@/lib/constants'; // Removed

export default function Home() {
  const [projects, setProjects] = useState<FanficProject[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const getOriginalWorkTitle = (project: FanficProject) => {
    return project.originalWork?.title || project.originalWorkId;
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">NovelMind</h1>
          <p className="text-slate-500 mt-2">당신의 2차 창작을 위한 AI 파트너</p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> 새 프로젝트
          </Button>
        </Link>
      </header>

      {projects.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg border-slate-200">
          <h3 className="text-lg font-medium text-slate-900">아직 프로젝트가 없습니다</h3>
          <p className="text-slate-500 mt-2 mb-6">새로운 팬픽션 프로젝트를 시작해보세요.</p>
          <Link href="/projects/new">
            <Button variant="outline">프로젝트 생성하기</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{getOriginalWorkTitle(project)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                      {project.timelineSetting}
                    </span>
                    {project.auSettings.map((au, idx) => (
                      <span key={idx} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                        {au}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-slate-400">
                  마지막 수정: {new Date(project.updatedAt).toLocaleDateString()}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
