import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader } from '../components';

const Details = () => {
  const { restaurantId } = useParams(); // Get the restaurant ID from the URL
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the restaurant details by ID
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/restaurant/${restaurantId}`);
        setRestaurant(response.data);
        setLoading(false);
      } catch (error) {
        setError('Restaurant not found');
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  if (loading) {
    return <Loader/>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="ml-60 mr-64 p-8 bg-white rounded shadow-lg mt-6 mb-24">
    <h1 className="px-4 text-3xl font-bold mb-4">{restaurant.Restaurant_Name}</h1>
    <p className="px-4 text-gray-700 mb-2"><span className='font-bold text-2xl'>Address:</span> {restaurant.Address}</p>
  <div className="flex">
    <div className="flex-1 p-4">
      
      <p className="text-black mb-2"><span className='font-semibold text-lg'>City: </span> {restaurant.City}</p>
      <p className="text-black mb-2"><span className='font-semibold text-lg'>Country Code: </span> {restaurant.Country_Code}</p>
      <p className="text-black mb-2"><span className='font-semibold text-lg'>Cuisines: </span> {restaurant.Cuisines}</p>
      <p className="text-black mb-2"><span className='font-semibold text-lg'>Rating: </span> {restaurant.Aggregate_Rating} ⭐</p>
      <p className='text-black mb-2'><span className='font-semibold text-lg'>Votes: </span> {restaurant.Votes}</p> 
    </div>
    
    <div className="flex-1 p-4">
      
      <p className='text-black mb-2'><span className='font-semibold text-lg'>Cost for two: </span> {restaurant.Avg_cost_two} {restaurant.Currency}</p> 
      <p className="text-black mb-2"><span className='font-semibold text-lg'>Feedback: </span> {restaurant.Rating_text}</p>
      <p className='text-black mb-2'><span className='font-semibold text-lg'>Online Delivery: </span> {restaurant.hasOnlineDelivery}</p> 
      <p className='text-black mb-2'><span className='font-semibold text-lg'>Table Booking: </span> {restaurant.hasTableBooking}</p> 
      <p className='text-black mb-2'><span className='font-semibold text-lg'>Delivering Now: </span> {restaurant.isDeliveringNow}</p> 
    </div>
  </div>
</div>
  );
};

export default Details;
