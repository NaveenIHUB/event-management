"use client"

import Image from "next/image"
import { CalendarIcon, ClockIcon, MapPinIcon, SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import EventModal from "@/components/EventModal"; // Adjust the path as needed
import BookingModal from "@/components/BookingModal"; // Import the new BookingModal


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
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [bookingEvent, setBookingEvent] = useState<Event | null>(null); // New state for booking modal
  const [searchQuery, setSearchQuery] = useState("");

  console.log("eventsdata=>", events)

  // Search function
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter((event) => {
      const searchTerm = query.toLowerCase();
      const titleMatch = event.eventTitle.toLowerCase().includes(searchTerm);
      const descriptionMatch = event.eventDescription.toLowerCase().includes(searchTerm);
      const dateMatch = formatIndianDate(event.eventStartDate).toLowerCase().includes(searchTerm);
      const venueMatch = event.eventVenue.toLowerCase().includes(searchTerm);
      
      return titleMatch || descriptionMatch || dateMatch || venueMatch;
    });

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch all events without userId filter
        const res = await fetch(`/api/get-admin-event`);
        console.log("res===>", res);
        const data = await res.json();
  
        if (data.success) {
          console.log("data======", data);
          setEvents(data.data);
          setFilteredEvents(data.data); // Initialize filtered events
        } else {
          console.error("Failed to fetch events:", data.error);
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };
  
    fetchEvents();
  }, []); // No dependency on user?.id anymore
  

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
              {/* Search Bar */}
              <div className="relative max-w-md pt-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search events by title, date, location, or description..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Listed Events</h2>
            {searchQuery && (
              <p className="text-sm text-gray-600">
                {filteredEvents.length} result{filteredEvents.length !== 1 ? 's' : ''} found for "{searchQuery}"
              </p>
            )}
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {filteredEvents.length === 0 && searchQuery ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-2">No events found</p>
                  <p className="text-gray-400 text-sm">Try adjusting your search terms</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event, index) => (
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
                            {/* <span>{event.eventStartDate}</span> */}
                            <span>{formatIndianDate(event.eventStartDate)}</span>
                          </div>
                          <div className="flex items-center text-gray-500 text-xs">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            <span>{event.eventStartTime}</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                          <button
                            onClick={() => setSelectedEvent(event)}
                            className="text-indigo-600 text-sm font-medium hover:underline"
                          >
                            View Event
                          </button>

                          <button
                            onClick={() => setBookingEvent(event)} // Updated to use booking modal
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Book Now!
                          </button>
                        </div>
                        
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      {/* Event Details Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Booking Modal */}
      {bookingEvent && (
        <BookingModal
          event={bookingEvent}
          onClose={() => setBookingEvent(null)}
        />
      )}

    </main>
  )
}

// "use client"

// import Image from "next/image"
// import { CalendarIcon, ClockIcon, MapPinIcon, SearchIcon } from "lucide-react"
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import EventModal from "@/components/EventModal"; // Adjust the path as needed


// interface Event {
//   _id: string;
//   userId: string;
//   eventTitle: string;
//   eventVenue: string;
//   eventStartDate: string;
//   eventEndDate: string;
//   eventStartTime: string;
//   eventEndTime: string;
//   eventCoverCost: number;
//   eventImage: string;
//   eventDescription: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }


// const LoadingSpinner = () => {
//   return (
//     <div className="flex justify-center items-center py-12">
//       <div className="relative">
//         <div className="w-12 h-12 border-4 border-indigo-200 border-solid rounded-full animate-spin">
//           <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-indigo-600 border-solid rounded-full animate-spin"></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function formatIndianDate(dateStr: string) {
//   const date = new Date(dateStr);
//   const weekday = date.toLocaleDateString('en-IN', { weekday: 'long' });  // e.g. Wednesday
//   const dayMonthYear = date.toLocaleDateString('en-IN').replace(/\//g, '-');  // 25-06-2025
//   return `${weekday}, ${dayMonthYear}`;
// }


// export default function Home() {
//   const router = useRouter();
//   const session = useSession();
//   const user = session?.data?.user

//   console.log("user", user)
//   const [events, setEvents] = useState<Event[]>([]);
//   const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   console.log("eventsdata=>", events)

//   // Search function
//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
    
//     if (!query.trim()) {
//       setFilteredEvents(events);
//       return;
//     }

//     const filtered = events.filter((event) => {
//       const searchTerm = query.toLowerCase();
//       const titleMatch = event.eventTitle.toLowerCase().includes(searchTerm);
//       const descriptionMatch = event.eventDescription.toLowerCase().includes(searchTerm);
//       const dateMatch = formatIndianDate(event.eventStartDate).toLowerCase().includes(searchTerm);
//       const venueMatch = event.eventVenue.toLowerCase().includes(searchTerm);
      
//       return titleMatch || descriptionMatch || dateMatch || venueMatch;
//     });

