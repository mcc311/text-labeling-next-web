'use client';
import { useState, useContext } from 'react';
import { Response } from "@prisma/client";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableColumn } from "@nextui-org/react";
import { ResponsesContext } from "./context";
export default function SortingTable({className}: {className?: string}){
    const { responses, setResponses } = useContext(ResponsesContext);
    const [draggedItem, setDraggedItem] = useState<Response | null>(null);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const handleDragStart = (response: Response) => {
        setDraggedItem(response);
    };

    const handleDragEnter = (responseId: string) => {
        setHoveredItem(responseId);
    };

    const handleDragLeave = () => {
        setHoveredItem(null);
    };

    const handleDrop = (droppedOnResponse: Response) => {
        if (!draggedItem) return;

        const draggedIndex = responses.findIndex(r => r.id === draggedItem.id);
        const droppedIndex = responses.findIndex(r => r.id === droppedOnResponse.id);

        if (draggedIndex !== droppedIndex) {
            let updatedResponses = [...responses];
            updatedResponses.splice(draggedIndex, 1);
            updatedResponses.splice(droppedIndex, 0, draggedItem);

            setResponses(updatedResponses);
        }

        setDraggedItem(null);
        setHoveredItem(null);
    };

    return (
        <Table className={`${draggedItem !== null ? 'cursor-pointer' : ''} ${className}`}>
            <TableHeader>
                <TableColumn>ID</TableColumn>
            </TableHeader>
            <TableBody>
                {responses.map(response => (
                    <TableRow key={`response-${response.id}`}
                        className={`transition-all duration-300 ${hoveredItem === response.id.toString() ? 'mb-10  border-dashed border-black border-2 text-opacity-100' : ''} hover:cursor-pointer`}
                        draggable
                        onDragStart={() => handleDragStart(response)}
                        onDragEnter={() => handleDragEnter(response.id.toString())}
                        onDragLeave={handleDragLeave}
                        onDragOver={(e) => {
                            e.preventDefault();
                            handleDragEnter(response.id.toString());
                        }}
                        onDrop={() => handleDrop(response)}>
                        <TableCell>
                            {hoveredItem === response.id.toString() ? draggedItem?.id : 
                            (draggedItem?.id === response.id && hoveredItem !== null) ? hoveredItem : response.id
                            }
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

}