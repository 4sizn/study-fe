import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { roomsService } from '../api'
import type { Room, CreateRoomRequest, RoomMember } from '@/shared/types'

export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async () => {
    return await roomsService.getAllRooms()
  }
)

export const createRoom = createAsyncThunk(
  'rooms/createRoom',
  async (roomData: CreateRoomRequest) => {
    return await roomsService.createRoom(roomData)
  }
)

export const joinRoom = createAsyncThunk(
  'rooms/joinRoom',
  async (roomId: string) => {
    await roomsService.joinRoom({ roomId })
    return roomId
  }
)

export const fetchRoomMembers = createAsyncThunk(
  'rooms/fetchRoomMembers',
  async (roomId: string) => {
    const members = await roomsService.getRoomMembers(roomId)
    return { roomId, members }
  }
)

interface RoomsState {
  rooms: Room[]
  currentRoom: Room | null
  roomMembers: Record<string, RoomMember[]>
  isLoading: boolean
  error: string | null
}

const initialState: RoomsState = {
  rooms: [],
  currentRoom: null,
  roomMembers: {},
  isLoading: false,
  error: null
}

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setCurrentRoom: (state, action: PayloadAction<Room | null>) => {
      state.currentRoom = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    updateRoomMemberCount: (state, action: PayloadAction<{ roomId: string; increment: boolean }>) => {
      const { roomId, increment } = action.payload
      const room = state.rooms.find(r => r.id === roomId)
      if (room) {
        room.memberCount += increment ? 1 : -1
      }
      if (state.currentRoom?.id === roomId) {
        state.currentRoom.memberCount += increment ? 1 : -1
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.isLoading = false
        state.rooms = action.payload
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch rooms'
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.rooms.push(action.payload)
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create room'
      })
      .addCase(joinRoom.fulfilled, (state, action) => {
        const roomId = action.payload
        const room = state.rooms.find(r => r.id === roomId)
        if (room && room.memberCount < room.maxMembers) {
          room.memberCount += 1
        }
      })
      .addCase(joinRoom.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to join room'
      })
      .addCase(fetchRoomMembers.fulfilled, (state, action) => {
        const { roomId, members } = action.payload
        state.roomMembers[roomId] = members
      })
  }
})

export const { setCurrentRoom, clearError, updateRoomMemberCount } = roomsSlice.actions
export default roomsSlice.reducer