"use client"

import Image from "next/image"
import Link from "next/link"
import { CalendarIcon, ClockIcon, MapPinIcon, Trash2Icon } from "lucide-react"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import EventModal from "@/components/EventModal"; // Adjust the path as needed
import notify from "@/lib/notify";

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


const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-indigo-200 border-solid rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-indigo-600 border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

function formatIndianDate(dateStr: string) {
  const date = new Date(dateStr);
  const weekday = date.toLocaleDateString('en-IN', { weekday: 'long' });  // e.g. Wednesday
  const dayMonthYear = date.toLocaleDateString('en-IN').replace(/\//g, '-');  // 25-06-2025
  return `${weekday}, ${dayMonthYear}`;
}



export default function Home() {
  const router = useRouter();
  const session = useSession();
  const user = session?.data?.user

  console.log("user", user)
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  console.log("eventsdata=>", events)


  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/delete-event?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        // Remove the event from the UI
        setEvents(events => events.filter(event => event._id !== id));
        notify("Event deleted successfully!", "success");
      } else {
        notify(data.error || "Failed to delete event", "error");
      }
    } catch (err) {
      notify("An error occurred while deleting the event.", "error");
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.id) return;

      try {
        // const res = await fetch(`/api/get-admin-event?userId=${user.id}`);
        const res = await fetch(`/api/get-admin-event?userId=${user.id}`);
        console.log("res===>", res)
        const data = await res.json();

        if (data.success) {
          console.log("data======", data)
          setEvents(data.data);
        } else {
          console.error("Failed to fetch events:", data.error);
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    fetchEvents();
  }, [user?.id]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-indigo-600">
            Event <span className="text-black">Hive</span>
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      {/* <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto bg-indigo-600 rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row items-center p-8 md:p-12">
            <div className="md:w-2/3 text-white space-y-4 mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold">
                Discover and experience
                <br />
                Unforgettable Events
              </h2>
              <p className="text-sm md:text-base opacity-90">
                Join in the world of events. Discover new life
                <br />
                experiences of entertainment in your area!
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button className="bg-white text-indigo-600 px-4 py-2 rounded-full text-sm font-medium">
                  Discover now
                </button>
                <button className="border border-white text-white px-4 py-2 rounded-full text-sm font-medium" onClick={() => router.push("/admin/create-event")}>
                  Add Event
                </button>
              </div>
            </div>
            <div className="md:w-1/3 relative flex justify-center">
              <div className="relative w-32 h-32">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Graduation cap"
                  width={100}
                  height={100}
                  className="absolute -top-4 -left-4"
                />
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Trophy cup"
                  width={100}
                  height={100}
                  className="absolute bottom-0 right-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden relative bg-indigo-600">
          {/* Background Image */}
          <div className="absolute inset-0 -z-10">
            <Image
              src="https://res.cloudinary.com/dnql3pbio/image/upload/v1749028974/z005olb8s1xg59gzs0iq.jpg"
              alt="Event background"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            {/* Optional overlay for better text contrast */}
            <div className="absolute inset-0 bg-black opacity-40"></div>
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row items-center p-8 md:p-12 relative z-10 text-white">
            <div className="md:w-2/3 space-y-4 mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold">
                Discover and experience
                <br />
                Unforgettable Events
              </h2>
              <p className="text-sm md:text-base opacity-90">
                Join in the world of events. Discover new life
                <br />
                experiences of entertainment in your area!
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  className="border border-white text-white px-4 py-2 rounded-full text-sm font-medium"
                  onClick={() => router.push("/admin/create-event")}
                >
                  Add Event
                </button>
              </div>
            </div>
            {/* You can remove or keep this empty if no extra images are needed on right side */}
            <div className="md:w-1/3"></div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-6">Listed Events</h2>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border">
                    <div className="relative h-48 w-full">
                      <Image
                        src={event.eventImage || "/placeholder.svg"}
                        alt={event.eventTitle}
                        fill
                        className="object-cover rounded"
                        sizes="(max-width: 768px) 100vw, 33vw" // responsive hint (optional)
                        priority // optional: makes it load faster
                      />
                      {/* <span className="absolute top-2 left-2 bg-white text-xs px-2 py-1 rounded">NEW</span> */}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{event.eventTitle}</h3>
                      <div className="flex items-center text-gray-500 text-sm mt-2">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        <span>{event.eventVenue}</span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center text-gray-500 text-xs">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          <span>{formatIndianDate(event.eventStartDate)}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-xs">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          <span>{event.eventStartTime}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="ml-2 text-red-600 hover:text-red-800"
                          title="Delete Event"
                        >
                          <Trash2Icon className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="text-indigo-600 text-sm font-medium hover:underline"
                        >
                          View Event
                        </button>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      {/* Modal Section */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

    </main>
  )
}
