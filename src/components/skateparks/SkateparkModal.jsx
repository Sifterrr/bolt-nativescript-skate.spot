import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function SkateparkModal({ skatepark, onClose, onSetAsHome }) {
  if (!skatepark) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{skatepark.name}</h2>
            <p className="text-gray-600">{skatepark.city}, {skatepark.state}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <img
          src={skatepark.photoUrl}
          alt={skatepark.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />

        <p className="text-gray-700 mb-4">{skatepark.description}</p>
        <p className="text-gray-600 mb-4">{skatepark.address}</p>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
          <button
            onClick={() => {
              onSetAsHome(skatepark);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Set as Home Park
          </button>
        </div>
      </div>
    </div>
  );
}