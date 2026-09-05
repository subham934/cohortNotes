import React, { createContext, useState } from 'react';

const NavContext = ({ children }) => {
  const NavbarContext = createContext();
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
