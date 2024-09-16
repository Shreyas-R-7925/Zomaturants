import React from 'react';

import { useNavigate } from 'react-router-dom';

const FilteredCard = ({restaurant}) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/details/${restaurant.id}`);
    }; 

  return (
    <div className="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
            <div className="text-center space-y-2 sm:text-left">
                <div className="space-y-0.5">
                <p class="text-lg text-black font-semibold">
                    {restaurant.name}
                </p>    
                <p className="text-slate-500 font-medium">
                    Address: {restaurant.address}
                </p>
                <p className="text-slate-500 font-medium">
                    City: {restaurant.city}
                </p>
                <p className="text-slate-500 font-medium">
                    Rating: {restaurant.rating} ⭐
                </p>
                <p className="text-slate-500 font-medium">
                    Cuisine: {restaurant.cuisines}
                </p>
                </div>
            </div>
            <div className="text-center sm:text-left">
    <button
      onClick={handleClick}
      className="px-4 py-1 text-sm text-orange-600 font-semibold rounded-full border border-orange-200 hover:text-white hover:bg-orange-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
    >
      More Details
    </button>
  </div>
        </div>
  )
}

export default FilteredCard