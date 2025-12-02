import { prisma } from '../src/lib/prisma';

async function main() {
    try {
        console.log('Fetching projects...');
        const projects = await prisma.project.findMany();
        console.log('Total projects:', projects.length);
        projects.forEach(p => {
            console.log(`- ID: ${p.id}, Title: ${p.title}, CreatedAt: ${p.createdAt}`);
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
