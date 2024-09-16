import React, { useState } from 'react';
import Loader from './Loader'; 

import FilteredCard from './FilteredCard';

const SearchLongLat = () => {
  const [currentLat, setCurrentLat] = useState('');
  const [currentLng, setCurrentLng] = useState('');
  const [radius, setRadius] = useState(3); // Radius in km
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate input
    if (!currentLat || !currentLng || isNaN(currentLat) || isNaN(currentLng)) {
      setError('Please enter valid latitude and longitude.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/restaurants/nearby?latitude=${currentLat}&longitude=${currentLng}&radius=${radius}`);
      const data = await response.json();
      setNearbyRestaurants(data);
      setError(null); 
    } catch (err) {
      setError('Failed to fetch nearby restaurants.');
    }

    setLoading(false);
  };

  return (
    <div className=''>
      <h1 className='text-center font-bold text-4xl mb-10'>Explore restaurants around you</h1>
      <div>
      <form onSubmit={handleSubmit}>
        <div className='ml-40 '>
          <label className='font-semibold text-lg text-black'>
            Latitude: &nbsp; &nbsp; &nbsp; &nbsp;
            <input
              className='rounded'
              type="text"
              value={currentLat}
              onChange={(e) => setCurrentLat(e.target.value)}
              placeholder="Enter latitude"
            />
          </label>
        </div>
        <div className='ml-40'>
          <label className='font-semibold text-lg text-black'>
            Longitude: &nbsp; &nbsp;
            <input
              type="text"
              value={currentLng}
              onChange={(e) => setCurrentLng(e.target.value)}
              placeholder="Enter longitude"
            />
          </label>
        </div>
        <div className='ml-40'>
          <label className='font-semibold text-lg text-black'>
            Radius (km): &nbsp;
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value))}
              min="0"
              step="0.1"
              placeholder="Enter radius"
            />
          </label>
        </div>
        <button className="ml-40 bg-white rounded px-2 py-2 font-semibold hover:bg-orange-600 hover:text-white" type="submit" disabled={loading}>Search</button>
      </form>
      </div>
      {loading && <Loader />}
      {error && <p>{error}</p>}
      {nearbyRestaurants.length > 0 && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {nearbyRestaurants.map((restaurant, index) => (
          <FilteredCard key={index} restaurant={restaurant} />
        ))}
      </div>
      )}
      {nearbyRestaurants.length === 0 && !loading && !error && (
        <p>No restaurants found within {radius} km.</p>
      )}
    </div>
  );
};

export default SearchLongLat;