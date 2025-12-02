import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, order } = body;

        const episode = await prisma.episode.update({
            where: { id },
            data: {
                title,
                order,
            },
            include: {
                notes: true,
            },
        });

        return NextResponse.json(episode);
    } catch (error) {
        console.error('Failed to update episode:', error);
        return NextResponse.json({ error: 'Failed to update episode' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.episode.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete episode:', error);
        return NextResponse.json({ error: 'Failed to delete episode' }, { status: 500 });
    }
}
