import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

function MapPopup({ info, onClose }) {
  if (!info) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">
          {info.trickName || info.title || info.name}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {info.photoUrl && (
        <img
          src={info.photoUrl}
          alt={info.trickName || info.title || info.name}
          className="w-full h-32 object-cover rounded mb-2"
        />
      )}

      <div className="text-sm text-gray-600">
        {info.locationName && <p>{info.locationName}</p>}
        {info.address && <p>{info.address}</p>}
        {info.description && <p className="mt-1">{info.description}</p>}
        
        {info.hours && (
          <p className="mt-1">
            <span className="font-medium">Hours:</span> {info.hours}
          </p>
        )}
        
        {info.phone && (
          <p>
            <span className="font-medium">Phone:</span> {info.phone}
          </p>
        )}
        
        {info.website && (
          <a
            href={info.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 block mt-1"
          >
            Visit Website
          </a>
        )}

        {info.features && info.features.length > 0 && (
          <div className="mt-2">
            <span className="font-medium">Features:</span>
            <ul className="list-disc list-inside ml-2">
              {info.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapPopup;