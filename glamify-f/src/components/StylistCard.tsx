import React from 'react';
interface Stylist {
    id: number;
    first_name: string;
    last_name: string;
    bio: string;
    services: number[];
}
export default function ServiceCard({ stylist }: { stylist: Stylist }) {
    return (
        <div
            className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
            <div className="mb-2">
                <strong className="text-lg text-blue-600 font-semibold mb-2">
                    {stylist.first_name} {stylist.last_name}
                </strong>
            </div>
            <p className="text-gray-600">{stylist.bio}</p>
        </div>
    );
};