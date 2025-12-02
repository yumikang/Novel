import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OriginalWork } from '@/lib/types';

export async function GET() {
    try {
        const works = await prisma.originalWork.findMany({
            include: {
                canonCharacters: true,
                worldRules: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(works);
    } catch (error) {
        console.error('Failed to fetch original works:', error);
        return NextResponse.json({ error: 'Failed to fetch original works' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, mediaType, canonCharacters, worldRules } = body;

        const work = await prisma.originalWork.create({
            data: {
                title,
                mediaType,
                source: 'Custom',
                canonCharacters: {
                    create: canonCharacters.map((char: any) => ({
                        name: char.name,
                        isCanon: true,
                        description: char.description || '',
                        personality: char.personality || [],
                        appearance: char.appearance || [],
                        abilities: char.abilities || [],
                        speechPatterns: char.speechPatterns || [],
                        relationships: char.relationships || [],
                    })),
                },
                worldRules: {
                    create: worldRules.map((rule: any) => ({
                        title: rule.title,
                        description: rule.description,
                    })),
                },
            },
            include: {
                canonCharacters: true,
                worldRules: true,
            },
        });

        return NextResponse.json(work);
    } catch (error) {
        console.error('Failed to create original work:', error);
        return NextResponse.json({ error: 'Failed to create original work' }, { status: 500 });
    }
}
