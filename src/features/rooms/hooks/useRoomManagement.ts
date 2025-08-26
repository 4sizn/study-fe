import { useCallback } from 'react'
import { useAppDispatch } from '@/app/store/hooks'
import { createRoom, joinRoom as joinRoomAction, fetchRooms } from '../model'
import { roomsService } from '../api'
import type { CreateRoomRequest } from '@/shared/types'

export const useRoomManagement = () => {
  const dispatch = useAppDispatch()

  const createNewRoom = useCallback(async (roomData: CreateRoomRequest) => {
    try {
      const result = await dispatch(createRoom(roomData))
      if (createRoom.fulfilled.match(result)) {
        return result.payload
      }
      throw new Error('룸 생성에 실패했습니다.')
    } catch (error) {
      console.error('Create room error:', error)
      throw error
    }
  }, [dispatch])

  const joinExistingRoom = useCallback(async (roomId: string) => {
    try {
      await dispatch(joinRoomAction(roomId))
      return roomId
    } catch (error) {
      console.error('Join room error:', error)
      throw error
    }
  }, [dispatch])

  const leaveRoom = useCallback(async (roomId: string) => {
    try {
      await roomsService.leaveRoom(roomId)
      dispatch(fetchRooms())
    } catch (error) {
      console.error('Leave room error:', error)
      throw error
    }
  }, [dispatch])

  const updateRoom = useCallback(async (roomId: string, roomData: Partial<CreateRoomRequest>) => {
    try {
      const updatedRoom = await roomsService.updateRoom(roomId, roomData)
      dispatch(fetchRooms())
      return updatedRoom
    } catch (error) {
      console.error('Update room error:', error)
      throw error
    }
  }, [dispatch])

  const deleteRoom = useCallback(async (roomId: string) => {
    try {
      await roomsService.deleteRoom(roomId)
      dispatch(fetchRooms())
    } catch (error) {
      console.error('Delete room error:', error)
      throw error
    }
  }, [dispatch])

  return {
    createNewRoom,
    joinExistingRoom,
    leaveRoom,
    updateRoom,
    deleteRoom
  }
}