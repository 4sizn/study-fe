import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { fetchRoomMembers } from '../model'
import type { RoomMember } from '@/shared/types'

interface MemberListProps {
  roomId: string
  isVisible: boolean
  onClose: () => void
}

export const MemberList = ({ roomId, isVisible, onClose }: MemberListProps) => {
  const dispatch = useAppDispatch()
  const { roomMembers } = useAppSelector(state => state.rooms)
  
  const members = roomMembers[roomId] || []

  useEffect(() => {
    if (isVisible && roomId) {
      dispatch(fetchRoomMembers(roomId))
    }
  }, [isVisible, roomId, dispatch])

  const mockMembers: RoomMember[] = [
    {
      id: '1',
      userId: 'user1',
      username: '스터디장',
      role: 'owner',
      joinedAt: '2024-01-15T09:00:00Z',
      isOnline: true
    },
    {
      id: '2',
      userId: 'user2',
      username: '참여자1',
      role: 'member',
      joinedAt: '2024-01-16T10:30:00Z',
      isOnline: true
    },
    {
      id: '3',
      userId: 'user3',
      username: '참여자2',
      role: 'member',
      joinedAt: '2024-01-17T14:20:00Z',
      isOnline: false
    },
    {
      id: '4',
      userId: 'user4',
      username: '참여자3',
      role: 'member',
      joinedAt: '2024-01-18T11:15:00Z',
      isOnline: true
    },
    {
      id: '5',
      userId: 'user5',
      username: '참여자4',
      role: 'member',
      joinedAt: '2024-01-19T16:45:00Z',
      isOnline: false
    }
  ]

  const displayMembers = members.length > 0 ? members : mockMembers

  if (!isVisible) return null

  const formatJoinDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    })
  }

  const onlineCount = displayMembers.filter(member => member.isOnline).length

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">멤버 목록</h2>
          <p className="text-sm text-gray-600">
            온라인: {onlineCount} / 전체: {displayMembers.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
          aria-label="닫기"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {displayMembers
            .sort((a, b) => {
              if (a.isOnline && !b.isOnline) return -1
              if (!a.isOnline && b.isOnline) return 1
              if (a.role === 'owner' && b.role !== 'owner') return -1
              if (a.role !== 'owner' && b.role === 'owner') return 1
              return 0
            })
            .map(member => (
              <div
                key={member.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  member.isOnline
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        member.role === 'owner'
                          ? 'bg-purple-500'
                          : member.isOnline
                          ? 'bg-green-500'
                          : 'bg-gray-400'
                      }`}
                    >
                      {member.username.charAt(0)}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        member.isOnline ? 'bg-green-400' : 'bg-gray-300'
                      }`}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${member.isOnline ? 'text-gray-900' : 'text-gray-500'}`}>
                        {member.username}
                      </span>
                      {member.role === 'owner' && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                          방장
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatJoinDate(member.joinedAt)} 참여
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end text-xs text-gray-500">
                  <span className={member.isOnline ? 'text-green-600' : 'text-gray-400'}>
                    {member.isOnline ? '온라인' : '오프라인'}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 text-center">
          실시간으로 업데이트됩니다
        </div>
      </div>
    </div>
  )
}