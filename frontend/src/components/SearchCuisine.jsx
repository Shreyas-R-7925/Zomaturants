import React, { useState, useEffect } from "react";
import axios from "axios";
import FilteredCard from "./FilteredCard"; 

const SearchCuisine = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const firstDisplayName = response?.items?.[0]?.food?.[0]?.food_info?.display_name;

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload Response:", res.data);
      setResponse(res.data);
    } catch (err) {
      console.error("Error during upload:", err);
      setError("Failed to upload image or detect food.");
    }
  }; 

  const extractMainCuisine = (detectedCuisine) => {
    const words = detectedCuisine.split(' ');
    return words[words.length - 1];
  };
  
  const searchRestaurants = async (detectedCuisine) => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/getRestaurantByCuisine", {
        cuisine: detectedCuisine
      });

      console.log("Restaurants API response:", res.data); // Debugging: Log the response

      // Ensure `restaurants` is set to an array
      if (Array.isArray(res.data)) {
        setRestaurants(res.data);
      } else {
        setRestaurants([]); // Fallback to an empty array
        setError("Unexpected response format.");
      }
    } catch (err) {
      console.error("Error searching for restaurants:", err);
      setError("Failed to search restaurants.");
    }
  };

  useEffect(() => {
    if (firstDisplayName) {
      const mainCuisine = extractMainCuisine(firstDisplayName);
      searchRestaurants(mainCuisine);
    }
  }, [firstDisplayName]);

  // Ensure `.slice()` is only called on arrays
  const paginatedRestaurants = Array.isArray(restaurants)
    ? restaurants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const totalPages = Math.ceil(restaurants.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="">
      <div className="text-center font-semibold text-4xl mb-20">
        Upload a Food Pic, and we'll find the restaurants!
      </div>

      <div className="ml-48 p-4 max-w-sm rounded overflow-hidden shadow-lg bg-white m-4 p-4">
        <div className="ml-20 mr-40">
          <input type="file" onChange={handleFileChange} accept="image/*" />
        </div>
        <br />
        <div>
          <button
            className="px-4 py-2 ml-20 text-sm text-orange-600 bg-white font-semibold rounded-full border border-orange-200 hover:text-white hover:bg-orange-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            onClick={handleUpload}
          >
            Find
          </button>
        </div>
      </div>

      {/* {error && (
        <div className="text-red-500">
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )} */}

      {restaurants.length > 0 && (
        <div>
          <h2 className="px-8 text-2xl mt-10 font-semibold font-mono">Matching Restaurants:</h2>
        </div>
      )}

      {paginatedRestaurants.length > 0 && ( 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {paginatedRestaurants.map((restaurant, index) => (
            <FilteredCard key={index} restaurant={restaurant} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button 
            className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<-"}
          </button>
          <span className="px-4 py-2">
            {currentPage} of {totalPages}
          </span>
          <button 
            className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {"->"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchCuisine;
