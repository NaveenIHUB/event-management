// src/app/api/delete-event/route.ts
import { NextRequest, NextResponse } from "next/server";
import CreateEvent from "@/models/create-event";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(MONGODB_URI);
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "Event ID is required" }, { status: 400 });
  }

  try {
    const deleted = await CreateEvent.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Event deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete event" }, { status: 500 });
  }
}