import React from 'react'

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'; 
import { Details, ImageSearch, List, LocationSearch } from './pages';
import { zomaturants } from './assets';

const App = () => {
  return (
    <BrowserRouter>
      <header className='bg-gradient-to-r from-orange-200 to-red-200 w-full flex justify-between items-center sm:px-8 px-4 py-4'>
        <Link to="/">
          <div>
            <p className="flex items-center text-white">
              <img src={zomaturants} className='w-16 h-16 rounded-full' alt="" />
              <span className="font-sans font-semibold text-black text-3xl ml-2">Zomat<span className='text-red-600'>urants</span></span>
            </p>
  
          </div>
        </Link>
        <span>
          <Link to="/imageSearch" className="font-mono font-bold text-lg bg-red-300 hover:text-white hover:bg-orange-600 text-black px-4 py-2 rounded-md">Lens</Link> 
          &nbsp;
          &nbsp;
          <Link to="/locationSearch" className="font-mono font-bold text-lg bg-red-300 hover:text-white hover:bg-orange-600 text-black px-4 py-2 rounded-md">GeoLocation</Link>
         </span>
      </header> 

      <main className="px-4 py-8 w-full bg-gradient-to-r from-orange-200 to-red-200">
        <Routes>
          <Route path='/' element={<List />} />
          <Route path="/details/:restaurantId" element={<Details />} />
          <Route path="/imageSearch" element={<ImageSearch/>} /> 
          <Route path="/locationSearch" element={<LocationSearch/>} />
        </Routes>
      </main>  
    </BrowserRouter>
  )
}

export default App