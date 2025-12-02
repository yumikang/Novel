import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                originalWork: {
                    include: {
                        canonCharacters: true,
                        worldRules: true,
                    }
                },
                customCharacters: true,
                foreshadows: true,
            },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('Failed to fetch project:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, timelineSetting, auSettings, activeCharacterIds, tone, customCharacters, foreshadows } = body;

        // Transaction to update project and related data
        const project = await prisma.$transaction(async (tx: any) => {
            // Update main info
            await tx.project.update({
                where: { id },
                data: {
                    title,
                    timelineSetting,
                    auSettings,
                    activeCharacterIds,
                    tone,
                },
            });

            // Handle Custom Characters (Upsert/Delete)
            if (customCharacters) {
                const newCharIds = customCharacters.filter((c: any) => c.id).map((c: any) => c.id);
                await tx.character.deleteMany({
                    where: {
                        projectId: id,
                        id: { notIn: newCharIds },
                    },
                });

                for (const char of customCharacters) {
                    if (char.id && char.id.includes('-')) {
                        await tx.character.upsert({
                            where: { id: char.id },
                            update: {
                                name: char.name,
                                description: char.description || '',
                                personality: char.personality || [],
                                appearance: char.appearance || [],
                                abilities: char.abilities || [],
                                speechPatterns: char.speechPatterns || [],
                                relationships: char.relationships || [],
                            },
                            create: {
                                id: char.id,
                                projectId: id,
                                name: char.name,
                                isCanon: false,
                                description: char.description || '',
                                personality: char.personality || [],
                                appearance: char.appearance || [],
                                abilities: char.abilities || [],
                                speechPatterns: char.speechPatterns || [],
                                relationships: char.relationships || [],
                            }
                        });
                    } else {
                        await tx.character.create({
                            data: {
                                projectId: id,
                                name: char.name,
                                isCanon: false,
                                description: char.description || '',
                                personality: char.personality || [],
                                appearance: char.appearance || [],
                                abilities: char.abilities || [],
                                speechPatterns: char.speechPatterns || [],
                                relationships: char.relationships || [],
                            }
                        });
                    }
                }
            }

            // Handle Foreshadows (Delete all and recreate for simplicity)
            if (foreshadows) {
                await tx.foreshadow.deleteMany({
                    where: { projectId: id },
                });
                if (foreshadows.length > 0) {
                    await tx.foreshadow.createMany({
                        data: foreshadows.map((f: any) => ({
                            projectId: id,
                            title: f.title,
                            description: f.description,
                            status: f.status,
                            plantedAt: f.plantedAt,
                            expectedPayoff: f.expectedPayoff,
                        })),
                    });
                }
            }

            return tx.project.findUnique({
                where: { id },
                include: {
                    originalWork: true,
                    customCharacters: true,
                    foreshadows: true,
                },
            });
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error('Failed to update project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.project.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete project:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
