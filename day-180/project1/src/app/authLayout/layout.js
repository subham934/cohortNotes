import AuthNav from '@/components/AuthNav';
import React from 'react';

const layout = ({ children }) => {
  return (
    <div>
      <html lang="en" className={`h-full antialiased`}>
        <body className="min-h-full flex flex-col">
          <AuthNav />
          {children}
        </body>
      </html>
    </div>
  );
};

export default layout;
