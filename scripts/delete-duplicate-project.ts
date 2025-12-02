import { prisma } from '../src/lib/prisma';

async function main() {
    const duplicateId = '11b367b1-2d32-4bf1-a3d0-83bb108406a0';
    try {
        console.log(`Deleting project ${duplicateId}...`);
        await prisma.project.delete({
            where: { id: duplicateId }
        });
        console.log('Duplicate project deleted.');
    } catch (error) {
        console.error('Error deleting project:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
