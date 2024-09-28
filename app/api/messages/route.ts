import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 获取留言的 JSON 文件路径
const filePath = path.join(process.cwd(), 'data', 'messages.json');

// 从文件读取留言
function getMessages() {
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    if (!fileData) return []; // 如果文件为空，返回空数组
    return JSON.parse(fileData); // 解析 JSON 数据
  } catch (error) {
    console.error('Failed to read messages:', error);
    return []; // 如果读取或解析失败，返回空数组
  }
}

// 保存留言到文件
function saveMessages(messages: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Failed to save messages:', error);
  }
}

// GET 请求：获取所有留言
export async function GET() {
  try {
    const messages = getMessages();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Failed to get messages:', error);
    return NextResponse.error();
  }
}

// POST 请求：添加新留言
export async function POST(request: Request) {
  try {
    const newMessage = await request.json();
    const messages = getMessages();
    newMessage.id = Date.now();
    newMessage.timestamp = new Date().toISOString();
    messages.unshift(newMessage);
    saveMessages(messages);
    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Failed to post message:', error);
    return NextResponse.error();
  }
}
