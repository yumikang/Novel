import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { content, type, order } = body;

        const note = await prisma.episodeNote.update({
            where: { id },
            data: {
                content,
                type,
                order,
            },
        });

        return NextResponse.json(note);
    } catch (error) {
        console.error('Failed to update note:', error);
        return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.episodeNote.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete note:', error);
        return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
    }
}
