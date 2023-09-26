"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import axiosInstance from '@/axios';
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext';

export default function Page() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter()
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const loginSuccess = await login(username, password);

            if (loginSuccess) {
                router.push('/');
                console.log('Login successful');
            } else {
                console.log('Login failed');
                setError('Invalid credentials');
            }
        } catch (error) {
            console.error('API login error:', error);
            setError('An error occurred while logging in.');
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="w-full max-w-md mx-auto my-20">
            <div className="bg-blue-500 text-white py-4 px-8 rounded-t-md">
                <h2 className="text-2xl font-semibold">Welcome Back!</h2>
                <p className="text-sm">Please log in to continue.</p>
            </div>
            <form className="bg-white shadow-md rounded-b-md px-8 pt-6 pb-8 mb-4" onSubmit={handleLogin}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                        Username
                    </label>
                    <input
                        type="username"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 text-blue-500"
                        placeholder="Username"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 text-blue-500"
                        placeholder="Password"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Please wait...' : 'Log In'}
                    </button>
                </div>
            </form>
            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Forgot your password?{' '}
                    <a href="#" className="text-blue-500 hover:underline">
                        Reset it
                    </a>
                </p>
                <p className="mt-2 text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a href="#" className="text-blue-500 hover:underline">
                        Register
                    </a>
                </p>
            </div>
        </div>



    );
};