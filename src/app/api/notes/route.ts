import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content, type, episodeId } = body;

        if (!episodeId) {
            return NextResponse.json({ error: 'Episode ID is required' }, { status: 400 });
        }

        // Get max order
        const lastNote = await prisma.episodeNote.findFirst({
            where: { episodeId },
            orderBy: { order: 'desc' },
        });

        const newOrder = lastNote ? lastNote.order + 1 : 0;

        const note = await prisma.episodeNote.create({
            data: {
                content: content || '',
                type: type || 'General',
                episodeId,
                order: newOrder,
            },
        });

        return NextResponse.json(note);
    } catch (error) {
        console.error('Failed to create note:', error);
        return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
    }
}
