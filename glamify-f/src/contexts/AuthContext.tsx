'use client'
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '@/axios';


export const AuthContext = createContext({})

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchUser()
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axiosInstance.post('/auth/login/', {
                username,
                password,
            });

            if (response.status === 200) {
                const newToken = response.data.token;
                localStorage.setItem('token', newToken);
                setToken(newToken);
                fetchUser()
                return true;
            } else {
                console.log('Login failed');
                return false;
            }
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        };

    };


    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get('/auth/user/');

            if (response.status === 200) {
                console.log(response.data);
                setUser(response.data);
                setIsAuthenticated(true)
            } else {
                console.log('Failed to fetch user information');
            }
        } catch (error) {
            console.error('Failed to fetch user information:', error);
        } finally {
            setLoading(false);
        }
    };



    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setIsAuthenticated(false)
    };

    const contextValue = {
        user,
        login,
        logout,
        isAuthenticated
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
