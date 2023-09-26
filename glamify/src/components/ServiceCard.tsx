import React from 'react';
interface Service {
    id: number;
    name: string;
    description: string;
    price: string;
    duration: number;
}
export default function ServiceCard({ service }: { service: Service }) {
    return (
        <div
            className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
            <h3 className="text-lg text-blue-600 font-semibold mb-2">{service.name}</h3>
            <p className="text-gray-600">{service.description}</p>
            <div className="mt-2">
                <p className="text-black font-bold">Price: ${service.price}</p>
                <p className="text-black">Duration: {service.duration} minutes</p>
            </div>
        </div>
    );
};