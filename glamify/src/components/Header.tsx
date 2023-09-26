'use client'
import React from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image'

export default function Header() {
    const { user, logout, isAuthenticated } = useAuth();
    const router = useRouter()
    const handleLogout = () => {
        logout();
        router.push('/auth/login/');
    };

    return (
        <header className="bg-blue-500 p-4">
            <nav className="container mx-auto flex justify-between items-center">
                <Image
                    src="/lakmelogo.png"
                    width={143}
                    height={35}
                    alt="Picture of the author"
                    className='ps-6'
                />
                <ul className="flex space-x-4">
                    <li>
                        <Link href="/" className="text-white hover:text-blue-300 transition duration-300">Home</Link>
                    </li>

                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link href="/appointments" className="text-white hover:text-blue-300 transition duration-300">My Appointments</Link>
                            </li>
                            {user.is_staff && (
                                <li>
                                    <Link href="/dashboard" className="text-white hover:text-blue-300 transition duration-300">Dashboard</Link>
                                </li>
                            )}

                            <li>
                                <span className="text-white font-extrabold">{user.first_name} {user.last_name}</span>
                            </li>

                            <li>
                                <button
                                    className="text-white hover:text-blue-300 transition duration-300"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link href="/auth/login" className="text-blue-600 font-bold transition duration-300 bg-white rounded py-2 px-4">
                                Log In
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}
