import React from 'react';

const MARKER_STYLES = {
  trick: {
    icon: '🛹',
    baseClass: 'bg-blue-500',
    hoverClass: 'bg-blue-600',
    selectedClass: 'bg-blue-700'
  },
  event: {
    icon: '📅',
    baseClass: 'bg-rose-500',
    hoverClass: 'bg-rose-600',
    selectedClass: 'bg-rose-700'
  },
  shop: {
    icon: '🏪',
    baseClass: 'bg-emerald-500',
    hoverClass: 'bg-emerald-600',
    selectedClass: 'bg-emerald-700'
  },
  park: {
    icon: '🏟️',
    baseClass: 'bg-amber-500',
    hoverClass: 'bg-amber-600',
    selectedClass: 'bg-amber-700'
  }
};

function MarkerIcon({ type, selected }) {
  const style = MARKER_STYLES[type] || MARKER_STYLES.trick;
  const baseClass = selected ? style.selectedClass : style.baseClass;

  return (
    <div className="relative group cursor-pointer transform transition-all duration-200 hover:scale-110">
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center text-lg
        shadow-lg ${baseClass} group-hover:${style.hoverClass}
        transition-colors duration-200
      `}>
        <span className="transform -translate-y-px">{style.icon}</span>
      </div>
      <div className={`
        absolute -bottom-1 left-1/2 transform -translate-x-1/2
        w-2 h-2 rounded-full ${baseClass} group-hover:${style.hoverClass}
        transition-colors duration-200
      `} />
    </div>
  );
}

export default MarkerIcon;