import React, { useState } from 'react';
import { MapIcon, UserIcon, MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { SKATEPARKS } from '../data/skateparks';
import { SKATESHOPS } from '../data/skateshops';
import { useGeocoding } from '../hooks/useGeocoding';

export default function Header({ 
  onViewportChange, 
  onSetHomeSkatepark,
  onSkateparkSelect,
  onSkateshopSelect
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { searchAddress, loading, error, suggestions = [] } = useGeocoding();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const location = await searchAddress(searchQuery);
    if (location) {
      onViewportChange({
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: 16
      });
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  return (
    <header className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white h-14 shadow-lg">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
            <span className="text-xl">🛹</span>
            <h1 className="text-lg font-bold tracking-tight">Skate.Spot</h1>
          </div>
        </div>
        
        <div className="flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Find spots anywhere in the US..."
                className="w-full px-4 py-1.5 pl-10 rounded-full bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white/40 transition-colors text-sm"
              />
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                </div>
              )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden z-50">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-900 text-sm"
                  >
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">{suggestion.mainText}</p>
                      {suggestion.secondaryText && (
                        <p className="text-xs text-gray-500">{suggestion.secondaryText}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>
          {error && (
            <p className="text-red-200 text-xs mt-1">{error}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
            <UserIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}