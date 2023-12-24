// components/TaskComponents/CreateForm.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Input, Button, Spacer, Card, CardBody, Divider, Textarea, CardHeader, CardFooter, Code } from '@nextui-org/react';
import axios from 'axios';
import { Prompt, Response, Task } from '@prisma/client';
import { toast, Toaster } from 'react-hot-toast';
import { redirect } from 'next/navigation'


function TaskForm() {
    const [form, setForm] = useState<Task>({
        id: -1,
        name: '',
        shortDescription: '',
        fullDescription: '',
    });

    const [prompts, setPrompts] = useState<(Prompt & {responses: Response[]})[]>([]);
    const [inputKey, setInputKey] = useState(Date.now());
    const [filePreview, setFilePreview] = useState<string>(`[
        {
            "id": 1,
            "prompt": "Prompt 1",
            "responses": [
                "Response 1",
                "Response 2"
            ]
        },
        {
            "id": 2,
            "prompt": "Prompt 2",
            "responses": [
                "Response 3",
                "Response 4"
            ]
        }
    ]`);
    useEffect(() => {
        if(form.id !== -1) {
            redirect(`/task/${form.id}`);
        }
    }
    , [form]);

    const handleSubmission = async () => {
        try {
            toast.promise(
                axios.post('/api/task', {
                    task: form,
                    prompts
                }),
                {
                    loading: '建立任務中...',
                    success: (res) => {
                        setForm(res.data);
                        return '任務建立成功！'
                    },
                    error: (err) => {
                        console.log(err);
                        return err
                    }
                }
            );
        } catch (error) {
            console.error('There was an error!', error);
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const text = await file.text();
            try {
                const prompts: (Prompt & {responses: Response[]})[]= JSON.parse(text).map((item: any) => ({
                    id: parseInt(item.id),
                    content: item.prompt,
                    responses: item.responses.map((response: string, index: number) => ({
                        id: index+1,
                        content: response
                    }))
                }));
                setPrompts(prompts);
                toast.success('JSON 格式正確');
                console.log(prompts);
                // set file preview to first 5 prompts
                setFilePreview(JSON.stringify(prompts.slice(0, 3), null, 4));
            } catch (error) {
                toast.error('JSON 格式錯誤');
                // clear file input
                setInputKey(Date.now());
                // Handle JSON parse error
            }
        }
    }
    return (
        <Card>
            <CardHeader>基本資料</CardHeader>
            <CardBody>
                <Input
                    size="lg" variant="underlined"
                    label="任務名稱" placeholder="Task Title"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Spacer y={2} />
                <Input
                    size="lg" variant='underlined'
                    label="簡短描述"
                    placeholder="Short Description"
                    value={form.shortDescription}
                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                />
                <Spacer y={2} />
                <Textarea
                    size="lg"
                    label="詳細說明"
                    placeholder="Full Description"
                    value={form.fullDescription}
                    onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                />
            </CardBody>
            <Divider />
            <CardHeader>檔案上傳</CardHeader>

            <CardBody>
                {/* 格式說明 */}
                {/* <p>請上傳 JSON 檔案，格式如下：</p> */}
                {prompts.length > 0 ? <p>檔案預覽（{Math.min(prompts.length, 3)}筆）
                </p> : <p>請上傳 JSON 檔案，格式如下：</p>}
                <pre>
                    {filePreview}
                </pre>

                <Input
                    key={inputKey} // Add the key here
                    type="file"
                    accept=".json"
                onChange={handleFileChange}
                />
            </CardBody>
            <CardFooter>
                <Button 
                    color={prompts.length === 0 ? 'default' : 'primary'}
                    disabled={prompts.length === 0}
                    onClick={handleSubmission}
                >
                    {prompts.length === 0 ? '請上傳檔案' : '建立任務'}
                </Button>
            </CardFooter>
            <Toaster 
            />
        </Card>
    )
}

export default TaskForm;
