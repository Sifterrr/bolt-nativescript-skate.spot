import React, { useState } from 'react';
import { UserPlusIcon, UserMinusIcon, TrashIcon, MapPinIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function EventList({ events, userId, onDelete, onMarkerClick }) {
  const [expandedEvents, setExpandedEvents] = useState({});

  const toggleEvent = (eventId) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isParticipating = (event) => {
    return event.participants.some(p => p.userId === userId);
  };

  const handleMarkerClick = (event) => {
    if (onMarkerClick) {
      onMarkerClick(event);
      setExpandedEvents(prev => ({
        ...prev,
        [event.id]: true
      }));
    }
  };

  return (
    <div className="p-2">
      <div className="grid gap-2">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-xl shadow hover:shadow-md transition-shadow">
            <div 
              onClick={() => toggleEvent(event.id)}
              className="p-3 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                  <span className="text-lg">🎥</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">{event.title}</h2>
                  <p className="text-xs text-rose-600">{formatDate(event.eventDate)}</p>
                </div>
              </div>
              <ChevronDownIcon 
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  expandedEvents[event.id] ? 'rotate-180' : ''
                }`}
              />
            </div>
            
            {expandedEvents[event.id] && (
              <div className="px-3 pb-3 pt-1 border-t border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs text-gray-600">{event.locationName}</p>
                    <p className="text-xs text-gray-700 mt-1">{event.description}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMarkerClick(event)}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                      title="Show on map"
                    >
                      <MapPinIcon className="h-4 w-4" />
                    </button>
                    <button
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                        isParticipating(event)
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                    >
                      {isParticipating(event) ? (
                        <>
                          <UserMinusIcon className="h-3 w-3" />
                          <span>Leave</span>
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="h-3 w-3" />
                          <span>Join</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => onDelete?.(event.id)}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 text-red-500 rounded-full transition-colors"
                      title="Delete event"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="bg-gray-50 p-1.5 rounded">
                    <span className="text-gray-500">Level:</span> {event.skillLevel}
                  </div>
                  <div className="bg-gray-50 p-1.5 rounded">
                    <span className="text-gray-500">Spots:</span> {event.participants.length}/{event.maxParticipants}
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-100">
                  <img
                    src={`https://ui-avatars.com/api/?name=${event.username}&background=random&size=20`}
                    alt={event.username}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-xs text-gray-500">By <span className="text-rose-600">{event.username}</span></span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}