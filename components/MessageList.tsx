'use client';

import { useState } from 'react';
import { Message } from '../types/Message';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const [expandedMessageId, setExpandedMessageId] = useState<number | null>(null);
  const [detailedMessage, setDetailedMessage] = useState<Message | null>(null);

  const toggleExpandMessage = (messageId: number) => {
    setExpandedMessageId((prev) => (prev === messageId ? null : messageId));
  };

  const showMessageDetails = (message: Message) => {
    setDetailedMessage(message);
  };

  const closeDetails = () => {
    setDetailedMessage(null);
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-4">
      {messages.map((message) => {
        const isExpanded = expandedMessageId === message.id;

        return (
          <div
            key={message.id}
            className="message-item p-4 mb-4"
            onClick={() => showMessageDetails(message)}
          >
            <p className="text-lg font-semibold">{message.author}</p>
            <p className="timestamp text-sm text-gray-600">
              {new Date(message.timestamp).toLocaleString()}
            </p>
            <p className="mt-2 break-words">
              {isExpanded || message.content.length <= 100
                ? message.content
                : message.content.slice(0, 100) + '...'}
            </p>
            {message.content.length > 100 && (
              <span
                className="text-blue-500 mt-2 underline cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpandMessage(message.id);
                }}
              >
                {isExpanded ? '收起' : '...'}
              </span>
            )}
          </div>
        );
      })}

      {detailedMessage && (
        <div className="details-background flex justify-center items-center">
          <div className="details-popup animate-fade-in max-w-md mx-4">
            <h2 className="text-2xl font-semibold">{detailedMessage.author}</h2>
            <p className="timestamp text-sm text-gray-600">
              {new Date(detailedMessage.timestamp).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mb-4">ID: {detailedMessage.id}</p>
            <p className="mt-4 whitespace-pre-wrap break-words">{detailedMessage.content}</p>
            <span
              className="mt-6 text-gray-700 underline cursor-pointer"
              onClick={closeDetails}
            >
              关闭
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
