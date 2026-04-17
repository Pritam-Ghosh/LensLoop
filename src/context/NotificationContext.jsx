import React, { createContext, useState, useContext, useEffect } from "react";

const NotificationContext = createContext();
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [hasOpenedNotificationPage, setHasOpenedNotificationPage] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            const dp = require("../../assets/dp.jpg");
            const dp2 = require("../../assets/dp2.webp");
            
            const data = [
                { id: 1, name: "Recenly you click 5 photos ", time: "4hrs", image: dp, iconType: "album" },
                { id: 2, name: "Quency Demola", time: "4hrs", image: dp2, iconType: "folder" },
                { id: 3, name: "Quency Demola", time: "4hrs", image: dp2, iconType: "folder" },
            ];
            setNotifications(data);
            if (!hasOpenedNotificationPage) {
                setUnreadCount(data.length);
            }
        };
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, [hasOpenedNotificationPage]);


    const markAllAsRead = () => {
        setUnreadCount(0);
        setHasOpenedNotificationPage(true);
    };

    return (
        <NotificationContext.Provider
            value={{ notifications, setNotifications, unreadCount, markAllAsRead }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
