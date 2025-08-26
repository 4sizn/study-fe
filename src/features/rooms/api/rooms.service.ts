import { httpClient } from '@/shared/lib'
import type { Room, CreateRoomRequest, JoinRoomRequest, RoomMember } from '@/shared/types'

export const roomsService = {
  getAllRooms: async (): Promise<Room[]> => {
    const response = await httpClient.get<Room[]>('/api/rooms')
    return response.data
  },

  getRoomById: async (roomId: string): Promise<Room> => {
    const response = await httpClient.get<Room>(`/api/rooms/${roomId}`)
    return response.data
  },

  createRoom: async (roomData: CreateRoomRequest): Promise<Room> => {
    const response = await httpClient.post<Room>('/api/rooms', roomData)
    return response.data
  },

  joinRoom: async (joinData: JoinRoomRequest): Promise<void> => {
    await httpClient.post(`/api/rooms/${joinData.roomId}/join`)
  },

  leaveRoom: async (roomId: string): Promise<void> => {
    await httpClient.delete(`/api/rooms/${roomId}/leave`)
  },

  getRoomMembers: async (roomId: string): Promise<RoomMember[]> => {
    const response = await httpClient.get<RoomMember[]>(`/api/rooms/${roomId}/members`)
    return response.data
  },

  updateRoom: async (roomId: string, roomData: Partial<CreateRoomRequest>): Promise<Room> => {
    const response = await httpClient.patch<Room>(`/api/rooms/${roomId}`, roomData)
    return response.data
  },

  deleteRoom: async (roomId: string): Promise<void> => {
    await httpClient.delete(`/api/rooms/${roomId}`)
  }
}