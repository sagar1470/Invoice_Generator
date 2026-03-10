# Invoice Generator

A full-stack web application for creating, managing, and tracking professional invoices. Built with Next.js, MongoDB, and Auth.js.

## Features

- **User Authentication** - Secure email-based magic link login
- **Invoice Management** - Create, edit, and delete invoices
- **Dashboard Analytics** - Track total revenue, paid/unpaid invoices
- **Email Integration** - Send invoices directly to clients
- **PDF Generation** - Export invoices as PDF
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Auth.js (NextAuth)
- **Styling**: Tailwind CSS + shadcn/ui
- **Email**: Nodemailer (Gmail SMTP)
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+ 
- MongoDB database (local or Atlas)
- Gmail account for email service

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Authentication (required for Auth.js)
# Generate a secure random string using: openssl rand -base64 32
AUTH_SECRET=your-generated-secret-key-here

# Database
MONGODB_URI=your-mongodb-connection-string

# Email (Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-specific-password

# Optional: Set this for production
NEXTAUTH_URL=http://localhost:3000

💻 Installation

Clone the repository
git clone https://github.com/yourusername/invoice-generator.git
cd invoice-generator

Install dependencies

bash
npm install
Set up environment variables (see above)

Run the development server

bash
npm run dev
Open http://localhost:3000

## Screenshots
 ###Login - Enter your email to receive a magic link
![Onboarding](Screenshots/onboarding.png)

 ###Dashboard - View your invoice statistics and recent activity
![Dashboard](Screenshots/dashboard.png)

 ###Create Invoice - Fill in client details, items, and amounts
![Invoice](Screenshots/invoice-form.png)

 Manage Invoices - Edit, delete, or mark invoices as paid

 ###Send Emails - Email invoices directly to clients
![Email](Screenshots/email-template.png)

 ###Settings - Upload logo and signature for branding
![Setting](Screenshots/settings.png)