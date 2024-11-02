import React, { useState } from 'react';
import { EyeIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const LAYER_CONFIG = {
  tricks: {
    label: 'Tricks',
    icon: '🛹',
    color: 'from-indigo-500 to-indigo-600'
  },
  events: {
    label: 'Sessions',
    icon: '📅',
    color: 'from-pink-500 to-pink-600'
  },
  shops: {
    label: 'Shops',
    icon: '🏪',
    color: 'from-emerald-500 to-emerald-600'
  },
  parks: {
    label: 'Parks',
    icon: '🏟️',
    color: 'from-amber-500 to-amber-600'
  },
  spots: {
    label: 'Famous Spots',
    icon: '📍',
    color: 'from-violet-500 to-violet-600'
  }
};

function MapLayersControl({ layers = {}, onToggleLayer }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <div className={`
        bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg 
        transition-all duration-200 ease-in-out overflow-hidden
        ${isCollapsed ? 'w-10 h-10' : 'w-44 p-3'}
      `}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700
            transition-transform duration-200
            ${isCollapsed ? 'rotate-180 relative w-full h-full flex items-center justify-center' : ''}
          `}
        >
          {isCollapsed ? (
            <EyeIcon className="w-5 h-5" />
          ) : (
            <ChevronDownIcon className="w-5 h-5" />
          )}
        </button>

        {!isCollapsed && (
          <>
            <h3 className="text-xs font-medium text-gray-700 mb-2">Map Layers</h3>
            <div className="space-y-1">
              {Object.entries(LAYER_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => onToggleLayer?.(key)}
                  className="w-full flex items-center justify-between p-1.5 hover:bg-black/5 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{config.icon}</span>
                    <span className="text-xs font-medium text-gray-700">{config.label}</span>
                  </div>
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center
                    transition-colors duration-200
                    ${layers[key] ? 
                      `bg-gradient-to-r ${config.color} shadow-sm` : 
                      'bg-gray-200'
                    }
                  `}>
                    <EyeIcon 
                      className={`w-3 h-3 transition-opacity duration-200 
                        ${layers[key] ? 'text-white' : 'text-gray-400'}
                        ${layers[key] ? 'opacity-100' : 'opacity-50'}
                      `}
                    />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MapLayersControl;