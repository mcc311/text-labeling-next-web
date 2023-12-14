// pages/generate-users.tsx
'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Input } from '@nextui-org/react';

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

  return (
    <div>
      <h1>Generate and Download Users</h1>
      <Input 
        type="number" 
        value={nNewUsers} 
        onChange={e => setNNewUsers(e.target.value)} 
      />
      <button onClick={downloadUsers}>Generate and Download</button>
    </div>
  );
};

export default GenerateUsersPage;
