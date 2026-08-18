import React, { useState, useEffect } from 'react'
import UserCard from '../components/UserCard'
import Skeleton from '../components/Skeleton'

const mockUsers = [
  {
    name: 'Jane Doe',
    username: '@janedoe',
    bio: 'Full-stack developer. Open source enthusiast. Building cool stuff on the web.',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Jane',
    posts: 128,
    followers: '4.2k',
    following: 312,
  },
  {
    name: 'John Smith',
    username: '@johnsmith',
    bio: 'UI/UX designer & frontend engineer. Passionate about accessible, beautiful design.',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=John',
    posts: 74,
    followers: '2.1k',
    following: 198,
  },
  {
    name: 'Priya Patel',
    username: '@priyapatel',
    bio: 'DevOps engineer. Coffee lover. Contributing to open-source when I can.',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Priya',
    posts: 55,
    followers: '1.8k',
    following: 143,
  },
]

const Users = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setUsers(mockUsers)
      setLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-6 flex flex-wrap gap-6 items-start justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
      {loading
        ? mockUsers.map((_, i) => <Skeleton key={i} />)
        : users.map((user, i) => <UserCard key={i} user={user} />)
      }
    </div>
  )
}

export default Users