import mongoose from "mongoose";


const createEventSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    eventTitle: {
        type: String,
        required: true,
    },
    eventVenue: {
        type: String,
        required: true,
    },
    eventStartDate: {
        type: Date,
        required: true,
    },
    eventEndDate: {
        type: Date,
        required: true,
    },
    eventStartTime: {
        type: String,
        required: true,
    },
    eventEndTime: {
        type: String,
        required: true,
    },
    eventCoverCost: {
        type: Number,
        required: true,
    },
    eventImage: {
        type: String,
        required: true,
    },
    eventDescription: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const CreateEvent = mongoose.models.CreateEvent || mongoose.model("CreateEvent", createEventSchema);

export default CreateEvent;
