import { NextRequest, NextResponse } from "next/server";
import CreateEvent from "@/models/create-event";
import mongoose from "mongoose";

// Simple MongoDB connection (for demonstration)
const MONGODB_URI = process.env.MONGODB_URI as string;
async function dbConnect() {
    console.log("connecting mongoose")
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(MONGODB_URI);
}

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        // Fetch all events without filtering by userId
        const events = await CreateEvent.find({});
        console.log("events", events);
        return NextResponse.json({ success: true, data: events });
    } catch (error) {
        console.error("CreateEvent error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
    }
}
