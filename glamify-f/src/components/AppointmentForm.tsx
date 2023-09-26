import React, { useEffect, useState } from 'react';
import axiosInstance from '@/axios';

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
    price: number;
    duration: number;
}

interface Appointment {
    stylist: number,
    services: number[];
    appointment_datetime: string;
}

export default function AppointmentForm({ stylists, params }: { stylists: Stylist[], params: { slug: string } }) {
    const [stylist, setStylist] = useState<Stylist | null>(null);
    const [appointment, setAppointment] = useState<Appointment>({} as Appointment);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // Specify the type as string
    const [message, setMessage] = useState<string | null>(null); // Specify the type as string

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        if (name === 'stylist') {
            const selectedStylistId = parseInt(value, 10);
            const selectedStylist = stylists.find((s) => s.id === selectedStylistId);

            setStylist(selectedStylist || null); // Set the selected stylist or null if not found
            setAppointment((prevAppointment) => ({
                ...prevAppointment,
                stylist: selectedStylistId,
                services: [],
            }));
        } else if (name === 'services') {
            const selectedServices = [...event.target.selectedOptions].map(option => option.value);
            setAppointment((prevAppointment) => ({
                ...prevAppointment,
                services: selectedServices,
            }));
        } else if (name === 'appointment_datetime') {
            setAppointment((prevAppointment) => ({
                ...prevAppointment,
                appointment_datetime: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        if (!appointment.stylist || appointment.services.length === 0 || !appointment.appointment_datetime) {
            setError('Please select all required fields.');
            return;
        }
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/appointments/${params.slug}/`, appointment);

            if (response.status === 201) {
                setError("")
                setLoading(false);
                setMessage('Appointment created successfully!');
            } else {
                setLoading(false);
                setError('Failed to create appointment');
            }
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="stylist" className="block text-sm font-medium text-gray-700">
                        Choose a stylist
                    </label>

                    <select
                        id="stylist"
                        name="stylist"
                        className="mt-1 p-2 w-full border text-blue-500 rounded-md"
                        onChange={handleChange}
                        value={appointment.stylist}
                    >
                        <option disabled selected>Select a Stylist</option>
                        {stylists.map((stylist: Stylist) => (
                            <option key={stylist.id} value={stylist.id}>
                                {stylist.first_name} {stylist.last_name}
                            </option>
                        ))}
                    </select>
                </div>
                {stylist &&
                    <div className="mb-4">
                        <label htmlFor="services" className="block text-sm font-medium text-gray-700">
                            Select services
                        </label>
                        <select
                            id="services"
                            name="services"
                            multiple={true}
                            className="mt-1 p-2 w-full border border-gray-300 text-blue-500 rounded-md"
                            onChange={handleChange}
                            value={appointment.services}
                        >
                            <option disabled>Select a Service</option>
                            {stylist.services.map((service: Service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name}, Duration: {service.duration}
                                </option>
                            ))}
                        </select>
                    </div>
                }


                < div className="mb-4">
                    <label htmlFor="appointment_datetime" className="block text-sm font-medium text-gray-700">
                        Choose appointment date and time
                    </label>
                    <input
                        type="datetime-local"
                        id="appointment_datetime"
                        name="appointment_datetime"
                        className="mt-1 p-2 w-full border border-gray-300 text-blue-500 rounded-md"
                        onChange={handleChange}
                        value={appointment.appointment_datetime}
                    />
                </div>


                <div className="mb-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </div>

            </form >

            {loading && <p className="text-green-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500 font-bold">{message}</p>}
        </div >
    );
}
