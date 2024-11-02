import React from 'react';
import { MapIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function TabView({ activeTab, onTabChange }) {
  return (
    <div className="flex border-b border-gray-200 mb-4">
      <button
        className={`flex items-center px-4 py-2 space-x-2 border-b-2 ${
          activeTab === 'tricks'
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onTabChange('tricks')}
      >
        <MapIcon className="h-5 w-5" />
        <span>Tricks</span>
      </button>
      
      <button
        className={`flex items-center px-4 py-2 space-x-2 border-b-2 ${
          activeTab === 'events'
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onTabChange('events')}
      >
        <CalendarIcon className="h-5 w-5" />
        <span>Skate Dates</span>
      </button>
    </div>
  );
}