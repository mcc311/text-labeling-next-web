'use client';
import { createContext } from "react";
import { Response } from "@prisma/client";

export const ResponsesContext = createContext<{
    responses: Response[];
    setResponses: React.Dispatch<React.SetStateAction<Response[]>>;
}>({
    responses: [],
    setResponses: () => { }
});