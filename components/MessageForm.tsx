'use client';

import { useState, useEffect } from 'react';

interface MessageFormProps {
  onNewMessage: (author: string, content: string) => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ onNewMessage }) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isCooldown, setIsCooldown] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    const storedTime = localStorage.getItem('lastSubmissionTime');
    const storedRemainingTime = localStorage.getItem('remainingTime');

    if (storedTime) {
      const lastTime = Number(storedTime);
      const currentTime = Date.now();
      const timePassed = Math.floor((currentTime - lastTime) / 1000);

      if (timePassed < 300) {
        const timeLeft = 300 - timePassed;
        setRemainingTime(timeLeft);
        setIsCooldown(true);
      } else {
        localStorage.removeItem('lastSubmissionTime');
        localStorage.removeItem('remainingTime');
      }
    }
  }, []);

  useEffect(() => {
    if (isCooldown) {
      const intervalId = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 0) {
            clearInterval(intervalId);
            setIsCooldown(false);
            setMessage(null);
            localStorage.removeItem('remainingTime');
            return 0;
          }
          localStorage.setItem('remainingTime', (prev - 1).toString());
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isCooldown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAuthor = author.trim() === '' ? '匿名' : author;

    const currentTime = Date.now();
    if (lastSubmissionTime && currentTime - lastSubmissionTime < 5 * 60 * 1000) {
      setMessage('每5分钟只能留言一次！');
      return;
    }

    if (finalAuthor && content) {
      onNewMessage(finalAuthor, content);
      setAuthor('');
      setContent('');
      setLastSubmissionTime(currentTime);
      localStorage.setItem('lastSubmissionTime', currentTime.toString());

      const cooldownDuration = 5 * 60;
      setRemainingTime(cooldownDuration);
      localStorage.setItem('remainingTime', cooldownDuration.toString());

      setMessage('留言成功！');
      setIsCooldown(true);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 800) {
      setContent(e.target.value);
      setMessage(null);
    }
  };

  const formatRemainingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-lg w-full">
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="你的名字(若留空则默认设置为匿名)"
        className="border-b border-gray-300 p-2 rounded-t-lg focus:outline-none focus:border-indigo-600 transition"
      />
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="你的留言(最多800字)"
        required
        className="border-b border-gray-300 p-2 rounded-b-lg focus:outline-none focus:border-indigo-600 transition"
      />
      <button
        type="submit"
        className={`bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition ${isCooldown ? 'bg-gray-400 cursor-not-allowed' : ''}`}
        disabled={isCooldown}
      >
        {isCooldown ? `${formatRemainingTime(remainingTime)}` : '提交'}
      </button>
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </form>
  );
};

export default MessageForm;
