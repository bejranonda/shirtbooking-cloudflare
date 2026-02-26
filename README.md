# Shirt Booking System - The Forward

A modern, multilingual web application for booking exclusive shirts from "The Forward" collection. Built with React, TypeScript, Vite, and Cloudflare Pages/D1.

## Features

- **Multilingual Support**: Available in Thai (🇹🇭), English (🇺🇸), German (🇩🇪), and Danish (🇩🇰).
- **Multiple Item Booking**: Users can add multiple shirt sizes and quantities to a single booking list.
- **Payment Verification**: Includes a field for bank transfer reference numbers to streamline payment verification.
- **Admin Dashboard**: Secured administrative area to view orders and export data.
- **Excel/CSV Export**: One-click export functionality for easy order management in Excel or Google Sheets.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Serverless Backend**: Powered by Cloudflare Workers (Pages Functions) and D1 SQL database.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Lucide Icons, i18next.
- **Backend**: Cloudflare Pages Functions.
- **Database**: Cloudflare D1 (SQLite).
- **Styling**: Vanilla CSS with modern variables and flex/grid layouts.

## Admin Access

The admin dashboard is accessible at `/admin`.
- **Default Password**: `admin1234` (Configurable in `functions/api/admin/bookings.ts`)

## Setup & Deployment

1. **Local Development**:
   ```bash
   npm install
   npm run dev
   ```

2. **Database Setup**:
   Initialize your D1 database using the provided `schema.sql`:
   ```bash
   npx wrangler d1 execute <DATABASE_NAME> --file=./schema.sql
   ```

3. **Cloudflare Deployment**:
   ```bash
   npm run build
   npx wrangler pages deploy dist
   ```

## Project Structure

- `src/`: React frontend application.
- `functions/api/`: Backend API endpoints for booking and administration.
- `src/locales/`: i18n translation files.
- `schema.sql`: Database schema definition.
- `wrangler.toml`: Cloudflare configuration.
