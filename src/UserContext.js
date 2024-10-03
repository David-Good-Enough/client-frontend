import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAdmin(true);
        }
    }, []);

    const login = () => {
        setIsAdmin(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAdmin(false);
    };

    return (
        <UserContext.Provider value={{ isAdmin, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
