import React, { useState } from 'react';
import { useEffect } from 'react';
import Throttling from './Throttling';

const App = () => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    // debounce
    const timer = setTimeout(() => {
      console.log('API calling ', search);
    }, 3000);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="w-screen h-screen bg-gray-600 ">
      <input
        type="text"
        className="px-3 py-1 w-1/2 border border-gray-400 rounded-lg outline-none text-white"
        placeholder="search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Throttling />
    </div>
  );
};

export default App;
