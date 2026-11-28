'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

let Auth = createContext();

export let AuthProvider = ({ children }) => {
  let [user, setUser] = useState(null);
  let hydrateUser = async () => {
    try {
      let res = await api.get('/api/auth/me');
      console.log(res)
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
      if (error?.response?.status !== 401) {
        console.log('error in hydration', error);
      }
    }
  };

  useEffect(() => {
    hydrateUser();
  }, []);

  return <Auth.Provider value={{ user, setUser }}>{children}</Auth.Provider>;
};

export let useAuth = () => useContext(Auth);