//     setFilteredEvents(filtered);
//   };

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         // Fetch all events without userId filter
//         const res = await fetch(`/api/get-admin-event`);
//         console.log("res===>", res);
//         const data = await res.json();
  
//         if (data.success) {
//           console.log("data======", data);
//           setEvents(data.data);
//           setFilteredEvents(data.data); // Initialize filtered events
//         } else {
//           console.error("Failed to fetch events:", data.error);
//         }
//       } catch (error) {
//         console.error("API error:", error);
//       }
//     };
  
//     fetchEvents();
//   }, []); // No dependency on user?.id anymore
  

//   return (
//     <main className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="px-6 py-4">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-xl font-bold text-indigo-600">
//             Event <span className="text-black">Hive</span>
//           </h1>
//         </div>
//       </header>

      
//       <section className="px-6 py-8">
//         <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden relative bg-indigo-600">
//           {/* Background Image */}
//           <div className="absolute inset-0 -z-10">
//             <Image
//               src="https://res.cloudinary.com/dnql3pbio/image/upload/v1749028974/z005olb8s1xg59gzs0iq.jpg"
//               alt="Event background"
//               fill
//               style={{ objectFit: "cover" }}
//               priority
//             />
//             {/* Optional overlay for better text contrast */}
//             <div className="absolute inset-0 bg-black opacity-40"></div>
//           </div>

//           {/* Content */}
//           <div className="flex flex-col md:flex-row items-center p-8 md:p-12 relative z-10 text-white">
//             <div className="md:w-2/3 space-y-4 mb-6 md:mb-0">
//               <h2 className="text-2xl md:text-3xl font-bold">
//                 Discover and experience
//                 <br />
//                 Unforgettable Events
//               </h2>
//               <p className="text-sm md:text-base opacity-90">
//                 Join in the world of events. Discover new life
//                 <br />
//                 experiences of entertainment in your area!
//               </p>
//               {/* Search Bar */}
//               <div className="relative max-w-md pt-2">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <SearchIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search events by title, date, location, or description..."
//                   value={searchQuery}
//                   onChange={(e) => handleSearch(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//                 />
//               </div>
//             </div>
//             {/* You can remove or keep this empty if no extra images are needed on right side */}
//             <div className="md:w-1/3"></div>
//           </div>
//         </div>
//       </section>

//       {/* Events Section */}
//       <section className="px-6 py-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-bold">Listed Events</h2>
//             {searchQuery && (
//               <p className="text-sm text-gray-600">
//                 {filteredEvents.length} result{filteredEvents.length !== 1 ? 's' : ''} found for "{searchQuery}"
//               </p>
//             )}
//           </div>
//           {loading ? (
//             <LoadingSpinner />
//           ) : (
//             <>
//               {filteredEvents.length === 0 && searchQuery ? (
//                 <div className="text-center py-12">
//                   <p className="text-gray-500 text-lg mb-2">No events found</p>
//                   <p className="text-gray-400 text-sm">Try adjusting your search terms</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredEvents.map((event, index) => (
//                     <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border">
//                       <div className="relative h-48 w-full">
//                         <Image
//                           src={event.eventImage || "/placeholder.svg"}
//                           alt={event.eventTitle}
//                           fill
//                           className="object-cover rounded"
//                           sizes="(max-width: 768px) 100vw, 33vw" // responsive hint (optional)
//                           priority // optional: makes it load faster
//                         />
//                         {/* <span className="absolute top-2 left-2 bg-white text-xs px-2 py-1 rounded">NEW</span> */}
//                       </div>
//                       <div className="p-4">
//                         <h3 className="font-semibold text-lg">{event.eventTitle}</h3>
//                         <div className="flex items-center text-gray-500 text-sm mt-2">
//                           <MapPinIcon className="w-4 h-4 mr-1" />
//                           <span>{event.eventVenue}</span>
//                         </div>
//                         <div className="flex justify-between items-center mt-4">
//                           <div className="flex items-center text-gray-500 text-xs">
//                             <CalendarIcon className="w-3 h-3 mr-1" />
//                             {/* <span>{event.eventStartDate}</span> */}
//                             <span>{formatIndianDate(event.eventStartDate)}</span>
//                           </div>
//                           <div className="flex items-center text-gray-500 text-xs">
//                             <ClockIcon className="w-3 h-3 mr-1" />
//                             <span>{event.eventStartTime}</span>
//                           </div>
//                         </div>
//                         <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
//                           <button
//                             onClick={() => setSelectedEvent(event)}
//                             className="text-indigo-600 text-sm font-medium hover:underline"
//                           >
//                             View Event
//                           </button>

//                           <button
//                             onClick={() => setSelectedEvent(event)}
//                             className="text-indigo-600 text-sm font-medium hover:underline"
//                           >
//                             Book Now!
//                           </button>
//                         </div>
                        
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </section>
//       {/* Modal Section */}
//       {selectedEvent && (
//         <EventModal
//           event={selectedEvent}
//           onClose={() => setSelectedEvent(null)}
//         />
//       )}

//     </main>
//   )
// }