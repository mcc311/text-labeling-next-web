// app/api/task.ts
import { getToken } from "@/utils/getTokenJwt";
import { PrismaClient, Prompt, Response, Task } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function POST(request: Request) {
  try {
    const { task: {id, ...task}, prompts } = (await request.json()) as {
      task: Task;
      prompts: (Prompt & { responses: Response[] })[];
    };
    const createdTask = await prisma.task.create({
      data: {
        ...task,
        prompts: {
          create: prompts.map((prompt) => ({
            ...prompt,
            responses: {
              create: prompt.responses,
            },
          })),
        },
      },
    });
    return NextResponse.json(createdTask);
  } catch (error) {
    console.error("Failed to create task:", error);
    // return NextResponse.error();
    return NextResponse.json({message: error}, {status: 500})
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("taskID");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  if (id) {
    const promptCount = await prisma.prompt.count({
      where: {
        taskId: parseInt(id), // Assuming `taskId` is the field relating prompts to tasks
      },
    });
    if (page && limit) {
      const jwt = await getToken(request);
      if (!jwt) {
        const task = await prisma.task.findUnique({
          where: {
            id: parseInt(id),
          },
          include: {
            prompts: {
              take: parseInt(limit),
              skip: (parseInt(page) - 1) * parseInt(limit),
            },
          },
        });
        return NextResponse.json({ task, promptCount });
      }
      const task = await prisma.task.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          prompts: {
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            include: {
              submissions: {
                where: {
                  userId: parseInt(jwt.id as string),
                },
                select: {
                  updatedAt: true,
                },
              },
            },
          },
        },
      });
      return NextResponse.json({ task, promptCount });
    }
    const task = await prisma.task.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        prompts: {
          select: {
            id: true,
          },
        },
      },
    });
    return NextResponse.json(task);
  }
  const tasks = await prisma.task.findMany();
  return NextResponse.json(tasks);
}
