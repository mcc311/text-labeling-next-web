'use client'
import React from 'react';
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';

interface MainContentProps {
  taskName: string;
  taskDescription: string;
  prompt: string;
  response: string;
}

const MainContent: React.FC<MainContentProps> = ({ taskName, taskDescription, prompt, response }) => {
  return (
    <div style={{ whiteSpace: 'pre-line' }}>
      <div
        className="flex gap-2 items-center"
        style={{ marginBottom: '1rem' }}
      >
        <h1>{taskName}</h1>

      </div>
      <Divider className="my-4" />

      <div className="flex gap-2 items-center"
        style={{ marginBottom: '1rem' }}
      >
        <Card>
          <CardBody>
        <h2>任務說明</h2>

            <p>{taskDescription}</p>
          </CardBody>
        </Card>
      </div>
      <div
        style={{ marginBottom: '1rem' }}>

        <Card>
          <CardBody>
            <h3>Prompt</h3>

            <p>{prompt}</p>
          </CardBody>
          <Divider />
          <CardBody>
            <h3>Response</h3>
            <p>{response}</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default MainContent;