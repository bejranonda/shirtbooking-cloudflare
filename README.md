# THE FORWARD - Shirt Booking System

A modern, high-performance web application for booking exclusive shirt collections. Built with React, TypeScript, and Cloudflare's serverless stack.

## Features

- **Modern Premium UI**: Redesigned with a clean, iOS-inspired aesthetic, featuring glassmorphism effects, smooth animations, and a sophisticated color palette.
- **Multilingual Support**: Fully localized in Thai (🇹🇭), English (🇺🇸), German (🇩🇪), and Danish (🇩🇰).
- **Mobile Optimized**: Optimized for all devices with specific fixes for mobile input behavior.
- **Multiple Item Booking**: Users can add various sizes and quantities to a single order.
- **Payment Verification**: Dedicated field for bank transfer reference numbers.
- **Admin Dashboard**: Secured area at `/admin` for order management and real-time monitoring.
- **One-Click Export**: Export order data to Excel-compatible CSV format.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, i18next, Lucide Icons.
- **Backend**: Cloudflare Pages Functions (Serverless).
- **Database**: Cloudflare D1 (SQLite).
- **Styling**: Modern Vanilla CSS with custom properties and animations.

## Getting Started

### Local Development
1. Install dependencies: `npm install`
2. Create a `.dev.vars` file for local secrets: `ADMIN_PASSWORD=your_local_password`
3. Run dev server: `npm run dev`

### Database Initialization
Initialize your D1 database using the provided schema:
```bash
npx wrangler d1 execute <DATABASE_NAME> --remote --file=./schema.sql
```

### Deployment
```bash
npm run build
npx wrangler pages deploy dist
```

## Admin Configuration
The admin panel is located at `/admin`.
- **Security**: Access is controlled via the `ADMIN_PASSWORD` secret.
- **Cloudflare Secrets**: Set your production password using:
  ```bash
  echo "your_password" | npx wrangler pages secret put ADMIN_PASSWORD --project-name <PROJECT_NAME>
  ```

## Project Structure
- `src/`: React frontend source code.
- `src/locales/`: i18n translation files.
- `functions/api/`: Serverless API endpoints.
- `schema.sql`: SQL definition for the D1 database.
