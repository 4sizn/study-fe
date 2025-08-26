import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Message, ChatState } from '@/shared/types'

const initialState: ChatState = {
  messages: {},
  isConnected: false,
  currentRoomId: null
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },
    setCurrentRoomId: (state, action: PayloadAction<string | null>) => {
      state.currentRoomId = action.payload
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload
      const roomId = message.roomId
      
      if (!state.messages[roomId]) {
        state.messages[roomId] = []
      }
      
      state.messages[roomId].push(message)
    },
    setRoomMessages: (state, action: PayloadAction<{ roomId: string; messages: Message[] }>) => {
      const { roomId, messages } = action.payload
      state.messages[roomId] = messages
    },
    clearRoomMessages: (state, action: PayloadAction<string>) => {
      const roomId = action.payload
      if (state.messages[roomId]) {
        state.messages[roomId] = []
      }
    },
    clearAllMessages: (state) => {
      state.messages = {}
    }
  }
})

export const {
  setConnected,
  setCurrentRoomId,
  addMessage,
  setRoomMessages,
  clearRoomMessages,
  clearAllMessages
} = chatSlice.actions

export default chatSlice.reducer