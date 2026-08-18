import React from 'react';

const Throttling = () => {
  let lastClicked = 0;

  const onClickedFunction = () => {
    const now = Date.now();
    if (now - lastClicked >= 2000) {
      console.log('api called', now);
      lastClicked = now;
    }
  };

  return (
    <div>
      <button
        onClick={onClickedFunction}
        className="px-3 py-1 bg-blue-400 border border-gray-400 rounded-lg outline-none text-white mt-6"
      >
        Click Me
      </button>
    </div>
  );
};

export default Throttling;
