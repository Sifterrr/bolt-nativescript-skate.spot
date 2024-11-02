import React from 'react';
import { Popup } from 'react-leaflet';
import { 
  GlobeAltIcon, 
  PhoneIcon, 
  ClockIcon,
  MapPinIcon,
  LinkIcon,
  UserIcon,
  CalendarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function MarkerPopup({ item, type }) {
  const renderTrickContent = (trick) => (
    <div className="w-[240px]">
      <div className="flex items-start gap-2 mb-2">
        <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
          <SparklesIcon className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-sm">{trick.trickName}</h3>
          <p className="text-xs text-gray-500">{trick.locationName}</p>
        </div>
      </div>
      {trick.description && (
        <p className="text-xs text-gray-600 mb-2">{trick.description}</p>
      )}
      <div className="grid grid-cols-2 gap-1 text-xs">
        <div className="bg-gray-50 p-1.5 rounded">
          <span className="text-gray-500">Tries:</span> {trick.tries}
        </div>
        <div className="bg-gray-50 p-1.5 rounded">
          <span className="text-gray-500">Stance:</span> {trick.stance}
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-100">
        <UserIcon className="h-3 w-3 text-gray-400" />
        <span className="text-xs text-gray-500">Added by <span className="text-indigo-600">{trick.username}</span></span>
      </div>
    </div>
  );

  const renderEventContent = (event) => (
    <div className="w-[240px]">
      <div className="flex items-start gap-2 mb-2">
        <div className="p-1.5 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg">
          <CalendarIcon className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-sm">{event.title}</h3>
          <p className="text-xs text-gray-500">{event.locationName}</p>
        </div>
      </div>
      {event.description && (
        <p className="text-xs text-gray-600 mb-2">{event.description}</p>
      )}
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="h-3 w-3 text-gray-400" />
          <span>{new Date(event.eventDate).toLocaleDateString()}</span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="bg-gray-50 p-1.5 rounded">
            <span className="text-gray-500">Level:</span> {event.skillLevel}
          </div>
          <div className="bg-gray-50 p-1.5 rounded">
            <span className="text-gray-500">Spots:</span> {event.participants.length}/{event.maxParticipants}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-100">
        <UserIcon className="h-3 w-3 text-gray-400" />
        <span className="text-xs text-gray-500">By <span className="text-rose-600">{event.username}</span></span>
      </div>
    </div>
  );

  const renderShopContent = (shop) => (
    <div className="w-[240px]">
      <div className="flex items-start gap-2 mb-3">
        <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
          <MapPinIcon className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-sm">{shop.name}</h3>
          <p className="text-xs text-gray-500">{shop.address}</p>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        {shop.phone && (
          <a href={`tel:${shop.phone}`} className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900">
            <PhoneIcon className="h-3 w-3" />
            {shop.phone}
          </a>
        )}

        {shop.website && (
          <a 
            href={shop.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900"
          >
            <GlobeAltIcon className="h-3 w-3" />
            Visit Website
          </a>
        )}

        {shop.hours && (
          <div className="flex items-start gap-1.5">
            <ClockIcon className="h-3 w-3 text-gray-400 mt-0.5" />
            <span className="text-gray-600">{shop.hours}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderSkateparkContent = (park) => (
    <div className="w-[240px]">
      <div className="relative h-24 -mx-2 -mt-2 mb-2">
        <img
          src={park.photoUrl}
          alt={park.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="font-bold text-sm text-white">{park.name}</h3>
          <p className="text-xs text-white/80">
            {park.city}, {park.state}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-start gap-1.5">
          <MapPinIcon className="h-3 w-3 text-gray-400 mt-0.5" />
          <span className="text-gray-600">{park.address}</span>
        </div>

        {park.description && (
          <p className="text-gray-600">{park.description}</p>
        )}

        {park.features && park.features.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {park.features.map(feature => (
              <span 
                key={feature}
                className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-1">
          <div className="bg-gray-50 p-1.5 rounded">
            <span className="text-gray-500">Level:</span> {park.difficulty_level}
          </div>
          <div className="bg-gray-50 p-1.5 rounded">
            <span className="text-gray-500">Entry:</span> {park.is_free ? 'Free' : 'Paid'}
          </div>
        </div>

        {park.hours && (
          <div className="flex items-start gap-1.5">
            <ClockIcon className="h-3 w-3 text-gray-400 mt-0.5" />
            <span className="text-gray-600">{park.hours}</span>
          </div>
        )}
      </div>
    </div>
  );

  const getContent = () => {
    switch (type) {
      case 'trick':
        return renderTrickContent(item);
      case 'event':
        return renderEventContent(item);
      case 'shop':
        return renderShopContent(item);
      case 'skatepark':
        return renderSkateparkContent(item);
      default:
        return null;
    }
  };

  return (
    <Popup className="modern-popup">
      {getContent()}
    </Popup>
  );
}