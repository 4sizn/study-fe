export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  status: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  adminId: string;
  joinMode: 'AUTO_APPROVE' | 'ADMIN_APPROVAL';
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  roomId: string;
  createdAt: string;
  user: User;
}

export interface RoomMember {
  id: string;
  userId: string;
  roomId: string;
  role: 'ADMIN' | 'MEMBER';
  joinedAt: string;
  user: User;
}

export interface JoinRequest {
  id: string;
  userId: string;
  roomId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}