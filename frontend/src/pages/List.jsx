import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import { Card } from '../components';

const List = () => {
    const [data, setData] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20; // Number of items per page

    const loadData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/restaurants");
            setData(response.data);
        } catch (error) {
            console.error("Error loading data", error);
        }
    }; 

    useEffect(() => {
        loadData(); 
    }, []); 

    // Pagination logic
    const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div>
            <h1 className='text-center text-4xl mb-4 font-bold'>Dine on the Best, Just Around You</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {paginatedData.map((item) => (
                    <Card key={item.Restaurant_ID} restaurant={item} />
                ))}
            </div>

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
}

export default List;
