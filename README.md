# Cricket Turf Booking Platform

A production-ready cricket turf booking platform built with Next.js 14, TypeScript, Prisma, and Razorpay. This application allows users to book cricket turf slots online with integrated payment processing.

## Features

### User Features
- 🔐 **Authentication**: Secure login/registration with NextAuth
- 📅 **Slot Booking**: Interactive hourly slot selection (7 AM - 2 AM)
- 💳 **Payment Integration**: Razorpay payment gateway (INR)
- 📊 **Dashboard**: View upcoming, past, and cancelled bookings
- ❌ **Cancellation**: Cancel bookings (>2 hours before start time)
- 🕐 **Dynamic Pricing**: ₹1,500/hour (7 AM - 10 PM), ₹1,600/hour (10 PM - 2 AM)

### Owner Features
- 📈 **Admin Dashboard**: View all bookings with filters
- 👥 **User Management**: View all registered users
- 📥 **CSV Export**: Export booking data
- 💰 **Payment Tracking**: View Razorpay payment IDs and status

### Technical Features
- ⚡ **Next.js 14 App Router**: Server-side rendering and API routes
- 🎨 **Tailwind CSS + shadcn/ui**: Modern, responsive UI
- 🗄️ **PostgreSQL + Prisma**: Type-safe database access
- 🔒 **Role-based Access**: USER and OWNER roles
- 🌍 **Timezone Handling**: IST display, UTC storage
- 🚫 **Double Booking Prevention**: Atomic database constraints

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Credentials Provider)
- **Payment**: Razorpay (Test Mode)
- **Validation**: Zod
- **Forms**: React Hook Form
- **Date/Time**: Day.js with timezone support

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Razorpay account (for test keys)

## Installation

### 1. Clone or navigate to the project directory

```bash
cd cricket-turf-booking
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/cricket_turf_booking?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# Razorpay (Test Mode)
RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_secret_key"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_your_key_id"
```

**Important**: 
- Replace database credentials with your PostgreSQL connection string
- Generate a secure `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Get Razorpay test keys from https://dashboard.razorpay.com/

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with initial users
npx ts-node prisma/seed.ts
```

This will create:
- **Owner account**: `owner@turf.com` / `Owner@1234`
- **Sample user**: `user@example.com` / `User@1234`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### As a User

1. **Sign Up**: Create an account at `/register`
2. **Browse**: View the landing page with turf details
3. **Book**: Navigate to `/venue` to select date and time slots
4. **Pay**: Complete payment via Razorpay
5. **Manage**: View/cancel bookings in `/dashboard`

### As an Owner

1. **Login**: Use `owner@turf.com` / `Owner@1234`
2. **Dashboard**: Access `/owner` to view all bookings
3. **Filter**: Filter by date range and status
4. **Export**: Download bookings as CSV
5. **Users**: View all registered users

## Project Structure

```
cricket-turf-booking/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # NextAuth endpoints
│   │   ├── bookings/          # Booking management
│   │   ├── owner/             # Owner-only endpoints
│   │   ├── razorpay/          # Payment processing
│   │   ├── register/          # User registration
│   │   └── slots/             # Slot availability
│   ├── dashboard/             # User dashboard
│   ├── login/                 # Login page
│   ├── owner/                 # Owner dashboard
│   ├── register/              # Registration page
│   ├── venue/                 # Booking page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles
├── components/
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── auth.ts                # NextAuth configuration
│   ├── booking-utils.ts       # Booking logic utilities
│   ├── prisma.ts              # Prisma client
│   └── utils.ts               # General utilities
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── types/
│   └── next-auth.d.ts         # TypeScript definitions
├── .env.example               # Environment template
├── middleware.ts              # Route protection
├── package.json
└── README.md
```

## Database Schema

### User
- id, name, email, phone, passwordHash, role (USER/OWNER)

### Booking
- id, userId, date, startTimeUtc, endTimeUtc, slotsCount, amountPaise, status
- Unique constraint prevents double bookings

### Payment
- id, bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature, amountPaise, status

## Key Business Rules

1. **Operating Hours**: 7:00 AM - 2:00 AM (next day)
2. **Slot Duration**: 60 minutes
3. **Pricing**:
   - ₹1,500/hour (7 AM - 10 PM)
   - ₹1,600/hour (10 PM - 2 AM)
4. **Cancellation**: Allowed >2 hours before start time
5. **Timezone**: IST for display, UTC for storage
6. **Payment**: Razorpay signature verification required

## Testing Razorpay

Use these test card details in Razorpay checkout:

- **Card Number**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## Deployment

### Database
1. Set up PostgreSQL on your hosting provider
2. Update `DATABASE_URL` in production environment

### Next.js
1. Build the application: `npm run build`
2. Deploy to Vercel, Railway, or any Node.js hosting
3. Set environment variables in hosting dashboard

### Razorpay
1. Switch to live mode keys in production
2. Complete KYC verification on Razorpay

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate dev  # Create new migration
```

## Security Notes

- Passwords are hashed with bcrypt
- NextAuth handles session management
- Razorpay signatures are verified server-side
- Role-based access control via middleware
- SQL injection prevented by Prisma

## Troubleshooting

**Database connection error**:
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

**Razorpay payment fails**:
- Verify test keys are correct
- Check browser console for errors
- Ensure Razorpay script is loaded

**Slots not showing**:
- Check timezone configuration
- Verify database has no conflicting bookings
- Clear browser cache

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
