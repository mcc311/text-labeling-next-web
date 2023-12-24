'use client'
import TaskList from "@/components/TaskComponents/TaskList";
import { Accordion, AccordionItem, Button, Link } from "@nextui-org/react";

export default function TaskPage() {
    return (
        <div>
            <div 
                style={{ 
                    display: 'flex',
                    justifyContent: 'space-between', 
                    marginTop: '20px' 
                }}
            >
                <h1>任務列表</h1>
                <Button
                    color="primary"
                    href="/task/create"
                    as={Link}
                >創建任務</Button>
            </div>
            
            <TaskList />

        </div>
    )
}