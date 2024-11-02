import React from 'react';

export default function SpotList({ spots }) {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4">
      <div className="grid gap-4">
        {spots.map(spot => (
          <div key={spot.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex gap-4">
              <img
                src={spot.photoUrl}
                alt={spot.trickName}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold">{spot.trickName}</h2>
                <p className="text-gray-600">{spot.locationName}</p>
                <p className="text-sm text-gray-500">{spot.coordinates}</p>
                <p className="text-sm text-gray-700 mt-1">{spot.description}</p>
                <p className="text-sm text-blue-600">Added by: {spot.username}</p>
              </div>
            </div>
            
            {spot.tries && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-sm">Tries: {spot.tries}</p>
                <p className="text-sm">Stance: {spot.stance}</p>
                {spot.setup && (
                  <div className="text-sm">
                    <p>Setup:</p>
                    <ul className="list-disc list-inside pl-2">
                      {spot.setup.deck && <li>Deck: {spot.setup.deck}</li>}
                      {spot.setup.trucks && <li>Trucks: {spot.setup.trucks}</li>}
                      {spot.setup.wheels && <li>Wheels: {spot.setup.wheels}</li>}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {spot.nextEvent && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-sm font-medium text-blue-600">
                  Next Session: {formatDate(spot.nextEvent)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}