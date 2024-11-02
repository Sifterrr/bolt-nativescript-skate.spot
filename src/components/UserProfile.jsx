import React, { useState } from 'react';
import { UserIcon, UserGroupIcon, PencilIcon, CameraIcon } from '@heroicons/react/24/outline';

export default function UserProfile({ username, updateUsername, onToggleFriends, friendCount }) {
  const [editing, setEditing] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [newUsername, setNewUsername] = useState(username);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUsername(newUsername);
    setEditing(false);
  };

  return (
    <div className="p-3 bg-white rounded-lg shadow-sm mb-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-gray-500" />
            </div>
            <label className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1 cursor-pointer shadow-md">
              <CameraIcon className="h-3 w-3 text-white" />
              <input type="file" className="hidden" onChange={() => {}} accept="image/*" />
            </label>
          </div>
          {editing ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="px-2 py-1 border rounded text-sm"
                minLength={3}
                required
              />
              <button
                type="submit"
                className="px-2 py-1 bg-indigo-600 text-white rounded text-xs"
              >
                Save
              </button>
            </form>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm">Skating as: <strong>{username}</strong></span>
              <button
                onClick={() => setEditing(true)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                <PencilIcon className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleFriends}
            className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 text-xs"
          >
            <UserGroupIcon className="h-4 w-4" />
            <span>{friendCount}</span>
          </button>
          <button
            onClick={() => setShowProfileForm(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Edit Profile"
          >
            <PencilIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}