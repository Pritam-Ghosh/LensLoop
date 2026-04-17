import React, { createContext, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);     // old local events
  const [hives, setHives] = useState([]);
  // backend hives
  const [publicHives, setPublicHives] = useState([]);

  const fetchPublicHives = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(
        "https://snaphive-node.vercel.app/api/hives/feed/public",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPublicHives(res.data.hives);
    } catch (error) {
      console.log("Public feed error:", error);
    }
  };


  const fetchHives = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("❌ No token found");
        return;
      }

      const res = await axios.get(
        "https://snaphive-node.vercel.app/api/hives",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Hives fetched:", res.data.hives?.length);

      setHives(res.data.hives || []);
    } catch (err) {
      console.log("❌ fetchHives error:", err?.response?.data || err.message);
    }
  };

  const deleteHive = async (hiveId) => {
    const token = await AsyncStorage.getItem("token");

    await axios.delete(
      `https://snaphive-node.vercel.app/api/hives/${hiveId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setHives(prev =>
      prev.filter(hive => hive._id !== hiveId)
    );
  };


  // ✅ NEW FUNCTION - Updates hive photos in real-time
  const updateHivePhotos = (hiveId, newPhotos) => {
    setHives(prevHives =>
      prevHives.map(hive =>
        hive._id === hiveId
          ? { ...hive, images: newPhotos, photos: newPhotos }
          : hive
      )
    );
  };

  // ✅ NEW FUNCTION - Updates hive members count in real-time
  const updateHiveMembers = (hiveId, newMembers) => {
    setHives(prevHives =>
      prevHives.map(hive =>
        hive._id === hiveId
          ? { ...hive, members: newMembers, memberCount: newMembers.length }
          : hive
      )
    );
  };

  return (
    <EventContext.Provider value={{
      events,
      setEvents,
      hives,
      setHives,
      publicHives,
      fetchPublicHives,
      setPublicHives,
      fetchHives,
      updateHivePhotos,    // ✅ Export this
      updateHiveMembers,
      deleteHive    // ✅ Export this
    }}>
      {children}
    </EventContext.Provider>
  );
};