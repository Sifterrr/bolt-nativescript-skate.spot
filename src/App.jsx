import React, { useState } from 'react';
import Layout from './components/Layout';
import TabView from './components/TabView';
import TrickList from './components/tricks/TrickList';
import EventList from './components/events/EventList';
import AddTrickForm from './components/tricks/AddTrickForm';
import AddEventForm from './components/events/AddEventForm';
import UserProfile from './components/UserProfile';
import FriendsList from './components/friends/FriendsList';
import SkateparkModal from './components/skateparks/SkateparkModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_FRIENDS } from './data/friendsData';

// USA bounds
const USA_BOUNDS = {
  center: {
    latitude: 39.8283,
    longitude: -98.5795
  },
  zoom: 4,
  minZoom: 3,
  maxZoom: 18,
  bounds: {
    north: 49.3457868, // Top of continental USA
    south: 24.396308,  // Bottom of Florida
    east: -66.945392,  // East coast
    west: -124.848974  // West coast
  }
};

function App() {
  // Persistent state using localStorage
  const [tricks, setTricks] = useLocalStorage('skate-tricks', []);
  const [events, setEvents] = useLocalStorage('skate-events', []);
  const [friends, setFriends] = useLocalStorage('skate-friends', INITIAL_FRIENDS);
  const [homeSkatepark, setHomeSkatepark] = useLocalStorage('home-skatepark', null);
  const [username, setUsername] = useLocalStorage('username', 'Skater');

  // Regular state
  const [activeTab, setActiveTab] = useState('tricks');
  const [viewport, setViewport] = useState({
    latitude: USA_BOUNDS.center.latitude,
    longitude: USA_BOUNDS.center.longitude,
    zoom: USA_BOUNDS.zoom
  });
  const [showAddTrick, setShowAddTrick] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [selectedSkatepark, setSelectedSkatepark] = useState(null);
  const [showFriends, setShowFriends] = useState(false);
  const [userId] = useState('user-1');

  const handleViewportChange = (newViewport) => {
    // Ensure the viewport stays within USA bounds
    const lat = Math.min(Math.max(newViewport.latitude, USA_BOUNDS.bounds.south), USA_BOUNDS.bounds.north);
    const lng = Math.min(Math.max(newViewport.longitude, USA_BOUNDS.bounds.west), USA_BOUNDS.bounds.east);
    const zoom = Math.min(Math.max(newViewport.zoom, USA_BOUNDS.minZoom), USA_BOUNDS.maxZoom);

    setViewport({
      latitude: lat,
      longitude: lng,
      zoom: zoom
    });
  };

  const handleMapClick = (event) => {
    if (!showAddTrick && !showAddEvent) {
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;

      // Only allow clicks within USA bounds
      if (lat >= USA_BOUNDS.bounds.south && 
          lat <= USA_BOUNDS.bounds.north && 
          lng >= USA_BOUNDS.bounds.west && 
          lng <= USA_BOUNDS.bounds.east) {
        setSelectedLocation({
          lat: lat,
          lng: lng
        });
      }
    }
  };

  const handleSetHomeSkatepark = (park) => {
    setHomeSkatepark({
      id: park.id,
      name: park.name,
      lat: park.lat,
      lng: park.lng,
      photoUrl: park.photoUrl
    });
    setSelectedLocation(null);
  };

  const handleDeleteTrick = (trickId) => {
    setTricks(prev => prev.filter(trick => trick.id !== trickId));
    if (selectedSpot?.id === trickId) {
      setSelectedSpot(null);
    }
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    if (selectedSpot?.id === eventId) {
      setSelectedSpot(null);
    }
  };

  const handleMarkerClick = (spot) => {
    setSelectedSpot(spot);
    setViewport({
      latitude: spot.lat,
      longitude: spot.lng,
      zoom: 16
    });
  };

  const handleAddTrick = async (formData) => {
    if (!selectedLocation) return;

    const newTrick = {
      id: Date.now().toString(),
      type: 'trick',
      trickName: formData.trickName,
      locationName: formData.locationName,
      description: formData.description,
      photoUrl: formData.media[0]?.preview || 'https://placehold.co/300x300',
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      coordinates: `${selectedLocation.lat.toFixed(4)}°N, ${selectedLocation.lng.toFixed(4)}°W`,
      userId,
      username,
      tries: formData.tries,
      stance: formData.stance,
      setup: formData.setup,
      media: formData.media,
      createdAt: new Date().toISOString()
    };

    setTricks(prev => [newTrick, ...prev]);
    setShowAddTrick(false);
    setSelectedLocation(null);
    setSelectedSpot(newTrick); // Select the new trick's marker
  };

  const handleAddEvent = async (formData) => {
    if (!selectedLocation) return;

    const newEvent = {
      id: Date.now().toString(),
      type: 'event',
      title: formData.title,
      locationName: formData.locationName,
      description: formData.description,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      coordinates: `${selectedLocation.lat.toFixed(4)}°N, ${selectedLocation.lng.toFixed(4)}°W`,
      userId,
      username,
      eventDate: formData.eventDate,
      skillLevel: formData.skillLevel,
      maxParticipants: formData.maxParticipants,
      participants: [{ userId, username }],
      createdAt: new Date().toISOString()
    };

    setEvents(prev => [newEvent, ...prev]);
    setShowAddEvent(false);
    setSelectedLocation(null);
    setSelectedSpot(newEvent); // Select the new event's marker
  };

  const handleAddFriend = (newFriend) => {
    if (!friends.find(f => f.userId === newFriend.userId)) {
      setFriends(prev => [...prev, newFriend]);
    }
  };

  const handleRemoveFriend = (friendId) => {
    setFriends(prev => prev.filter(friend => friend.userId !== friendId));
  };

  const handleSkateparkSelect = (skatepark) => {
    setSelectedSkatepark(skatepark);
  };

  const spots = activeTab === 'tricks' ? tricks : events;

  return (
    <Layout 
      spots={spots}
      viewport={viewport} 
      onViewportChange={handleViewportChange}
      selectedSpot={selectedSpot}
      onMarkerClick={handleMarkerClick}
      onMapClick={handleMapClick}
      selectedLocation={selectedLocation}
      homeSkatepark={homeSkatepark}
      onSkateparkSelect={handleSkateparkSelect}
      mapBounds={USA_BOUNDS}
    >
      <UserProfile 
        username={username} 
        updateUsername={setUsername}
        onToggleFriends={() => setShowFriends(!showFriends)}
        friendCount={friends.length}
      />
      
      {showFriends && (
        <FriendsList
          friends={friends}
          onClose={() => setShowFriends(false)}
          onAddFriend={handleAddFriend}
          onRemoveFriend={handleRemoveFriend}
        />
      )}

      {selectedSkatepark && (
        <SkateparkModal
          skatepark={selectedSkatepark}
          onClose={() => setSelectedSkatepark(null)}
          onSetAsHome={handleSetHomeSkatepark}
        />
      )}

      <TabView activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'tricks' ? (
        <>
          <TrickList 
            tricks={tricks} 
            onDelete={handleDeleteTrick} 
            onMarkerClick={handleMarkerClick}
          />
          {selectedLocation && (
            <div className="fixed bottom-6 left-6 space-x-2">
              <button
                onClick={() => setShowAddTrick(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
              >
                Add Trick Here
              </button>
              <button
                onClick={() => setSelectedLocation(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
          {showAddTrick && (
            <AddTrickForm
              onSubmit={handleAddTrick}
              onCancel={() => {
                setShowAddTrick(false);
                setSelectedLocation(null);
              }}
            />
          )}
        </>
      ) : (
        <>
          <EventList 
            events={events} 
            userId={userId} 
            onDelete={handleDeleteEvent}
            onMarkerClick={handleMarkerClick}
          />
          {selectedLocation && (
            <div className="fixed bottom-6 left-6 space-x-2">
              <button
                onClick={() => setShowAddEvent(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
              >
                Add Skate Date Here
              </button>
              <button
                onClick={() => setSelectedLocation(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
          {showAddEvent && (
            <AddEventForm
              onSubmit={handleAddEvent}
              onCancel={() => {
                setShowAddEvent(false);
                setSelectedLocation(null);
              }}
            />
          )}
        </>
      )}
    </Layout>
  );
}

export default App;