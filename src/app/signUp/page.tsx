// signUp.tsx
'use client';
import React, { useState } from 'react';
import Logo from '@/components/Logo';
import toast, { Toaster } from 'react-hot-toast';

import { Button, Card, CardBody, CardHeader, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea, useDisclosure } from '@nextui-org/react';
import axios from 'axios';
import Link from 'next/link';

export default function SignUpPage() {
    // const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [message, setMessage] = useState('');

    const handleSignUp = async () => {
        // toast.promise(
        //     axios.post('/api/auth/signUp', {
        //         name,
        //         email
        //     }),
        //     {
        //         loading: '註冊中...',
        //         success: (res) => res.data.message,
        //         error: (err) => err.response.data.message
        //     }
        // );
        toast.promise(
            axios.post('/api/auth/signUp', {
                name,
                email
            }),
            {
                loading: '註冊中...',
                success: (res) => {
                    setMessage(`${res.data.message}: ${res.data.access_token}`);
                    onOpen();
                    return res.data.message;
                },
                error: (err) => {
                    return err.response.data.message;
                }
            }
        );
    };


    return (
        <div className="flex flex-col items-center justify-center py-2">
            <Card
                className='rounded-none'
            >

                <CardHeader><Logo />個人訊息</CardHeader>
                <CardBody className='space-y-4'
                >
                    <Input
                        variant='underlined'
                        className="w-full"
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        variant='underlined'
                        className="w-full"
                        type='email'
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Button
                        className="w-full"
                        onClick={handleSignUp}
                    >
                        註冊
                    </Button>
                </CardBody>
            </Card>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                            <ModalBody>
                                <p>{message}</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button  variant="bordered" onPress={onClose}
                                    as={Link}
                                    href="/api/auth/signin"
                                >
                                    前往登入
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Toaster />

        </div>


    )
}

