'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

let Auth = createContext();

export let AuthProvider = ({ children }) => {
  let [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)
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
    }finally{
        setLoading(false)
    }
  };

  useEffect(() => {
    hydrateUser();
  }, []);

  return <Auth.Provider value={{ user, setUser , loading}}>{children}</Auth.Provider>;
};

export let useAuth = () => useContext(Auth);
