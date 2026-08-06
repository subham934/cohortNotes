// Lets create State Layer:

import { createContext, useState } from "react";

export const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
  const [song, setSong] = useState({
    /**
     * Paste one or more documents here
     */

    url: "https://ik.imagekit.io/lq7qd2rhd/cohort-2/moodify/songs/Jatt_Mehkma__RiskyjaTT.CoM__Si89sazt3r.mp3",
    posterUrl:
      "https://ik.imagekit.io/lq7qd2rhd/cohort-2/moodify/posters/Jatt_Mehkma__RiskyjaTT.CoM__K_NTsbz43.jpeg",
    title: "Jatt Mehkma (RiskyjaTT.CoM)",
    mood: "happy",
  });

  const [loading, setLoading] = useState(false);
  return (
    <SongContext.Provider value={{ song, setSong, loading, setLoading }}>
      {children}
    </SongContext.Provider>
  );

};
