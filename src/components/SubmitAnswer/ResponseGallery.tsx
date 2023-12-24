'use client';
import { useEffect, useState } from "react";
import { Prompt, Response, Task } from "@prisma/client";
import { useDisclosure } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody, Kbd } from "@nextui-org/react";

export default function ResponseGallery({ responses, prompt }: { responses: Response[], prompt: Prompt | null }) {
    const [chosenResponse, setChosenResponse] = useState<Response | null>(null);



    const [chosenResponseID, setchosenResponseID] = useState<number | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    useEffect(() => {
        if (chosenResponseID !== null) {
            const chosenResponse = responses.find(response => response.id === chosenResponseID);
            if (chosenResponse)
                setChosenResponse(chosenResponse);
        }
    }
        , [chosenResponseID, responses]);
    return (
        <div className="overflow-x-auto gap-4 p-2">
            <h3>Responses</h3>

            Tips: <br/>
            1. <Kbd>shift</Kbd>+<Kbd>滾輪</Kbd> 以水平滾動 <br/>
            2. 點擊下方圖卡，或按 <Kbd>1</Kbd>, <Kbd>2</Kbd>, <Kbd>3</Kbd>... 以放大檢視 <br/>

            <div className="flex overflow-x-auto gap-4 p-2" style={{ scrollbarWidth: 'thin' }}>
                {responses.map((response) => (
                    <Card
                        key={`response-${response.id}`}
                        className="flex-none hover:bg-gray-200"
                        style={{ width: 300 }}
                        isPressable
                        isHoverable
                        onPress={() => {
                            setchosenResponseID(response.id);
                            onOpen();
                        }}>
                        <CardBody>
                            <h4>{response.id}.</h4>
                            <p>{response.content.slice(0, 100)}{response.content.length >= 100 && "..."}</p>
                        </CardBody>
                    </Card>
                ))}
                <Modal isOpen={isOpen}
                    onClose={onOpenChange}
                    scrollBehavior="inside"
                    size='3xl'>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    <p className="whitespace-pre-wrap">{prompt?.content}</p>

                                </ModalHeader>
                                <ModalBody>
                                    <h3>{chosenResponse?.id}.</h3>
                                    <p className="whitespace-pre-wrap">{chosenResponse?.content}</p>
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
            <div className="bg-gradient-to-l from-orange-400 to-emerald-400 text-white shadow-lg flex justify-between p-1">
                <span>喜歡</span>
                <span>中立</span>
                <span>不喜歡</span>
            </div>
        </div>
    )
}