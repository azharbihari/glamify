"use client"
import React, { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import AppointmentForm from '@/components/AppointmentForm';
import ServiceCard from '@/components/ServiceCard';
import StylistCard from '@/components/StylistCard';
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image'

interface Stylist {
    id: number;
    first_name: string;
    last_name: string;
    bio: string;
    services: Service[];
}

interface Service {
    id: number;
    name: string;
    description: string;
    price: string;
    duration: number;
}
interface Salon {
    id: number;
    services: Service[]
    stylists: Stylist[]
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
    rating: string;
    created_at: string;
    updated_at: string;
    owner: number;
};



export default function Page({ params }: { params: { slug: string } }) {
    const { isAuthenticated } = useAuth();
    const [salon, setSalon] = useState<Salon>({} as Salon);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        fetch(`http://127.0.0.1:8000/salons/${params.slug}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data: Salon) => {
                setSalon(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen p-4 py-10">
            <div className="container mx-auto">
                {loading ? (
                    <Loading></Loading>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : (
                    <div className="p-6">
                        <div className="mb-4">
                            <Image
                                src="/salon_f.jpg"
                                width={1600}
                                height={473}
                                alt="Picture of the author"
                                className="w-full h-48 object-cover object-center"
                            />
                        </div>

                        <h1 className="text-4xl font-bold text-blue-600">{salon.name}</h1>
                        <p className="text-lg text-gray-600">{salon.description}</p>

                        <div className="flex space-x-4">
                            <p
                                className={`${salon.is_open ? 'text-green-500' : 'text-red-500'
                                    } font-bold text-lg`}
                            >
                                {salon.is_open ? 'Open' : 'Closed'}
                            </p>
                            <p className="text-lg text-blue-600">
                                Rating: {salon.rating} ★
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row md:justify-between gap-2 my-8">
                            <div className="md:w-2/3">
                                <div className="">
                                    <h2 className="text-xl text-blue-600 font-semibold mb-2">Services Offered</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {salon.services.map((service) => (
                                            <ServiceCard key={service.id} service={service}></ServiceCard>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <h2 className="text-xl text-blue-600 font-semibold mb-2">Stylists</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {salon.stylists.map((stylist) => (
                                            <StylistCard key={stylist.id} stylist={stylist}></StylistCard>
                                        ))}
                                    </div>
                                </div>

                            </div>


                            <div className="md:w-1/3">
                                {salon.is_accepting_appointment && isAuthenticated && (
                                    <div>
                                        <h2 className="text-xl text-blue-600 font-semibold mb-2">Book Appointment</h2>
                                        <AppointmentForm params={params} stylists={salon.stylists} services={salon.services}></AppointmentForm>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};