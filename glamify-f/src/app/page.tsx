"use client"
import React, { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Link from 'next/link'
import Image from 'next/image'
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
}

export default function Page() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    fetch('http://127.0.0.1:8000/salons/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: Salon[]) => {
        setSalons(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          Discover Amazing Salons Near You
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          Explore our curated list of top-rated salons offering a wide range of beauty services.
        </p>
        {loading ? (
          <Loading></Loading>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {salons.map((salon) => (
              <div
                key={salon.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              >

                <Image
                  src="/home-based.webp"
                  width={512}
                  height={501}
                  alt="Picture of the author"
                />
                <div className="p-4">
                  <h2 className="text-blue-600 text-xl font-semibold mb-2">{salon.name}</h2>
                  <p className="text-gray-600 mb-2">{salon.address}</p>
                  <p className="text-gray-600 mb-2">
                    {salon.city}, {salon.state} {salon.postal_code}
                  </p>
                  <p className="text-gray-600 mb-4">{salon.phone_number}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500 text-lg">
                        ★ {salon.rating}
                      </span>
                    </div>
                    <p
                      className={`${salon.is_open ? 'bg-green-500' : 'bg-red-500'
                        } text-white py-2 px-4 rounded-full`}
                    >
                      {salon.is_open ? 'Open' : 'Closed'}
                    </p>
                    <Link href={`/${salon.slug}`} className="bg-blue-500 text-white py-2 px-4 rounded-full">Book Appointment</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
