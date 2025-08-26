export const API_BASE_URL = 'http://localhost:3000';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  USERS: '/users',
  ROOMS: '/rooms',
  MESSAGES: '/messages',
  JOIN_REQUESTS: '/join-requests',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  MESSAGE: 'message',
  NEW_MESSAGE: 'newMessage',
  USER_JOINED: 'userJoined',
  USER_LEFT: 'userLeft',
  TYPING: 'typing',
  STOP_TYPING: 'stopTyping',
} as const;