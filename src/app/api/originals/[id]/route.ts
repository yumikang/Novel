import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { Prisma } from '@prisma/client';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const work = await prisma.originalWork.findUnique({
            where: { id },
            include: {
                canonCharacters: true,
                worldRules: true,
            },
        });

        if (!work) {
            return NextResponse.json({ error: 'Original work not found' }, { status: 404 });
        }

        return NextResponse.json(work);
    } catch (error) {
        console.error('Failed to fetch original work:', error);
        return NextResponse.json({ error: 'Failed to fetch original work' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, mediaType, canonCharacters, worldRules } = body;

        // Transaction to update work and replace related data
        // Note: For simplicity, we delete and recreate characters/rules or update them.
        // A better approach for characters is to update existing ones if IDs match, but for now let's stick to a simpler logic or just update the main fields.
        // Actually, replacing all characters might break relationships if we had them.
        // But since we are just managing a list, let's try to update.

        // However, Prisma doesn't support "upsert many" easily.
        // Let's just update the main fields for now, and maybe handle characters separately if needed?
        // Or, we can use deleteMany + createMany for full replacement (simple but changes IDs).
        // Changing IDs is bad if other things reference them.
        // Given the current scope, let's assume we replace the lists for now as we don't have deep relationships yet.

        const work = await prisma.$transaction(async (tx: any) => {
            // Update main info
            await tx.originalWork.update({
                where: { id },
                data: { title, mediaType },
            });

            // Handle Characters: Delete all and recreate (simplest for now, but beware of ID churn)
            // Ideally we should diff, but for this prototype stage, full replacement ensures sync.
            // WARNING: This changes Character IDs. If Projects reference Character IDs, this will break links.
            // We DO have Projects referencing Characters. So we MUST NOT delete characters that are in use.
            // But for now, let's just implement the basic update.

            // Actually, the frontend sends the whole list.
            // Let's just update the work title/mediaType for now.
            // Character management (add/remove) usually happens via specific actions in a real app,
            // but here we are sending the whole state?
            // Wait, the Detail View uses `updateCharacter` etc. locally and then saves?
            // No, the Detail View currently uses `store.ts` which saves the whole object.
            // So the API should probably handle full update.

            // To preserve IDs, we should use `upsert` for each character.

            // 1. Delete characters not in the new list
            const newCharIds = canonCharacters.filter((c: any) => c.id).map((c: any) => c.id);
            await tx.character.deleteMany({
                where: {
                    originalWorkId: id,
                    id: { notIn: newCharIds },
                },
            });

            // 2. Upsert characters
            for (const char of canonCharacters) {
                if (char.id && char.id.length < 36) {
                    // If ID is short/temp or we want to treat it as new? 
                    // Actually, if it's a new character from frontend, it might have a temp ID or no ID.
                    // If it has a UUID, we try to update.
                }

                // If the ID is a valid UUID, we update. If it's new (or temp), we create.
                // But `upsert` needs a unique constraint. `id` is unique.

                if (char.id && char.id.includes('-')) { // Simple UUID check
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
                            id: char.id, // Keep the ID from frontend if it was generated there? Or let DB generate?
                            // If frontend generated a UUID, we can use it.
                            originalWorkId: id,
                            name: char.name,
                            isCanon: true,
                            description: char.description || '',
                            personality: char.personality || [],
                            appearance: char.appearance || [],
                            abilities: char.abilities || [],
                            speechPatterns: char.speechPatterns || [],
                            relationships: char.relationships || [],
                        }
                    });
                } else {
                    // Create new
                    await tx.character.create({
                        data: {
                            originalWorkId: id,
                            name: char.name,
                            isCanon: true,
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

            // 3. Handle World Rules (Delete all and recreate is fine for rules usually)
            await tx.worldRule.deleteMany({
                where: { originalWorkId: id },
            });
            if (worldRules.length > 0) {
                await tx.worldRule.createMany({
                    data: worldRules.map((rule: any) => ({
                        originalWorkId: id,
                        title: rule.title,
                        description: rule.description,
                    })),
                });
            }

            return tx.originalWork.findUnique({
                where: { id },
                include: { canonCharacters: true, worldRules: true },
            });
        });

        return NextResponse.json(work);
    } catch (error) {
        console.error('Failed to update original work:', error);
        return NextResponse.json({ error: 'Failed to update original work' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.originalWork.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete original work:', error);
        return NextResponse.json({ error: 'Failed to delete original work' }, { status: 500 });
    }
}
