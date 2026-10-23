# Lumière Atelier — Service Appointment Booking Platform

A production-grade, responsive service appointment booking application crafted for salons, precision repair centres, and executive consultancies. Built with React 19, TypeScript, Vite, and Tailwind CSS.

---

## Features

- **Multi-Industry Domain Presets**:
  - **Lumière Salon & Aesthetic Atelier**: Balayage color chemistry, textural hair sculpts, Zen scalp spa, and keratin rituals.
  - **Apex Precision Horology & Tech Lab**: Mechanical movement overhauls, sapphire crystal seals, and micro-soldering logic board repairs.
  - **Vanguard Advisory & Executive Strategy**: Enterprise AI roadmaps, growth audits, and private corporate structuring.
  - One-click industry switcher to test and experience distinct booking workflows.

- **Real-Time Availability Engine**:
  - Dynamic multi-week availability calendar.
  - Morning, afternoon, and evening time slot groupings.
  - Slot status indicators (`Available`, `1 Slot Remaining / Popular`, `Booked`, `Reserved / Blocked`).
  - Real-time duration calculation stacking primary treatments and add-on rituals.

- **Artisan & Specialist Matching**:
  - Option to select **"First Available Specialist"** for earliest opening.
  - Dedicated master profiles with bios, ratings, specialties, and personal working schedules.

- **Secure Payment Processing Experience**:
  - Three flexible payment schedules: **Hold with 20% Deposit**, **Pay in Full (100%)**, or **Card Guarantee ($0 charged now)**.
  - Card checkout with live brand detection (Visa, Mastercard, Amex, Discover), automatic formatting, and expiration/CVV validation.
  - One-click **Autofill Sandbox Card** for instant end-to-end testing.
  - Apple Pay / Google Pay one-touch express checkout simulation.
  - Simulated **3-D Secure 2.0** bank authorization modal and PCI-DSS Level 1 trust badges.

- **Automated Email Confirmation & Calendar Integration**:
  - Instant booking reference code generation (e.g. `LMR-89241`).
  - **Dispatched Email Preview Modal**: Realistic responsive HTML transactional email client showing the customer's itinerary, QR check-in pass, preparation guidelines, and working "Resend Email" trigger.
  - **Calendar Sync**: Standard RFC 5545 `.ics` file generator that directly downloads to Apple Calendar, Outlook, and mobile devices.
  - **Direct Google Calendar Link**: Single-click URL pre-populating dates, address, and booking details.

- **Self-Service Client Portal & Studio Operations**:
  - **Manage Booking Portal**: Clients can lookup reservations by reference number or email, reschedule to new real-time slots, or cancel with automatic deposit refund policy calculation.
  - **Studio Schedule / Roster View**: Staff operations view showing daily timeline, revenue metrics, and custom slot blocking (staff lunch or equipment maintenance) which instantly syncs to client booking availability.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";`)
- **Icons**: Lucide React
- **Animations**: Motion

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# Navigate to project directory
cd YOUR_REPOSITORY

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

### Building for Production

```bash
npm run build
npm run preview
```

---

## License

Apache-2.0
