import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const FooterContext = createContext();

export const FooterProvider = ({ children }) => {
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/game')) {
      setIsFooterVisible(false);
    } else {
      setIsFooterVisible(true);
    }
  }, [location]);

  return (
    <FooterContext.Provider value={{ isFooterVisible }}>
      {children}
    </FooterContext.Provider>
  );
};
