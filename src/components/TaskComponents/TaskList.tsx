'use client'
import { Accordion, AccordionItem, Link } from "@nextui-org/react";
import { Pagination } from "@nextui-org/react";
import { useState, useEffect } from "react";
import axios from 'axios';
import { Task } from "@prisma/client";

export default function TaskList() {
    const [page, setPage] = useState(1);
    const itemPerPage = 10;
    const [tasks, setTasks] = useState<Task[]>([]);

    // axios request to get tasks
    const fetchTasks = async () => {
        const res = await axios.get('/api/task');
        const tasks = res.data;
        console.log(tasks);
        return tasks;
    }

    useEffect(() => {
        const getTasks = async () => {
            const tasksFromServer = await fetchTasks();
            setTasks(tasksFromServer);
        }
        getTasks();
    }, []);


    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                }}
                className="w-full"
            >

                <Pagination
                    showControls
                    total={Math.ceil(tasks.length / itemPerPage)}
                    page={page}
                    onChange={(page) => setPage(page)}

                />
            </div>
            <Accordion>
                {tasks.slice((page - 1) * itemPerPage, page * itemPerPage).map((task) => (
                    <AccordionItem key={task.id} title={task.name} subtitle={task.shortDescription}>
                        {task.fullDescription}
                        <div className="flex justify-end space-x-3"
                        >
                        <Link href={`/task/${task.id}`}>開始</Link>
                        </div>
                        
                    </AccordionItem>
                ))}
            </Accordion>

        </>
    )
}
