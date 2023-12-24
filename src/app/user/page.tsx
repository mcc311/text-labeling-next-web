// pages/generate-users.tsx
'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea } from '@nextui-org/react';

const GenerateUsersPage = () => {
  const [nNewUsers, setNNewUsers] = useState('1');

  const downloadUsers = async () => {
    try {
      const response = await axios.post('/api/users/generate', {
        nNewUsers: parseInt(nNewUsers, 10)
      }, {
        responseType: 'blob',
      });

      // Extract filename from the `Content-Disposition` header
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'access_tokens.csv'; // Default filename
      if (contentDisposition) {
        const matches = /filename="?(.+)"?/.exec(contentDisposition);
        if (matches && matches.length >= 2) {
          filename = matches[1];
        }
      }

      // Create a Blob from the CSV Stream
      const file = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(file);
      
      // Create a link and trigger the download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  const [value, setValue] = useState('');
  interface User {
    name: string;
    email: string;
    password?: string;
    status: 'success' | 'error';
  }
  const [users, setUsers] = useState<User[]>([]);
  
  const handleUpload = async () => {
    const newUsers = value.split('\n').map(async (line) => {
      const [name, email] = line.split(',');
      // axios.post('/api/users' ...
      const res = await axios.post('/api/users', {
        name,
        email
      });
      console.log(res);
      return {
        name,
        email,
        password: res?.data?.password,
        status: res.status === 200 ? 'success' : 'error'
      };
    }
    );
    const users = await Promise.all(newUsers);
    setUsers(users as User[]);
  }


  return (
    <div className='flex flex-col min-h-screen py-2'
    >
      {/* <h1>Generate and Download Users</h1>
      <Input 
        type="number" 
        value={nNewUsers} 
        onChange={e => setNNewUsers(e.target.value)} 
      />
      <button onClick={downloadUsers}>Generate and Download</button> */}
      <h3>新增使用者</h3>
      <Textarea
        width="100%"
        height="100%"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className='whitespace-pre-line font-mono'
        placeholder={`請輸入使用者資料，每行一筆，格式為：姓名,電子郵件\n例如：\n張三, user1@example.com\n李四, user2@example.com\n王五, user3@example.com`}
      />
      {/* hidden table show added user after upload successfully */}
      {users.length > 0 && (
      <Table>
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Password</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user?.password}</TableCell>
              <TableCell>{user.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default GenerateUsersPage;
