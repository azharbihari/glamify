"use client"
import React, { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Link from 'next/link'
import axiosInstance from '@/axios';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

interface Salon {
    id: number;
    owner: number;
    name: string;
    slug: string;
    description: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    phone_number: string;
    email: string;
    website: string | null;
    is_open: boolean;
    is_accepting_appointment: boolean;
    rating: number;
    pending_appointments: number;
    completed_appointments: number;
    cancelled_appointments: number;
    confirmed_appointments: number
}


export default function Page() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [salons, setSalons] = useState<Salon[] | null>([]);
    const [insights, setInsights] = useState({});


    const fetchSalons = async () => {
        try {
            const response = await axiosInstance.get('/owners/');

            if (response.status === 200) {
                console.log(response.data);
                setSalons(response.data.salons);
                setInsights(response.data.insights);
                setLoading(false);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            setError(error.message);
            console.error('Failed to fetch insight:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleStatusChange = async (salonSlug) => {
        try {
            const response = await axiosInstance.patch(`/owners/${salonSlug}/status/`);

            if (response.status === 200) {
                fetchSalons()
            } else {
                throw new Error('Failed to update salon status');
            }
        } catch (error) {
            console.error('Error updating salon status:', error);
            // Handle error, show a message, etc.
        }
    };

    useEffect(() => {
        fetchSalons()
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto">
                {loading ? (
                    <Loading></Loading>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : (
                    <div className="">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="text-center">
                                    <h2 className="text-5xl font-bold text-yellow-600">{insights.pending_appointments}</h2>
                                    <p className="text-sm text-gray-600">Pending Appointments</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="text-center">
                                    <h2 className="text-5xl font-bold text-blue-600">{insights.confirmed_appointments}</h2>
                                    <p className="text-sm text-gray-600">Confirmed Appointments</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="text-center">
                                    <h2 className="text-5xl font-bold text-green-600">{insights.completed_appointments}</h2>
                                    <p className="text-sm text-gray-600">Completed Appointments</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="text-center">
                                    <h2 className="text-5xl font-bold text-red-600">{insights.cancelled_appointments}</h2>
                                    <p className="text-sm text-gray-600">Cancelled Appointments</p>
                                </div>
                            </div>
                        </div>


                        <div className="overflow-x-auto mt-4">
                            <table className="w-full text-sm text-left text-blue-500">
                                <thead className="text-xs text-blue-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3" scope="col">Name</th>
                                        <th className="px-6 py-3" scope="col">Services Offered</th>
                                        <th className="px-6 py-3" scope="col">Appointments Status</th>
                                        <th className="px-6 py-3" scope="col">Status</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {salons.map((salon) => (
                                        <tr key={salon.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="text-base font-semibold">{salon.name}</div>
                                                <div className="font-normal text-gray-500">{salon.city}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <ul className="flex space-x-4">
                                                    {salon.services.map((service) => (
                                                        <li key={service.name} className="px-2 py-1 bg-gray-200 rounded">
                                                            {service.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="px-6 py-4 space-x-2 space-y-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500 text-white">
                                                    <span className="mr-1">{salon.pending_appointments}</span>
                                                    <span>PENDING</span>
                                                </span>

                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                                                    <span className="mr-1">{salon.confirmed_appointments}</span>
                                                    <span>CONFIRMED</span>
                                                </span>

                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                                                    <span className="mr-1">{salon.completed_appointments}</span>
                                                    <span>COMPLETED</span>
                                                </span>

                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                                                    <span className="mr-1">{salon.cancelled_appointments}</span>
                                                    <span>CANCELLED</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 space-x-2">
                                                <button onClick={() => handleStatusChange(salon.slug)}>
                                                    {salon.is_open ? (<ToggleOnIcon color="success" sx={{ fontSize: 60 }} />) : <ToggleOffIcon color="disabled" sx={{ fontSize: 60 }} />}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                )}
            </div>
        </div>
    );
};