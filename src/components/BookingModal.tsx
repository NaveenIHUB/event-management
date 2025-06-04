"use client";

import { X, CreditCard, User, Mail, Phone, Calendar, MapPin, Clock, IndianRupee } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Event {
  _id: string;
  userId: string;
  eventTitle: string;
  eventVenue: string;
  eventStartDate: string;
  eventEndDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventCoverCost: number;
  eventImage: string;
  eventDescription: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface BookingModalProps {
    event: Event | null;
    onClose: () => void;
}

interface BookingForm {
    name: string;
    email: string;
    phoneNumber: string;
}

function formatIndianDate(dateStr: string) {
    const date = new Date(dateStr);
    const weekday = date.toLocaleDateString('en-IN', { weekday: 'long' });
    const dayMonthYear = date.toLocaleDateString('en-IN').replace(/\//g, '-');
    return `${weekday}, ${dayMonthYear}`;
}

export default function BookingModal({ event, onClose }: BookingModalProps) {
    const [bookingForm, setBookingForm] = useState<BookingForm>({
        name: "",
        email: "",
        phoneNumber: ""
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<Partial<BookingForm>>({});

    if (!event) return null;

    const validateForm = (): boolean => {
        const newErrors: Partial<BookingForm> = {};

        if (!bookingForm.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!bookingForm.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(bookingForm.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!bookingForm.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required";
        } else if (!/^\d{10}$/.test(bookingForm.phoneNumber.replace(/\s+/g, ""))) {
            newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof BookingForm, value: string) => {
        setBookingForm(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handlePayment = async () => {
        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);
        
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Here you would integrate with your actual payment gateway
            console.log("Processing payment for:", {
                event: event._id,
                user: bookingForm,
                amount: event.eventCoverCost
            });
            
            alert("Booking successful! You will receive a confirmation email shortly.");
            onClose();
        } catch (error) {
            console.error("Payment failed:", error);
            alert("Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-indigo-600">Book Event</h2>
                        <button
                            className="text-gray-500 hover:text-gray-800 transition-colors"
                            onClick={onClose}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Event Details Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Details</h3>
                            
                            <div className="relative h-48 w-full rounded-lg overflow-hidden">
                                <Image
                                    src={event.eventImage || "/placeholder.svg"}
                                    alt={event.eventTitle}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xl font-bold text-gray-900">{event.eventTitle}</h4>
                                
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                                    <span>{event.eventVenue}</span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                                    <span>{formatIndianDate(event.eventStartDate)} to {formatIndianDate(event.eventEndDate)}</span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                                    <span>{event.eventStartTime} to {event.eventEndTime}</span>
                                </div>

                                <div className="bg-indigo-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700 font-medium">Event Cost</span>
                                        <div className="flex items-center text-2xl font-bold text-indigo-600">
                                            <IndianRupee className="w-6 h-6 mr-1" />
                                            <span>{event.eventCoverCost}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600">
                                    <p className="font-medium mb-1">Description:</p>
                                    <p>{event.eventDescription}</p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Form Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Information</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 inline mr-1" />
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={bookingForm.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                            errors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Mail className="w-4 h-4 inline mr-1" />
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={bookingForm.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                            errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your email address"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 inline mr-1" />
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={bookingForm.phoneNumber}
                                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                            errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your 10-digit phone number"
                                    />
                                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="bg-gray-50 p-4 rounded-lg mt-6">
                                <h4 className="font-semibold text-gray-800 mb-3">Payment Summary</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Event Ticket</span>
                                        <span>₹{event.eventCoverCost}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Platform Fee</span>
                                        <span>₹0</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between font-semibold">
                                        <span>Total Amount</span>
                                        <span className="text-indigo-600">₹{event.eventCoverCost}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Button */}
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className={`w-full mt-6 px-6 py-4 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                                    isProcessing 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                                }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Processing Payment...</span>
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        <span>Pay ₹{event.eventCoverCost}</span>
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-3">
                                By clicking "Pay", you agree to our terms and conditions. 
                                Your booking will be confirmed after successful payment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}