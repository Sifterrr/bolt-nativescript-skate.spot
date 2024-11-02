import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import SpotMap from './SpotMap';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Layout({ 
  children, 
  spots, 
  viewport, 
  onViewportChange, 
  selectedSpot, 
  onMarkerClick,
  onMapClick,
  selectedLocation,
  homeSkatepark,
  onSkateparkSelect,
  mapBounds
}) {
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(25);
  const sidebarRef = useRef(null);
  const resizeRef = useRef(null);
  const isResizingRef = useRef(false);

  useEffect(() => {
    const map = document.querySelector('.leaflet-container');
    if (map) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    }
  }, [isMapFullscreen, sidebarWidth]);

  const handleExitFullscreen = (e) => {
    e.stopPropagation();
    setIsMapFullscreen(false);
    setIsSidebarVisible(true);
  };

  const handleToggleSidebar = (e) => {
    e.stopPropagation();
    if (isMapFullscreen) {
      handleExitFullscreen(e);
    } else {
      setIsSidebarVisible(!isSidebarVisible);
    }
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };

  const handleResizeMove = (e) => {
    e.stopPropagation();
    if (!isResizingRef.current) return;
    
    const containerWidth = document.body.clientWidth;
    const newWidth = (e.clientX / containerWidth) * 100;
    const clampedWidth = Math.min(Math.max(newWidth, 20), 50);
    setSidebarWidth(clampedWidth);
  };

  const handleResizeEnd = (e) => {
    e.stopPropagation();
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        onViewportChange={onViewportChange} 
        onSkateparkSelect={onSkateparkSelect}
      />
      <div className="flex h-[calc(100vh-64px)] relative">
        <div 
          ref={sidebarRef}
          className={`
            fixed md:relative h-[calc(100vh-64px)] 
            overflow-auto bg-gray-100 transition-transform 
            duration-300 ease-in-out z-10
            ${!isSidebarVisible || isMapFullscreen ? 
              '-translate-x-full md:translate-x-[-100%]' : 
              'translate-x-0'
            }
          `}
          style={{ width: `${sidebarWidth}%` }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
          
          <div
            ref={resizeRef}
            className="absolute top-0 right-0 w-1 h-full cursor-ew-resize group"
            onMouseDown={handleResizeStart}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-y-0 right-0 w-1 bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div 
          className={`
            fixed h-[calc(100vh-64px)] transition-all duration-300 
            ease-in-out bg-white
            ${isMapFullscreen ? 
              'inset-x-0' : 
              isSidebarVisible ? 
                'right-0' : 
                'inset-x-0'
            }
          `}
          style={{ 
            left: isSidebarVisible && !isMapFullscreen ? `${sidebarWidth}%` : 0 
          }}
        >
          <button
            onClick={handleToggleSidebar}
            className={`
              absolute top-4 ${isMapFullscreen ? 'left-4' : 'left-4 md:left-4'}
              z-20 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 
              transition-all duration-200 group
            `}
            aria-label={isSidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
          >
            {!isSidebarVisible || isMapFullscreen ? (
              <ArrowRightIcon className="h-5 w-5 text-gray-700 group-hover:text-gray-900" />
            ) : (
              <ArrowLeftIcon className="h-5 w-5 text-gray-700 group-hover:text-gray-900" />
            )}
          </button>

          {isMapFullscreen && (
            <button
              onClick={handleExitFullscreen}
              className="absolute top-4 right-4 z-20 px-4 py-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Exit Fullscreen
            </button>
          )}

          <div className="w-full h-full">
            <SpotMap
              viewport={viewport}
              onViewportChange={onViewportChange}
              spots={spots}
              selectedSpot={selectedSpot}
              onMarkerClick={onMarkerClick}
              onMapClick={onMapClick}
              selectedLocation={selectedLocation}
              homeSkatepark={homeSkatepark}
              mapBounds={mapBounds}
              isFullscreen={isMapFullscreen}
              onToggleFullscreen={() => setIsMapFullscreen(!isMapFullscreen)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}