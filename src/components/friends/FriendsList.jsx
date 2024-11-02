import React, { useState } from 'react';
import { XMarkIcon, UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/outline';

export default function FriendsList({ friends, onClose, onAddFriend, onRemoveFriend }) {
  const [newFriendName, setNewFriendName] = useState('');

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (newFriendName.trim()) {
      onAddFriend({
        userId: `friend-${Date.now()}`,
        username: newFriendName.trim(),
        createdAt: new Date().toISOString()
      });
      setNewFriendName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Friends List</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleAddFriend} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              placeholder="Enter friend's name"
              className="flex-1 px-3 py-2 border rounded"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1"
            >
              <UserPlusIcon className="h-5 w-5" />
              Add
            </button>
          </div>
        </form>

        <div className="space-y-2">
          {friends.map(friend => (
            <div
              key={friend.userId}
              className="flex justify-between items-center p-3 bg-gray-50 rounded"
            >
              <span>{friend.username}</span>
              <button
                onClick={() => onRemoveFriend(friend.userId)}
                className="text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <UserMinusIcon className="h-5 w-5" />
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}