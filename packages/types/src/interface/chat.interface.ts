export interface IMessage {
  id: string;
  createdAt: Date;
  sender: 'user' | 'gemini';
  type: 'text' | 'image' | 'audio';
}

export interface ImagesMessage extends IMessage {
  images: string[];
  text?: string;
}

export interface TextMessage extends IMessage {
  text: string;
}

export interface AudioMessage extends IMessage {
  text: string;
  audioUri?: string;
}

export type Message = ImagesMessage | TextMessage | AudioMessage;
