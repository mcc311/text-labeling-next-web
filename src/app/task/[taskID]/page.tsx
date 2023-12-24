'use client';

import { Prompt, Task } from "@/types/task";
import { Button, Link, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import axios from 'axios';
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";


export default function TaskPage(
    { params }: { params: { taskID: string } }
) {
    const taskID = params.taskID;
    const [task, setTask] = useState<Task>({
        id: '',
        name: '',
        shortDescription: '',
        description: '',
    });
    const [prompts, setPrompts] = useState<(Prompt & { submissions: { updatedAt: Date }[] })[]>([]);
    const { data: session } = useSession();

    const [currentPage, setCurrentPage] = useState(1);
    const [promptsPerPage, setPromptsPerPage] = useState(10);
    const [promptsCount, setPromptsCount] = useState(0);

    useEffect(() => {
        const getTasks = async () => {
            const res = await axios.get(`/api/task?taskID=${taskID}&page=${currentPage}&limit=${promptsPerPage}`);
            const { task: { prompts: promptsData, ...taskData }, promptCount } = res.data;
            console.log(res.data);
            setTask(taskData);
            setPrompts(promptsData);
            setPromptsCount(promptCount);

        }
        getTasks();
    }, [taskID, currentPage, promptsPerPage]);
    return (
        <div className="gap-2 grid">
            <h1>Task {params.taskID}</h1>
            <p>{task.name}</p>
            <p>{task.shortDescription}</p>
            <p>{task.description}</p>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                }}
                className="w-full"
            >
                <Button
                    color="primary"
                    variant="solid"
                    href={`/task/${taskID}/answer`}
                    as={Link}
                >由此開始</Button>
                <Pagination
                    showControls
                    total={Math.ceil(promptsCount / promptsPerPage)}
                    page={currentPage}
                    onChange={(page) => setCurrentPage(page)}

                />
            </div>

            <Table>
                <TableHeader>

                    <TableColumn>編號</TableColumn>
                    <TableColumn>prompt</TableColumn>
                    <TableColumn> </TableColumn>

                </TableHeader>
                <TableBody>
                    {prompts.map((prompt) => (
                        <TableRow key={prompt.id}>
                            <TableCell>{prompt.id}</TableCell>
                            <TableCell>{prompt.content}</TableCell>
                            <TableCell>
                                {session ?
                                    <Button
                                        size="sm"
                                        color={prompt.submissions.length > 0 ? 'success' : 'primary'}
                                        variant="light"
                                        disabled={prompt.submissions.length > 0}
                                        // href={`/task/${taskID}/${prompt.id}`}
                                        href={prompt.submissions.length > 0 ? `#` : `/task/${taskID}/${prompt.id}`}
                                        as={Link}
                                    >
                                        {
                                            prompt.submissions.length > 0 ?
                                                '已完成'
                                                : '開始'

                                        }</Button>
                                    : <Button
                                        size="sm"
                                        color="danger"
                                        variant="light"
                                        onClick={() => signIn()}
                                    >請先登入</Button>
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>

    )
}