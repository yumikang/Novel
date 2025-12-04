import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
        return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    try {
        const episodes = await prisma.episode.findMany({
            where: { projectId },
            include: {
                notes: {
                    orderBy: { order: 'asc' },
                },
            },
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(episodes);
    } catch (error) {
        console.error('Failed to fetch episodes:', error);
        return NextResponse.json({ error: 'Failed to fetch episodes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, projectId } = body;

        if (!title || !projectId) {
            return NextResponse.json({ error: 'Title and Project ID are required' }, { status: 400 });
        }

        // Get max order to append to the end
        const lastEpisode = await prisma.episode.findFirst({
            where: { projectId },
            orderBy: { order: 'desc' },
        });

        const newOrder = lastEpisode ? lastEpisode.order + 1 : 0;

        const episode = await prisma.episode.create({
            data: {
                title,
                content: '', // 빈 내용으로 시작
                projectId,
                order: newOrder,
            },
            include: {
                notes: true,
            },
        });

        return NextResponse.json(episode);
    } catch (error) {
        console.error('Failed to create episode:', error);
        return NextResponse.json({ error: 'Failed to create episode' }, { status: 500 });
    }
}
