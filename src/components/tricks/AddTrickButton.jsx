import React from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function AddTrickButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
      aria-label="Add new trick"
    >
      <PlusIcon className="h-8 w-8" />
    </button>
  );
}