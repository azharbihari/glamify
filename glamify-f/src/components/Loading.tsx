import React from 'react';

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-700 text-lg">Loading...</p>
        </div>
    );
};