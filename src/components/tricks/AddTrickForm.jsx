import React, { useState } from 'react';
import { XMarkIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

export default function AddTrickForm({ onSubmit, onCancel }) {
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
    media: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map(file => ({
      file,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      preview: URL.createObjectURL(file)
    }));
    setFormData(prev => ({
      ...prev,
      media: [...prev.media, ...newMedia]
    }));
  };

  const removeMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Add New Trick</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Media</label>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {formData.media.map((media, index) => (
                  <div key={index} className="relative group">
                    {media.type === 'video' ? (
                      <video
                        src={media.preview}
                        className="w-full h-32 object-cover rounded-lg"
                        controls
                      />
                    ) : (
                      <img
                        src={media.preview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <label className="relative block w-full h-32 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="sr-only"
                    multiple
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                    <div className="flex gap-2">
                      <PhotoIcon className="h-6 w-6" />
                      <VideoCameraIcon className="h-6 w-6" />
                    </div>
                    <span className="text-sm mt-1">Add photos/videos</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trick Name</label>
                <input
                  type="text"
                  value={formData.trickName}
                  onChange={(e) => setFormData({...formData, trickName: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location Name</label>
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => setFormData({...formData, locationName: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                rows="3"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tries</label>
                <input
                  type="number"
                  value={formData.tries}
                  onChange={(e) => setFormData({...formData, tries: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stance</label>
                <select
                  value={formData.stance}
                  onChange={(e) => setFormData({...formData, stance: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                >
                  <option value="regular">Regular</option>
                  <option value="goofy">Goofy</option>
                  <option value="switch">Switch</option>
                  <option value="fakie">Fakie</option>
                  <option value="nollie">Nollie</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Setup</h3>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Deck"
                  value={formData.setup.deck}
                  onChange={(e) => setFormData({
                    ...formData,
                    setup: {...formData.setup, deck: e.target.value}
                  })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Trucks"
                  value={formData.setup.trucks}
                  onChange={(e) => setFormData({
                    ...formData,
                    setup: {...formData.setup, trucks: e.target.value}
                  })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Wheels"
                  value={formData.setup.wheels}
                  onChange={(e) => setFormData({
                    ...formData,
                    setup: {...formData.setup, wheels: e.target.value}
                  })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
            >
              Add Trick
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}