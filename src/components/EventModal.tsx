"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { Event } from "@/types/event"; // Or define interface inline if not using global types

interface EventModalProps {
    event: Event | null;
    onClose: () => void;
}

function formatIndianDate(dateStr: string) {
    const date = new Date(dateStr);
    const weekday = date.toLocaleDateString('en-IN', { weekday: 'long' });  // e.g. Wednesday
    const dayMonthYear = date.toLocaleDateString('en-IN').replace(/\//g, '-');  // 25-06-2025
    return `${weekday}, ${dayMonthYear}`;
}



export default function EventModal({ event, onClose }: EventModalProps) {
    if (!event) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-indigo-600 mb-2">{event.eventTitle}</h2>

                <div className="w-full h-64 relative mb-4 rounded-lg overflow-hidden">
                    <Image
                        src={event.eventImage || "/placeholder.svg"}
                        alt={event.eventTitle}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Venue:</strong> {event.eventVenue}</p>
                    <p><strong>Date:</strong>  <span>{formatIndianDate(event.eventStartDate)}</span> <b>to </b>  <span>{formatIndianDate(event.eventEndDate)}</span> </p>
                    <p><strong>Time:</strong> {event.eventStartTime} <b>to </b> {event.eventEndTime}</p>
                    <p><strong>Cost:</strong> ₹{event.eventCoverCost}</p>
                    {/* <p className="text-gray-600 text-sm mb-4">{event.eventDescription}</p> */}
                    <p><strong>Description:</strong> {event.eventDescription}</p>
                    {/* <p className="text-gray-600 text-sm mb-4">{event.eventDescription}</p> */}
                </div>
            </div>
        </div>
    );
}
