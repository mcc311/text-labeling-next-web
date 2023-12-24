import { getToken } from '@/utils/getTokenJwt';
import prisma from '@/utils/prisma';
import { Response } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest){
    const jwt = await getToken(request);
    if (!jwt) {
        return NextResponse.json({ status: 401 });
    };
    console.log(jwt);
    const { searchParams } = new URL(request.url)
    const taskID = searchParams.get('taskID');
    const promptID = searchParams.get('promptID');
    console.log(taskID, promptID);
    const {responses} = await request.json() as {responses: Response[]};
    const rank = responses.map((response) => response.id);

    if(taskID && promptID && responses){

        // check if the user has already submitted a response for this prompt
        const submission = await prisma.submission.findFirst({
            where: {
                userId: parseInt(jwt.id as string),
                promptId: parseInt(promptID),
                promptTaskId: parseInt(taskID)
            }
        });
        if(submission){
            await prisma.submission.update({
                where: {
                    id: submission.id
                },
                data: {
                    Rank: rank,
                    updatedAt: new Date()
                }
            });
        } else {
            await prisma.submission.create({
                data: {
                    Rank: rank,
                    prompt: {
                        connect: {
                            id_taskId: {
                                id: parseInt(promptID),
                                taskId: parseInt(taskID)
                            }
                        }
                    },
                    user: {
                        connect: {
                            id: parseInt(jwt.id as string)
                        }
                    },
                }
            });
        }
        return NextResponse.json({ status: 200 });

       
    }
    
    
    

    
}

export async function GET(request: NextRequest){
    const jwt = await getToken(request);
    if (!jwt) {
        return NextResponse.json({ status: 401 });
    };
    const { searchParams } = new URL(request.url)
    const taskID = searchParams.get('taskID');
    const promptID = searchParams.get('promptID');
    if(taskID && promptID){
        const submission = await prisma.submission.findFirst({
            where: {
                userId: parseInt(jwt.id as string),
                promptId: parseInt(promptID),
                promptTaskId: parseInt(taskID)
            }
        });
        if(submission){
            return NextResponse.json({ status: 200, body: {submission: submission.Rank} });
        } else {
            return NextResponse.json({ status: 200, body: {submission: []} });
        }
    }
    if(taskID && !promptID){
        const submissions = await prisma.submission.findMany({
            where: {
                userId: parseInt(jwt.id as string),
                promptTaskId: parseInt(taskID)
            },
            select:{
                promptId: true,
            }
        });
        return NextResponse.json({ status: 200, body: {submissions: submissions} });
    }
    return NextResponse.json({ status: 400 });
}