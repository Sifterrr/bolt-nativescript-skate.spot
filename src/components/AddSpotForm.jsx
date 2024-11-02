import React, { useState } from 'react';

export default function AddSpotForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    trickName: '',
    locationName: '',
    description: '',
    tries: 1,
    stance: 'regular',
    setup: {
      deck: '',
      trucks: '',
      wheels: ''
    },
    eventDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Add New Spot</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Trick Name</label>
            <input
              type="text"
              value={formData.trickName}
              onChange={(e) => setFormData({...formData, trickName: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location Name</label>
            <input
              type="text"
              value={formData.locationName}
              onChange={(e) => setFormData({...formData, locationName: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Number of Tries</label>
            <input
              type="number"
              value={formData.tries}
              onChange={(e) => setFormData({...formData, tries: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border rounded"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stance</label>
            <select
              value={formData.stance}
              onChange={(e) => setFormData({...formData, stance: e.target.value})}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="regular">Regular</option>
              <option value="goofy">Goofy</option>
              <option value="switch">Switch</option>
              <option value="fakie">Fakie</option>
              <option value="nollie">Nollie</option>
            </select>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Setup</h3>
            <input
              type="text"
              placeholder="Deck"
              value={formData.setup.deck}
              onChange={(e) => setFormData({
                ...formData,
                setup: {...formData.setup, deck: e.target.value}
              })}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Trucks"
              value={formData.setup.trucks}
              onChange={(e) => setFormData({
                ...formData,
                setup: {...formData.setup, trucks: e.target.value}
              })}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Wheels"
              value={formData.setup.wheels}
              onChange={(e) => setFormData({
                ...formData,
                setup: {...formData.setup, wheels: e.target.value}
              })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Plan a Skate Session</label>
            <input
              type="datetime-local"
              value={formData.eventDate}
              onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Spot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}