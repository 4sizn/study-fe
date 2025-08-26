export interface Room {
  id: string
  name: string
  description: string
  memberCount: number
  maxMembers: number
  createdAt: string
  ownerId: string
  isActive: boolean
  tags?: string[]
}

export interface RoomMember {
  id: string
  userId: string
  username: string
  role: 'owner' | 'member'
  joinedAt: string
  isOnline: boolean
}

export interface CreateRoomRequest {
  name: string
  description: string
  maxMembers: number
  tags?: string[]
}

export interface JoinRoomRequest {
  roomId: string
}