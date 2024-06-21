'use client';
import React from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { IMessage } from '@/models/User';
import { Text, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { Title } from '@radix-ui/react-toast/dist';



type MessageCardProps = {
  message: IMessage;
  onMessageDelete: (messageId: string) => void;
};

export const MessageCard: React.FC<MessageCardProps> = ({ message, onMessageDelete }) => {
const {toast} = useToast()
const showDeleteConfirm=async()=>{
  const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
  toast({
    title:response.data.message,

  })
  onMessageDelete(message._id)
}
  return (
    <Card className="card-bordered">
      {/* <div className="flex justify-between items-center">
        <Title level={4}>{message.content}</Title>
        <Button type="primary" danger icon={<DeleteOutlined />} onClick={showDeleteConfirm} />
      </div> */}
      <Text type="secondary">{dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}</Text>
    </Card>
  );
};

export default MessageCard;
