'use client';

import { useState, useEffect } from 'react';
import MessageForm from '../components/MessageForm';
import MessageList from '../components/MessageList';
import Footer from '../components/footer';
import { Message } from '../types/Message';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/messages');
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.text();
        const parsedData = data ? JSON.parse(data) : [];
        setMessages(parsedData);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };
    fetchMessages();
  }, []);

  const handleNewMessage = async (author: string, content: string) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author, content }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const newMessage = await res.json();
      setMessages([newMessage, ...messages]);
    } catch (error) {
      console.error('Failed to post message:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10"> {/* 增加上下留白 */}
      <h1 className="text-5xl font-extrabold">留言板</h1>
      <script src="https://res.juz1.cn/js/copyright.js" async></script>
      <MessageForm onNewMessage={handleNewMessage} />
      <MessageList messages={messages} />
      <Footer />
    </div>
  );
}
