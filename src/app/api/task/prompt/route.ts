// app/api/task/prompt/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(request: Request){
    const { searchParams } = new URL(request.url)
    const taskID = searchParams.get('taskID');
    const promptID = searchParams.get('promptID');
    if (taskID && promptID) {

        const prompt = await prisma.prompt.findUnique({
            where: {
                id_taskId: {
                    id: parseInt(promptID),
                    taskId: parseInt(taskID),
                },
            },
            include: {
                responses: true,
            },
        });
        return NextResponse.json(prompt);
    }
    
}
