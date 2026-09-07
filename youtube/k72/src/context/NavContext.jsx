import React, { createContext, useState } from 'react';

export const NavbarContext = createContext();

const NavContext = ({ children }) => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  return (
    <div>
      <NavbarContext.Provider value={[navbarOpen, setNavbarOpen]}>
        {children}
      </NavbarContext.Provider>
    </div>
  );
};

export default NavContext;
