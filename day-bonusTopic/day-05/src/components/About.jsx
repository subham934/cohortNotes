import React from 'react';

const About = () => {
  console.log('About Rendering...');
  return (
    <div className="text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 p-4 rounded shadow mt-6">
      About 
    </div>
  );
};

export default React.memo(About);
