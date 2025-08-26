import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { fetchRoomMembers, setCurrentRoom } from '@/features/rooms/model'
import { MemberList } from '@/features/rooms/components'
import { useSocket } from '@/features/chat/hooks'
import { Button } from '@/shared/ui'
import type { Room, Message } from '@/shared/types'

export const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const { currentRoom, isLoading } = useAppSelector(state => state.rooms)
  const { messages } = useAppSelector(state => state.chat)
  const { connect, joinRoom, leaveRoom, sendMessage, isConnected } = useSocket()
  
  const roomMessages = roomId ? messages[roomId] || [] : []

  const [newMessage, setNewMessage] = useState('')
  const [showMembersPanel, setShowMembersPanel] = useState(false)

  useEffect(() => {
    if (!roomId) {
      navigate('/dashboard')
      return
    }

    connect()

    const mockRoom: Room = {
      id: roomId,
      name: 'Frontend 스터디',
      description: 'React와 TypeScript를 함께 공부해요',
      memberCount: 5,
      maxMembers: 10,
      createdAt: '2024-01-15',
      ownerId: 'user1',
      isActive: true
    }
    
    dispatch(setCurrentRoom(mockRoom))
    dispatch(fetchRoomMembers(roomId))

    if (isConnected) {
      joinRoom(roomId)
    }

    return () => {
      if (roomId) {
        leaveRoom(roomId)
      }
    }
  }, [roomId, dispatch, navigate, connect, joinRoom, leaveRoom, isConnected])

  useEffect(() => {
    if (isConnected && roomId) {
      joinRoom(roomId)
    }
  }, [isConnected, roomId, joinRoom])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !roomId) return

    sendMessage(roomId, newMessage)
    setNewMessage('')
  }

  const handleLeaveRoom = () => {
    if (window.confirm('정말로 룸을 나가시겠습니까?')) {
      navigate('/dashboard')
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">룸을 찾을 수 없습니다.</div>
          <Button onClick={() => navigate('/dashboard')}>
            대시보드로 돌아가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{currentRoom.name}</h1>
            <p className="text-sm text-gray-600">{currentRoom.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowMembersPanel(!showMembersPanel)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              멤버 ({currentRoom.memberCount})
            </Button>
            <Button
              onClick={handleLeaveRoom}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
            >
              나가기
            </Button>
          </div>
        </header>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {roomMessages.map(message => (
              <div key={message.id} className={`rounded-lg p-4 shadow-sm ${message.type === 'system' ? 'bg-gray-100' : 'bg-white'}`}>
                {message.type === 'system' ? (
                  <p className="text-center text-sm text-gray-600">{message.content}</p>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{message.username}</span>
                      <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                    </div>
                    <p className="text-gray-700">{message.content}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="메시지를 입력하세요..."
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !isConnected}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isConnected ? '전송' : '연결 중...'}
            </Button>
          </div>
        </div>
      </div>

      <MemberList 
        roomId={roomId || ''}
        isVisible={showMembersPanel}
        onClose={() => setShowMembersPanel(false)}
      />
    </div>
  )
}