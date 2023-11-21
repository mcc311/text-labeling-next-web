'use client'
import React from 'react';
import { Button } from '@nextui-org/react';

interface ActionButtonsProps {
  onYes: () => void;
  onNo: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onYes, onNo }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
      <Button onClick={onNo} radius="sm" className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg">不符合</Button>
      <Button onClick={onYes} radius="sm" className="bg-gradient-to-tr from-blue-500 to-green-500 text-white shadow-lg">符合</Button>
    </div>
  );
};

export default ActionButtons;
