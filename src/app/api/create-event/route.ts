// src/app/api/create-event/route.ts
import { NextRequest, NextResponse } from "next/server";
import CreateEvent from "@/models/create-event";
import mongoose from "mongoose";

// Simple MongoDB connection (for demonstration)
const MONGODB_URI = process.env.MONGODB_URI as string;
async function dbConnect() {
    console.log("connecting mongoo")
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(MONGODB_URI);
}

export async function POST(req: NextRequest) {
    await dbConnect();

    const {
        userId,
        eventTitle,
        eventVenue,
        eventStartDate,
        eventEndDate,
        eventStartTime,
        eventEndTime,
        eventCoverCost,
        eventImage,
        eventDescription,

    } = await req.json();
    console.log("req-json", req.json)
    try {
        console.log("trying", req)
        const event = await CreateEvent.create({
            userId,
            eventTitle,
            eventVenue,
            eventStartDate,
            eventEndDate,
            eventStartTime,
            eventEndTime,
            eventCoverCost,
            eventImage,
            eventDescription,
        });
        console.log("return the responce=>>")
        return NextResponse.json({ success: true, data: event });
    } catch (error) {
        console.error("CreateEvent error:", error);
        return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 500 });
    }
}