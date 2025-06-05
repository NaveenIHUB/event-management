# 🎫 Event Management Application

A full-stack Event Management platform where **admins** can create and manage events, and **users** can browse and book event tickets. Built with **Next.js**, **Express**, and **MongoDB**, this application provides a smooth experience for event organizers and attendees alike.

## Features

###  Admin Journey – Create & Manage Events
```bash 
Signup  ->  Login  ->  src/app/admin/dashboard/page.tsx  ->  src/app/admin/create-event/page.tsx
```
- **Sign Up / Login**
  - Admins can securely register and log in to the platform.
  - Authenticated sessions provide secure access to admin functionalities.

- **Create Events**
  - Admin can navigate to the "Create Event" page and enter:
    - Event Title *(AI-enhanced input)*
    - Description *(AI-enhanced input)*
    - Date & Time
    - Location
  - On submission, the event is saved to the database and becomes visible in the admin dashboard.

- **Manage Events**
  - View a list of all events created by the logged-in admin.
  - Delete events as needed.
  - Provides full control over event listings.

---

### User Journey – View & Book Events  
```bash 
src/app/user/events/page.tsx
```
- **Browse Events**
  - Any user (guest or logged in) can view a list of all public events created by different admins.

- **View Event Details**
  - Click an event to view its:
    - Description
    - Date & Time
    - Location

- **Book Tickets**
  - Users proceed through a simple booking flow.
  - Bookings are recorded and acknowledged via confirmation messages.

---
### Flow Diagram
![Event Management Application - flow diagram](https://github.com/user-attachments/assets/79c60db9-ff7f-4766-975d-04e47b6efcb7)


## 🛠️ Tech Stack

| Layer      | Tech Used                                    |
|------------|-----------------------------------------------|
| Frontend   | Next.js (App Router), TypeScript, Tailwind CSS |
| Backend    | Node.js, Express (via `/api` routes)          |
| Database   | MongoDB                                       |
| Image Storage   | Cloudinary                                       |

---

## Future Enhancements

### Ticket Inventory and Availability
- Set a maximum number of tickets per event.
- Prevent overbooking and show available tickets in real time.

### Email Notifications
- Send confirmation emails upon ticket booking and event updates.
- Use providers like Resend, SendGrid, or Amazon SES.

### User Dashboard
- Personal area to view:
  - Upcoming bookings
  - Past event history
  - Cancel bookings (if allowed)

### Role-Based Access Control (RBAC)
- Define roles: Super Admin, Event Manager, User.
- Enforce access restrictions based on roles.

### Analytics Dashboard for Admins
- Show metrics like:
  - Number of tickets booked
  - Event popularity
  - Revenue trends

### Payment Gateway Integration
- Enable paid events with online payments.
- Support UPI, Cards, Net Banking.
- Integrate Razorpay, Stripe, or PayPal for secure transactions.


## Run the Application Locally
### Clone the Repository
```bash
git clone https://github.com/NaveenIHUB/event-management.git
cd event-management
```

### Install Dependencies 
```bash
npm install
```
### Add Environment Variables(.env)
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
# NextAuth Authentication Secrets
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
# Frontend API URL (used for fetch calls)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
# Cloudinary for Image Uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Gemini AI API Key (if you are using Google Gemini AI for content generation)
GEMINI_API_KEY=your_gemini_api_key

```

### Start the Development Server
```bash
npm run dev
```
