'use client'
import ResponseGallery from "@/components/SubmitAnswer/ResponseGallery";
import SortingTable from "@/components/SubmitAnswer/SortingTable";
import { ResponsesContext } from "@/components/SubmitAnswer/context";
import { Button, Card, CardBody, CardHeader, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { Prompt, Response, Task } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

export default function AnswerPage(
    { params }: { params: { taskID: string } }
) {
    const taskID = params.taskID;
    const [promptID, setPromptID] = useState<string | null>(null);
    const searchParams = useSearchParams()
    const startWith = searchParams.get('startWith');
    const [task, setTask] = useState<Task | null>(null);
    const [responses, setResponses] = useState<Response[]>([]);
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [promptIDs, setPromptIDs] = useState<number[]>([]);
    const [submissionIDs, setSubmissionIDs] = useState<number[]>([]);
    const [chosenResponseIDs, setChosenResponseIDs] = useState<number[]>([]);

    const { data: session } = useSession();

    useEffect(() => {
        // Define the function to be called when a key is pressed
        const handleKeyDown = (event: KeyboardEvent
        ) => {
            const responsesIDs = responses.map(response => response.id);
            if (responsesIDs.includes(parseInt(event.key))) {
                if (chosenResponseIDs.includes(parseInt(event.key))) {
                    setChosenResponseIDs(chosenResponseIDs.filter(id => id !== parseInt(event.key)));
                }
                else {
                    setChosenResponseIDs([...chosenResponseIDs, parseInt(event.key)]);
                }
            }
        };
        // Attach the event listener for keydown to the window
        window.addEventListener('keydown', handleKeyDown);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [chosenResponseIDs, responses]);

    useEffect(() => {
        const getSubmission = async () => {
            if (!session) return;
            const res = await axios.get(`/api/task/prompt/submit?taskID=${taskID}`);
            const { status, body: { submissions: submissionIDsData } } = res.data;
            if (status === 200) {
                setSubmissionIDs(submissionIDsData.map((submissionID: { promptId: number }) => (submissionID.promptId)));
            } else {
                alert("Error");
            }
        }
        const getPrompts = async () => {
            const res = await axios.get(`/api/task?taskID=${taskID}`);
            const { prompts: promptsData, ...taskData } = res.data;
            setTask(taskData);
            setPromptIDs(promptsData.map((prompt: Partial<Prompt>) => prompt.id));
        }
        getSubmission();
        getPrompts();
    }
        , [session, taskID]);


    // find the first prompt with no submission and set it as the current prompt
    useEffect(() => {
        if (promptIDs.length === 0) return;
        const promptsWithNoSubmission = promptIDs.filter(pID => !submissionIDs.includes(pID));
        if(promptsWithNoSubmission.length === 0) {
            alert("任務已完成！");
            redirect(`/task/${taskID}`);
        }
        if (startWith) {
            if (promptsWithNoSubmission.includes(parseInt(startWith))) {
                setPromptID(startWith);
            } else {
                setPromptID(promptsWithNoSubmission[0].toString());
            }
        } else {
            setPromptID(promptIDs[0].toString());
        }

    }
        , [promptIDs, submissionIDs, startWith, taskID]);

    useEffect(() => {
        if (!promptID) return;
        const getPromptResponses = async () => {
            const res = await axios.get(`/api/task/prompt?taskID=${taskID}&promptID=${promptID}`);
            const { responses: responsesData, ...promptData } = res.data;
            setResponses(responsesData);
            setPrompt(promptData);
        }
        getPromptResponses();
    }
        , [promptID, taskID]);


    const handleNextPrompt = () => {
        if (promptID === null) return;
        const promptIndex = promptIDs.indexOf(parseInt(promptID));
        if (promptIndex === promptIDs.length - 1) {
            toast.success('任務完成！');
            redirect(`/task/${taskID}`);
        } else {
            setPromptID(promptIDs[promptIndex + 1].toString());
        }
    }


    const [cardWidth, setCardWidth] = useState<string>('w-1/2');
    useEffect(() => {
        if (chosenResponseIDs.length === 0) {
            setCardWidth('w-1\/2');
        } else {
            setCardWidth(`w-${Math.floor(12 / chosenResponseIDs.length)}\/12`);
        }
    }, [chosenResponseIDs]);

    const handleSubmission = async () => {
        toast.promise(
            axios.post(`/api/task/prompt/submit?taskID=${taskID}&promptID=${promptID}`, { responses: responses })
                .then((res) => {
                    // Check the status code here and throw an error if it's not successful
                    if (res.data.status === 401) {
                        throw new Error("請先登入"); // This will be caught as an error
                    } else if (res.data.status !== 200) {
                        throw new Error("提交失敗"); // This too will be caught as an error
                    }
                    handleNextPrompt(); // Move this line inside the success condition
                    return res; // This will be considered a success
                }),
            {
                loading: '提交中...',
                success: (res) =>{
                    handleNextPrompt(); // Move this line inside the success condition
                    return '提交成功';
                } ,
                error: (err) => {
                    // Customize the error message from the caught error
                    // handleNextPrompt();  // Removed from here to not handle next prompt on error
                    return err.message;
                }
            }
        );
        // Remove or comment out the handleNextPrompt(); from here if you want it to only be called on success
    };


    return (
        <>
            <h1></h1>
            <Card>
                <CardHeader>
                    <h3>{task?.id}. {task?.name}</h3>
                </CardHeader>
                <CardBody className="whitespace-pre-wrap text-left">
                    {task?.fullDescription}
                </CardBody>
            </Card>
            <Card>
                <CardHeader>
                    <h3>第 {prompt?.id} 題</h3>
                </CardHeader>
                <CardBody className="whitespace-pre-wrap text-left">
                    {prompt?.content}
                </CardBody>
            </Card>
            <div className="flex overflow-x-auto gap-4 p-2">
                <div className="overflow-x-auto gap-4 p-2 w-1/4">
                    <h3>排序</h3>
                    <div className="overflow-x-auto gap-4 p-2">
                        <ResponsesContext.Provider value={{ responses, setResponses }}>
                            <SortingTable />
                        </ResponsesContext.Provider>
                    </div>
                </div>
                <ResponseGallery responses={responses} prompt={prompt} />
                <Modal isOpen={chosenResponseIDs.length !== 0}
                    onClose={() => setChosenResponseIDs([])}
                    scrollBehavior="inside"
                    size='full'>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    <p className="whitespace-pre-wrap">{prompt?.content}</p>
                                </ModalHeader>
                                <ModalBody className="flex overflow-x-auto
                                    " style={{ scrollbarWidth: 'thin' }}>
                                    <ResponsesContext.Provider value={{ responses, setResponses }}>
                                        <SortingTable className="w-1/6" />
                                    </ResponsesContext.Provider>
                                    <div className="flex overflow-x-auto gap-4 p-2
                                    " style={{ scrollbarWidth: 'thin' }}>

                                        {responses.filter(response => chosenResponseIDs.includes(response.id)).map(response => (
                                            <Card
                                                key={`response-${response.id}`}
                                                className={`flex-none hover:bg-gray-200 ${cardWidth}`}
                                                isPressable
                                                isHoverable
                                                onPress={() => {
                                                    setChosenResponseIDs(chosenResponseIDs.filter(id => id !== response.id));
                                                }}>
                                                <CardBody>
                                                    <h4>{response.id}.</h4>
                                                    <p>{response.content}</p>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </div>

                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="default"
                                        onClick={onClose}
                                    >關閉</Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>


            <br />
            <div className="flex justify-end gap-4
            ">
                {/* skip */}
                <Button
                    color="primary"
                    variant="bordered"
                    onClick={handleNextPrompt}
                >跳過</Button>
                {/* submit and next */}
                <Button
                    color="primary"
                    onClick={handleSubmission}
                >提交</Button>
                <Toaster
                />
            </div>

        </>
    )
}

