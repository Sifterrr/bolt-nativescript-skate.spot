import React, { useState } from 'react';
import { TrashIcon, MapPinIcon, HeartIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

export default function TrickList({ tricks, onDelete, onMarkerClick }) {
  const [expandedTricks, setExpandedTricks] = useState({});
  const [likedTricks, setLikedTricks] = useState({});

  const toggleTrick = (trickId) => {
    setExpandedTricks(prev => ({
      ...prev,
      [trickId]: !prev[trickId]
    }));
  };

  const toggleLike = (trickId, e) => {
    e.stopPropagation();
    setLikedTricks(prev => ({
      ...prev,
      [trickId]: !prev[trickId]
    }));
  };

  const handleMarkerClick = (trick) => {
    if (onMarkerClick) {
      onMarkerClick(trick);
      setExpandedTricks(prev => ({
        ...prev,
        [trick.id]: true
      }));
    }
  };

  return (
    <div className="p-2">
      <div className="grid gap-2">
        {tricks.map(trick => (
          <div key={trick.id} className="bg-white rounded-xl shadow hover:shadow-md transition-shadow">
            <div 
              onClick={() => toggleTrick(trick.id)}
              className="p-3 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={trick.photoUrl}
                  alt={trick.trickName}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div>
                  <h2 className="text-sm font-bold text-gray-900">{trick.trickName}</h2>
                  <p className="text-xs text-indigo-600">{trick.locationName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => toggleLike(trick.id, e)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {likedTricks[trick.id] ? (
                    <HeartIconSolid className="h-4 w-4 text-red-500" />
                  ) : (
                    <HeartIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                <ChevronDownIcon 
                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                    expandedTricks[trick.id] ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>
            
            {expandedTricks[trick.id] && (
              <div className="px-3 pb-3 pt-1 border-t border-gray-100">
                <div className="relative mb-3">
                  <img
                    src={trick.photoUrl}
                    alt={trick.trickName}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => handleMarkerClick(trick)}
                      className="p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
                      title="Show on map"
                    >
                      <MapPinIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete?.(trick.id)}
                      className="p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
                      title="Delete trick"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-700 mb-2">{trick.description}</p>
                
                <div className="grid grid-cols-2 gap-1 text-xs mb-2">
                  <div className="bg-gray-50 p-1.5 rounded">
                    <span className="text-gray-500">Tries:</span> {trick.tries}
                  </div>
                  <div className="bg-gray-50 p-1.5 rounded">
                    <span className="text-gray-500">Stance:</span> {trick.stance}
                  </div>
                </div>
                
                {trick.setup && Object.values(trick.setup).some(v => v) && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-500 mb-1">Setup</p>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      {trick.setup.deck && (
                        <div className="bg-gray-50 p-1.5 rounded">
                          <span className="text-gray-500">Deck:</span> {trick.setup.deck}
                        </div>
                      )}
                      {trick.setup.trucks && (
                        <div className="bg-gray-50 p-1.5 rounded">
                          <span className="text-gray-500">Trucks:</span> {trick.setup.trucks}
                        </div>
                      )}
                      {trick.setup.wheels && (
                        <div className="bg-gray-50 p-1.5 rounded">
                          <span className="text-gray-500">Wheels:</span> {trick.setup.wheels}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}