import React from 'react'

const UserCard = ({ user }) => {
  const {
    name = 'Jane Doe',
    username = '@janedoe',
    bio = 'Full-stack developer. Open source enthusiast. Building cool stuff.',
    avatar = 'https://api.dicebear.com/9.x/avataaars/svg?seed=Jane',
    posts = 128,
    followers = '4.2k',
    following = 312,
  } = user || {}

  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header section with Avatar and User Details */}
      <div className="flex items-center gap-4">
        {/* Profile Avatar */}
        <img
          src={avatar}
          alt={name}
          className="h-14 w-14 rounded-full object-cover shrink-0 bg-gray-100"
        />

        {/* User Info (Name & Handle) */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{username}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="mt-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
        {bio}
      </p>

      {/* Meta Stats Grid */}
      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4 dark:border-gray-800 text-center">
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{posts}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Posts</p>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{followers}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{following}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Following</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex gap-3">
        <button className="h-9 flex-1 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
          Follow
        </button>
        <button className="h-9 w-20 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Message
        </button>
      </div>
    </div>
  )
}

export default UserCard