import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            include: {
                originalWork: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        // @ts-ignore
        const errorMessage = error?.message || 'Unknown error';
        // @ts-ignore
        const errorStack = error?.stack || 'No stack trace';
        console.error('Error details:', { message: errorMessage, stack: errorStack });

        return NextResponse.json(
            { error: 'Failed to fetch projects', details: errorMessage },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, originalWorkId, timelineSetting, auSettings, activeCharacterIds, tone } = body;

        const project = await prisma.project.create({
            data: {
                title,
                originalWorkId,
                timelineSetting: timelineSetting || '',
                auSettings: auSettings || [],
                activeCharacterIds: activeCharacterIds || [],
                tone: tone || {},
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error('Failed to create project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
