# THE FORWARD - "Kin Tam Lam Dab" Booking System

A high-performance web application for the "Kin Tam Lam Dab" (กินตามลำดับ) Limited Edition shirt collection by The Forward. Built with React, TypeScript, and Cloudflare's serverless stack.

## Features

- **Luxury Minimalist UI**: A premium designer aesthetic using sophisticated typography (Playfair Display & Montserrat) and a clean monochrome palette.
- **"Kin Tam Lam Dab" Edition**: Exclusive storytelling integration for the eco-friendly Double Layer fabric collection.
- **Multilingual Support**: Fully localized in Thai (🇹🇭), English (🇺🇸), German (🇩🇪), and Danish (🇩🇰).
- **Mobile Optimized**: Optimized for all devices with specific fixes for mobile input behavior.
- **Comprehensive Booking Form**: Captures Name, Phone, Email, Size, Quantity, Address, and Payment Reference.
- **Multiple Item Booking**: Users can add various sizes and quantities to a single order.
- **Order Tracking**: Customers can track their order status (Pending/Confirmed/Shipped/Delivered) via `/track` using their phone number and name.
- **Admin Dashboard**: Secured area at `/admin` for order management, status updates, and real-time monitoring.
- **One-Click Export**: Export order data (including status) to Excel-compatible CSV format.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, i18next, Lucide Icons.
- **Backend**: Cloudflare Pages Functions (Serverless).
- **Database**: Cloudflare D1 (SQLite).
- **Styling**: Modern Vanilla CSS with custom properties and animations.

## Getting Started

### Environment Setup & Local Development
1. Clone the repository and install dependencies: `npm install`
2. Create your local environment files based on the template:
   ```bash
   cp .env.template .env
   cp .env.template .dev.vars
   ```
3. Fill in the secrets inside your new `.env` and `.dev.vars` files:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare free-tier API token.
   - `GITHUB_TOKEN`: Your GitHub access token.
   - `ADMIN_PASSWORD`: Your desired admin dashboard password.
   - `JWT_SECRET`: A secure random string for authentication.
   *(Note: Wrangler uses `.dev.vars` for local Cloudflare Pages environment variables, while `.env` might be used for other tooling.)*
4. Run the development server: `npm run dev`

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
