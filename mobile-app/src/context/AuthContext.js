import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for persisted token on mount
        const bootstrapAsync = async () => {
            let storedToken;

            try {
                storedToken = await SecureStore.getItemAsync('userToken');
                if (storedToken) {
                    setToken(storedToken);
                    // Optionally fetch user profile to verify token
                    const response = await api.get('/user');
                    setUser(response.data);
                }
            } catch (e) {
                console.error('Failed to restore token', e);
                // If token is invalid or expired, clear it
                await SecureStore.deleteItemAsync('userToken');
            } finally {
                setLoading(false);
            }
        };

        bootstrapAsync();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            const { user, token } = response.data;

            setUser(user);
            setToken(token);
            await SecureStore.setItemAsync('userToken', token);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Login failed. Please check your credentials.'
            };
        }
    };

    const register = async (name, email, password, password_confirmation) => {
        try {
            const response = await api.post('/register', {
                name,
                email,
                password,
                password_confirmation
            });
            const { user, token } = response.data;

            setUser(user);
            setToken(token);
            await SecureStore.setItemAsync('userToken', token);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Registration failed.'
            };
        }
    };

    const logout = async () => {
        try {
            // Optional: Call logout on backend
            await api.post('/logout').catch(() => { });
        } finally {
            setUser(null);
            setToken(null);
            await SecureStore.deleteItemAsync('userToken');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
