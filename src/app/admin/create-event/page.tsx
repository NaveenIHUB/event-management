"use client"

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from "next/navigation";
import notify from "@/lib/notify";



interface EventFormData {
  eventTitle: string;
  eventVenue: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  coverCost: string;
  eventImage: File | null;
  eventDescription: string;
}

export default function CreateEvent() {

  const router = useRouter();
  const session = useSession()
  const user = session?.data?.user
  console.log("user==>", user)


  const [formData, setFormData] = useState<EventFormData>({
    eventTitle: '',
    eventVenue: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    coverCost: '',
    eventImage: null,
    eventDescription: ''
  });

  const [aiTitles, setAiTitles] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiDescriptionLoading, setAiDescriptionLoading] = useState(false);
  const [aiDescriptionError, setAiDescriptionError] = useState<string | null>(null);



  const handleEnhanceByAI = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiTitles([]);
    try {
      const res = await fetch("/api/event-heading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: formData.eventTitle }),
      });
      const data = await res.json();
      if (data.titles && Array.isArray(data.titles)) {
        setAiTitles(data.titles);
      } else {
        setAiError("No suggestions found.");
      }
    } catch (err) {
      setAiError("Failed to fetch AI suggestions.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleEnhanceDescriptionByAI = async () => {
    setAiDescriptionLoading(true);
    setAiDescriptionError(null);
    try {
      const res = await fetch("/api/event-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: formData.eventDescription }),
      });
      const data = await res.json();
      if (data.description) {
        setFormData(prev => ({
          ...prev,
          eventDescription: data.description
        }));
      } else {
        setAiDescriptionError("No description found.");
      }
    } catch (err) {
      setAiDescriptionError("Failed to fetch AI description.");
    } finally {
      setAiDescriptionLoading(false);
    }
  };


  const handleSelectTitle = (title: string) => {
    setFormData(prev => ({
      ...prev,
      eventTitle: title
    }));
    setAiTitles([]); // Optionally hide suggestions after selection
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      eventImage: file
    }));
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log('Event data:', formData);
  //   // Handle form submission here
  // };

  // ... existing code ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.eventTitle.trim() ||
      !formData.eventVenue.trim() ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.coverCost ||
      isNaN(Number(formData.coverCost)) ||
      Number(formData.coverCost) < 0 ||
      !formData.eventImage ||
      !formData.eventDescription.trim()
    ) {
      notify("Please fill in all fields correctly. Cover Cost must be a non-negative number.");
      return;
    }

    if (!formData.eventImage) {
      notify("Please select an image.");
      return;
    }

    console.log("formData.eventImage==>", formData.eventImage);
    const uploadData = new FormData();
    uploadData.append("image", formData.eventImage);

    let imageUrl = "";
    try {
      console.log("uploadData image==>", uploadData);
      const res = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      console.log("data==>", data);
      if (data.success) {
        imageUrl = data.data.url;
        console.log("Image uploaded! URL: " + data.data.url);
        // Optionally, set the image URL in your state here
      } else {
        alert("Upload failed: " + data.message);
        return { error: "Error while Creating", status: 500 };
      }

      console.log("userID before payload", user?.id)
      const eventPayload = {
        userId: user?.id,
        eventTitle: formData.eventTitle,
        eventVenue: formData.eventVenue,
        eventStartDate: formData.startDate,
        eventEndDate: formData.endDate,
        eventStartTime: formData.startTime,
        eventEndTime: formData.endTime,
        eventCoverCost: Number(formData.coverCost),
        eventImage: imageUrl,
        eventDescription: formData.eventDescription,
      };


      try {
        const res = await fetch("/api/create-event", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventPayload),
        });
        const data = await res.json();
        if (data.success) {
          // alert("Event created successfully!");
          notify("Event created successfully!", "success");
        } else {
          notify("Event creation failed!", "error");
        }

      } catch (err) {
        notify("An error occurred during upload.", "error");
        console.error(err);
      }
    } catch (err) {
      notify("An error occurred while creating the event.", "error");
    }
  }

  return (
    <>
      {/* <Head>
        <title>Create Event - EventHive</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Head> */}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 lg:px-10 py-5 flex justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Event<span className="text-purple-600">Hive</span>
          </h1>
          <button className="text-purple-600" onClick={() => router.push("/admin/dashboard")}>
            Dashboard
          </button>
        </header>

        {/* Main Content */}
        <main className="py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8 lg:p-12">
              <h2 className="text-3xl font-semibold text-gray-900 text-center mb-10">
                Create Event
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    name="eventTitle"
                    placeholder="Enter event name"
                    value={formData.eventTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                  >
                    Enhance by using AI
                  </button>
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    name="eventTitle"
                    placeholder="Enter event name"
                    value={formData.eventTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                    onClick={handleEnhanceByAI}
                    disabled={aiLoading}
                  >
                    {aiLoading ? "Loading..." : "Enhance by using AI"}
                  </button>
                  {aiError && <div className="text-red-500 mt-2">{aiError}</div>}
                  {aiTitles.length > 0 && (
                    <div className="mt-2 bg-gray-100 rounded p-2">
                      <div className="mb-1 text-sm text-gray-700">AI Suggestions:</div>
                      <ul>
                        {aiTitles.map((title, idx) => (
                          <li key={idx}>
                            <button
                              type="button"
                              className="block w-full text-left px-2 py-1 hover:bg-purple-100 rounded"
                              onClick={() => handleSelectTitle(title)}
                            >
                              {title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {/* Event Venue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Venue
                  </label>
                  <input
                    type="text"
                    name="eventVenue"
                    placeholder="Enter venue address"
                    value={formData.eventVenue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                    required
                  />
                </div>

                {/* Date Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                      required
                      min={formData.startDate || undefined}
                      disabled={!formData.startDate}
                    />
                    {!formData.startDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        Please select a Start Date first.
                      </div>
                    )}
                  </div>
                </div>

                {/* Time Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Cover Cost */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Cost
                  </label>
                  <input
                    type="number"
                    name="coverCost"
                    placeholder="Enter cost (e.g., 20, 0, etc.)"
                    value={formData.coverCost}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                    min="0"
                    required
                  />
                </div>

                {/* Event Description Section */}
                <div className="mt-12">
                  {/* <h3 className="text-xl font-semibold text-gray-900 mb-8">
                    Event Description
                  </h3> */}

                  {/* Event Image Upload */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Image
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="eventImage"
                        required
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center hover:border-purple-400 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm font-medium text-gray-600">
                            Upload Here
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event Description */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Description
                    </label>
                    <textarea
                      name="eventDescription"
                      placeholder="Write description here..."
                      value={formData.eventDescription}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors resize-vertical"
                    />
                  </div> */}

                  {/* Event Description */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Description
                    </label>
                    <textarea
                      name="eventDescription"
                      placeholder="Write description here..."
                      value={formData.eventDescription}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors resize-vertical"
                    />
                    <button
                      type="button"
                      className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                      onClick={handleEnhanceDescriptionByAI}
                      disabled={aiDescriptionLoading}
                    >
                      {aiDescriptionLoading ? "Loading..." : "Enhance by using AI"}
                    </button>
                    {aiDescriptionError && (
                      <div className="text-red-500 mt-2">{aiDescriptionError}</div>
                    )}
                    {aiDescriptions.length > 0 && (
                      <div className="mt-2 bg-gray-100 rounded p-2">
                        <div className="mb-1 text-sm text-gray-700">AI Suggestions:</div>
                        <ul>
                          {aiDescriptions.map((desc, idx) => (
                            <li key={idx}>
                              <button
                                type="button"
                                className="block w-full text-left px-2 py-1 hover:bg-purple-100 rounded"
                                onClick={() => handleSelectDescription(desc)}
                              >
                                {desc}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Description
                    </label>
                    <textarea
                      name="eventDescription"
                      placeholder="Write description here..."
                      value={formData.eventDescription}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors resize-vertical"
                      required
                    />
                    <button
                      type="button"
                      className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                      onClick={handleEnhanceDescriptionByAI}
                      disabled={aiDescriptionLoading}
                    >
                      {aiDescriptionLoading ? "Loading..." : "Enhance by using AI"}
                    </button>
                    {aiDescriptionError && (
                      <div className="text-red-500 mt-2">{aiDescriptionError}</div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-8">
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-all duration-200"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
