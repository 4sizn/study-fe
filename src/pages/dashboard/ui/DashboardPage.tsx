import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '@/shared/ui'

interface Room {
  id: string
  name: string
  description: string
  memberCount: number
  maxMembers: number
  createdAt: string
}

export const DashboardPage = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<Room[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    maxMembers: 10
  })

  useEffect(() => {
    const mockRooms: Room[] = [
      {
        id: '1',
        name: 'Frontend 스터디',
        description: 'React와 TypeScript를 함께 공부해요',
        memberCount: 5,
        maxMembers: 10,
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        name: '알고리즘 스터디',
        description: '매주 문제를 풀어요',
        memberCount: 8,
        maxMembers: 12,
        createdAt: '2024-01-10'
      }
    ]
    setRooms(mockRooms)
  }, [])

  const handleCreateRoom = () => {
    if (!newRoom.name.trim()) return

    const room: Room = {
      id: Date.now().toString(),
      name: newRoom.name,
      description: newRoom.description,
      memberCount: 1,
      maxMembers: newRoom.maxMembers,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setRooms([...rooms, room])
    setNewRoom({ name: '', description: '', maxMembers: 10 })
    setShowCreateModal(false)
  }

  const handleJoinRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId)
    if (room && room.memberCount < room.maxMembers) {
      setRooms(rooms.map(room => 
        room.id === roomId
          ? { ...room, memberCount: room.memberCount + 1 }
          : room
      ))
      navigate(`/room/${roomId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h1>
            <p className="text-gray-600">참여할 수 있는 스터디룸을 찾아보세요</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            새 룸 만들기
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div key={room.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.name}</h3>
                <p className="text-gray-600 text-sm">{room.description}</p>
              </div>
              
              <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                <span>멤버: {room.memberCount}/{room.maxMembers}</span>
                <span>{room.createdAt}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(room.memberCount / room.maxMembers) * 100}%` }}
                  />
                </div>
                <Button
                  onClick={() => handleJoinRoom(room.id)}
                  disabled={room.memberCount >= room.maxMembers}
                  className={`px-4 py-2 text-sm ${
                    room.memberCount >= room.maxMembers
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {room.memberCount >= room.maxMembers ? '가득참' : '참여하기'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">새 스터디룸 만들기</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    룸 이름 *
                  </label>
                  <Input
                    value={newRoom.name}
                    onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                    placeholder="룸 이름을 입력하세요"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    룸 설명
                  </label>
                  <textarea
                    value={newRoom.description}
                    onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                    placeholder="룸 설명을 입력하세요"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최대 멤버 수
                  </label>
                  <Input
                    type="number"
                    value={newRoom.maxMembers}
                    onChange={(e) => setNewRoom({ ...newRoom, maxMembers: Number(e.target.value) })}
                    min={2}
                    max={50}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300"
                >
                  취소
                </Button>
                <Button
                  onClick={handleCreateRoom}
                  disabled={!newRoom.name.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  만들기
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}