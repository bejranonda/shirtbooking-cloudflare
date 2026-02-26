# THE FORWARD - Shirt Booking System

A modern, high-performance web application for booking the "Eat in Order" (กินตามลำดับ) Limited Edition Oversized T-shirt collection. Built with React, TypeScript, and Cloudflare's serverless stack.

## Features

- **Official Product Integration**: Integrated specifications for the "Eat in Order" collection:
  - **Premium Fabric**: Double Layer (64% Cotton, 36% Recycled Polyester), 250g weight.
  - **Eco-Friendly**: 100% biodegradable within 4.5 years.
  - **Oversized Sizing**: M (Chest 40") and XL (Chest 48").
- **Multilingual Support**: Fully localized in Thai (🇹🇭), English (🇺🇸), German (🇩🇪), and Danish (🇩🇰).
- **Multiple Item Booking**: Users can add various sizes and quantities to a single order.
- **Payment Verification**: Dedicated field for bank transfer reference numbers.
- **Admin Dashboard**: Secured area at `/admin` for order management.
- **One-Click Export**: Export order data to Excel-compatible CSV format.
- **Modern UI/UX**: Fast, responsive design with SVG flags for cross-platform consistency and branded favicon.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, i18next, Lucide Icons.
- **Backend**: Cloudflare Pages Functions (Serverless).
- **Database**: Cloudflare D1 (SQLite).
- **Styling**: Vanilla CSS with modern custom properties (Variables).

## Getting Started

### Local Development
```bash
npm install
npm run dev
```

### Database Initialization
Initialize your D1 database using the provided schema:
```bash
npx wrangler d1 execute <DATABASE_NAME> --file=./schema.sql
```

### Deployment
```bash
npm run build
npx wrangler pages deploy dist
```

## Admin Configuration
The admin panel is located at `/admin`.
- **Security**: The password has been set as a Cloudflare Secret (`ADMIN_PASSWORD`).
- **Local Dev**: Use the `.dev.vars` file for local development.

## Project Structure
- `src/`: React frontend source code.
- `src/locales/`: Translation files for all supported languages.
- `functions/api/`: Serverless API endpoints for booking and admin tasks.
- `schema.sql`: SQL definition for the D1 database.
