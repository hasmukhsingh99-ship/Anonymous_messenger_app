"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Breadcrumb,
  Layout,
  Menu,
  Button,
  Input,
  Switch,
  message as antdMessage,
  Spin,
  Card,
} from "antd";
import { CopyOutlined, ReloadOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { IMessage } from "@/models/User";
import { MessageCard } from "@/components/MessageCard";

const { Header, Content, Footer } = Layout;

const Dashboard: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { data: session } = useSession();

  const { register, watch, setValue } = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      antdMessage.error(
        axiosError.response?.data.message ?? "Failed to fetch message settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      console.log("Response", response);
      setMessages(response.data.messages || []);
      if (refresh) {
        antdMessage.success("Showing latest messages");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      antdMessage.error(
        axiosError.response?.data.message ?? "Failed to fetch messages"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchMessages, fetchAcceptMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      antdMessage.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      antdMessage.error(
        axiosError.response?.data.message ?? "Failed to update message settings"
      );
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    antdMessage.success("Profile URL has been copied to clipboard.");
  };

  const menuItems = new Array(3).fill(null).map((_, index) => ({
    key: String(index + 1),
    label: `nav ${index + 1}`,
  }));

  return (
    <Layout>
      <Content style={{ padding: "0 48px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: "#fff",
            borderRadius: "8px",
          }}
        >
          <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
              Copy Your Unique Link
            </h2>
            <div className="flex items-center">
              <Input
                value={profileUrl}
                disabled
                className="input input-bordered w-full p-2 mr-2"
              />
              <Button icon={<CopyOutlined />} onClick={copyToClipboard}>
                Copy
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <Switch
              checked={acceptMessages}
              onChange={handleSwitchChange}
              loading={isSwitchLoading}
            />
            <span className="ml-2">
              Accept Messages: {acceptMessages ? "On" : "Off"}
            </span>
          </div>

          <Button
            className="mt-4"
            icon={isLoading ? <Spin /> : <ReloadOutlined />}
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? "Loading" : "Refresh"}
          </Button>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <Card key={index}>
                  <MessageCard
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                </Card>
              ))
            ) : (
              <p>No messages to display.</p>
            )}
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default Dashboard;
