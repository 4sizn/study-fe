import { useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { socketService } from '@/shared/lib'
import { addMessage, setConnected, setCurrentRoomId } from '../model'
import { updateRoomMemberCount } from '../../rooms/model'
import type { Message } from '@/shared/types'

export const useSocket = () => {
  const dispatch = useAppDispatch()
  const { isConnected, currentRoomId } = useAppSelector(state => state.chat)
  const { user } = useAppSelector(state => state.auth)

  const connect = useCallback(() => {
    if (!isConnected && user) {
      const token = localStorage.getItem('token')
      const socket = socketService.connect(token)
      
      socket.on('connect', () => {
        dispatch(setConnected(true))
      })

      socket.on('disconnect', () => {
        dispatch(setConnected(false))
      })

      socket.on('new-message', (message: Message) => {
        dispatch(addMessage(message))
      })

      socket.on('user-joined', (data: { roomId: string; user: any }) => {
        dispatch(updateRoomMemberCount({ roomId: data.roomId, increment: true }))
        
        const systemMessage: Message = {
          id: `system-${Date.now()}`,
          roomId: data.roomId,
          userId: 'system',
          username: 'System',
          content: `${data.user.username}님이 입장하셨습니다.`,
          timestamp: new Date().toISOString(),
          type: 'system'
        }
        
        dispatch(addMessage(systemMessage))
      })

      socket.on('user-left', (data: { roomId: string; user: any }) => {
        dispatch(updateRoomMemberCount({ roomId: data.roomId, increment: false }))
        
        const systemMessage: Message = {
          id: `system-${Date.now()}`,
          roomId: data.roomId,
          userId: 'system',
          username: 'System',
          content: `${data.user.username}님이 퇴장하셨습니다.`,
          timestamp: new Date().toISOString(),
          type: 'system'
        }
        
        dispatch(addMessage(systemMessage))
      })
    }
  }, [isConnected, user, dispatch])

  const disconnect = useCallback(() => {
    socketService.disconnect()
    dispatch(setConnected(false))
    dispatch(setCurrentRoomId(null))
  }, [dispatch])

  const joinRoom = useCallback((roomId: string) => {
    if (isConnected) {
      socketService.joinRoom(roomId)
      dispatch(setCurrentRoomId(roomId))
    }
  }, [isConnected, dispatch])

  const leaveRoom = useCallback((roomId: string) => {
    if (isConnected) {
      socketService.leaveRoom(roomId)
      if (currentRoomId === roomId) {
        dispatch(setCurrentRoomId(null))
      }
    }
  }, [isConnected, currentRoomId, dispatch])

  const sendMessage = useCallback((roomId: string, content: string) => {
    if (isConnected && user) {
      socketService.sendMessage(roomId, content)
    }
  }, [isConnected, user])

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    isConnected,
    currentRoomId,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    sendMessage
  }
}