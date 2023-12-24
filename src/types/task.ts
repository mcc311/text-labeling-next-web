export interface Task {
    id: string;
    name: string;
    shortDescription: string;
    description: string;
}
export interface Prompt {
    id: string;
    content: string;
    responses: string[]; // Update to array of strings
}