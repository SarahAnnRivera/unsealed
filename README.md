# UNSEALED — Stories Worth Opening

**An interactive historical-fiction archive powered by React, Stripe, Supabase, and automated email delivery.**

UNSEALED is a live digital storytelling platform that delivers original historical fiction through letters, diaries, transcripts, and other period-inspired documents.

The project combines a responsive frontend with payment processing, customer enrollment, database management, and automated content delivery.

## Live Application

[Explore UNSEALED](https://readunsealed.com)

## Tech Stack

- **Frontend:** React, JavaScript, CSS
- **Database:** Supabase (PostgreSQL)
- **Payments:** Stripe Checkout and webhooks
- **Email Automation:** Resend
- **Deployment:** Vercel
- **Project Management:** Jira

## Key Features

### Historical Fiction Archives
Readers explore original stories presented as collections of historical documents, with multiple reading and purchase options.

### Stripe Payment Integration
Stripe Checkout handles purchases, with webhook processing connecting successful transactions to customer enrollment.

### Supabase Database Integration
Supabase manages customer enrollment records, story selections, and delivery preferences.

### Automated Email Delivery
Resend supports scheduled story delivery, connecting customer purchases and enrollment data to an automated email workflow.

### Responsive User Interface
React components provide a consistent browsing and purchasing experience across devices.

## Technical Highlights

- Integrated multiple third-party services into a functioning customer journey.
- Connected payment confirmation to database enrollment and content delivery.
- Implemented separate purchase and free-enrollment flows.
- Developed reusable React components for story selection and checkout.
- Deployed and maintained a live application through Vercel.

## Project Background

UNSEALED is an independently developed product combining creative content, frontend development, third-party integrations, and business operations.

The project demonstrates practical experience translating a product concept into a working application, coordinating multiple services, and managing the customer experience from discovery through delivery.

## Author

**Sarah Rivera Balcazar**

[GitHub](https://github.com/SarahAnnRivera) | [Portfolio](https://portfolio-resume-one-psi.vercel.app/)app/docs/deployment)


## Prerequisites & Installation

### Prerequisites

The project was developed locally using:

- Node.js v24.19.0
- npm v11.17.0
- Git

Other Node.js versions have not been verified.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SarahAnnRivera/unsealed.git
   ```

2. Navigate into the project directory:

   ```bash
   cd unsealed
   ```

3. Install dependencies:

   ```bash
   npm install
   ```


4. Create a local environment configuration:

   Copy `.env.example` to `.env` and provide the
   required values for your own development environment.

   The application uses:
   - Supabase for database operations
   - Stripe for payments and webhooks
   - Resend for transactional emails
   - A cron secret for scheduled operations

   Some integrations require additional configuration
   in their respective service dashboards.


5. Start the development server:

   ```bash
   npm start
   ```

6. Open the local address displayed in your terminal,
   typically:

   http://localhost:3000

### Configuration Notes

Some features require external service credentials
and cannot function without the appropriate configuration.

Do not commit API keys, private credentials, or `.env`
files containing secrets to GitHub.


### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
