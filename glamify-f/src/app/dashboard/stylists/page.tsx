"use client"
import React, { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Link from 'next/link'
import axiosInstance from '@/axios';

interface Stylist {
    id: string;
    first_name: string;
    last_name: string;
    services: Service[];
    completed_appointments_count: number;
}
interface Service {
    name: string;
    duration: number;
    price: number;
}

export default function Page() {

    const [stylists, setStylists] = useState<Stylist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    const fetchStylists = async () => {
        try {
            const response = await axiosInstance.get('owners/stylists/');

            if (response.status === 200) {
                console.log(response.data);
                setStylists(response.data);
                setLoading(false);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            setError(error.message);
            console.error('Failed to fetch stylists:', error);
        } finally {
            setLoading(false);
        }
    };

    // const confirmCancellation = (appointment) => {
    //     const confirmation = confirm('Are you sure you want to cancel this appointment?');

    //     if (confirmation) {
    //         cancelAppointment(appointment);
    //     }
    // };

    // const cancelAppointment = async (appointment) => {
    //     try {
    //         const response = await axiosInstance.put(`/appointments/${appointment.id}/cancel/`, {
    //             "status": "cancelled"
    //         });

    //         if (response.status === 200) {
    //             fetchAppointments();
    //         } else {
    //             throw new Error('Network response was not ok');
    //         }
    //     } catch (error) {
    //         setError(error.message);
    //         console.error('Failed to cancel appointment:', error);
    //     }
    // };

    useEffect(() => {
        fetchStylists()
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
                        <div className="bg-gray-300 py-3 px-6">
                            <h1 className="text-3xl font-extrabold mb-4 text-gradient bg-gradient-to-r from-blue-500 via-pink-500 to-red-500 bg-clip-text text-transparent">Stylists</h1>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-blue-500">
                                <thead className="text-xs text-blue-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3" scope="col">Name</th>
                                        <th className="px-6 py-3" scope="col">Services Offered</th>
                                        <th className="px-6 py-3" scope="col">Completed Appointments</th>
                                        <th className="px-6 py-3" scope="col">Status</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {stylists.map((stylist) => (
                                        <tr key={stylist.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="text-base font-semibold">{stylist.first_name} {stylist.last_name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <ul className="flex space-x-4">
                                                    {stylist.services.map((service) => (
                                                        <li key={service.name} className="px-2 py-1 bg-gray-200 rounded">
                                                            {service.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="px-6 py-4"><p className='font-bold text-lg'>{stylist.completed_appointments_count}</p></td>
                                            <td className="px-6 py-4 space-x-2">
                                                {/* <span className={`font-bold ${statusClasses[appointment.status] || 'text-gray-900'}`}>{appointment.status}</span>
                                                {appointment.status === 'Pending' && (
                                                    <button
                                                        onClick={() => confirmCancellation(appointment)}
                                                        className="bg-red-600 hover:bg-red-900 text-white cursor-pointer p-2 rounded"
                                                    >
                                                        Cancel
                                                    </button>
                                                )} */}
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