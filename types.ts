
export type Tool = 'pencil' | 'brush' | 'spray' | 'eraser' | 'fill';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  objective: string;
}

export interface TutorMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
}

export interface DrawingState {
  color: string;
  lineWidth: number;
  tool: Tool;
}
