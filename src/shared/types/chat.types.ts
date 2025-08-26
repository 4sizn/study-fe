export interface Message {
  id: string
  roomId: string
  userId: string
  username: string
  content: string
  timestamp: string
  type: 'text' | 'system'
}

export interface ChatState {
  messages: Record<string, Message[]>
  isConnected: boolean
  currentRoomId: string | null
}

export interface SendMessageData {
  roomId: string
  content: string
}

export interface JoinRoomData {
  roomId: string
  userId: string
  username: string
}

export interface LeaveRoomData {
  roomId: string
  userId: string
  username: string
}