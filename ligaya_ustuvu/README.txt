# Ligaya Platform

A volunteer management platform designed for UST UVU (University of Santo Tomas University Volunteer Unit) to promote child advocacy events and facilitate community engagement.

## Table of Contents

- [Overview]
- [Features]
- [Technology Stack]
- [Prerequisites]
- [Installation]
- [Usage]
- [User Roles]
- [API]
- [Project Structure]
- [Contributing]
- [License]

## Overview

Ligaya is a comprehensive web platform that connects volunteers with child advocacy events organized by UST UVU. The platform enables event management, volunteer registration, donation processing, and provides administrative tools for managing community engagement activities.

## Features

### Public Access
- Browse events, team information, and organization details
- User registration and authentication
- Responsive design for all devices

### Volunteer Features
- Event Management
  - Browse and join available events
  - View event details and requirements
  - Cancel event registrations
  - Track joined, upcoming, and completed events

- Donation System
  - Multiple payment methods (Cash, Maya, GCash, Bank Transfer)
  - Upload payment receipts for verification
  - Track donation history and status
  - Edit pending donations

- Dashboard
  - Overview of upcoming and completed events
  - Total verified donations summary
  - Interactive calendar with event dates
  - Discover new events recommendations
  - Recent donation activity

- Profile Management
  - Update personal information
  - Change password with tracking
  - Help and support resources

### Administrative Features
- Event Management
  - Create, edit, and archive events
  - Draft and publish event workflow
  - View registered volunteers per event
  - Upload past and upcoming event media

- User Management
  - View volunteer profiles and registration dates
  - Archive and restore user accounts
  - Account suspension capabilities (archived accounts)

- Donation Management
  - Verify and validate donations
  - Update donation status
  - Archive and restore donation records
  - Analytics and reporting

- Analytics Dashboard
  - Volunteer count tracking
  - Donation trend analysis with filtering (daily, weekly, monthly, yearly)
  - Top donor recognition
  - Interactive charts and graphs

## Technology Stack

- Frontend: React.js with Create React App
- Styling: Tailwind CSS with DaisyUI components
- HTTP Client: Axios
- Backend: JSON Server (Development)
- Database: db.json (Development)

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (version 14.0 or higher)
- npm (version 6.0 or higher)
- Visual Studio Code (recommended)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/j24angeles/Ligaya.git
cd ligaya_ustuvu
```

2. Install dependencies:
```bash
npm install
```

3. Install additional dependencies:
```bash
npm install axios
npm install -g json-server
```

4. Set up the database:
   - Ensure `db.json` is present in the root directory
   - Configure JSON Server endpoints as needed

## Usage

### Development Mode

1. Start the JSON Server (in a separate terminal):
```bash
json-server --watch db.json --port 3001
```

2. Start the React development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## User Roles

### Visitors (Unauthenticated)
- View home, about us, events, and team pages
- Access login and signup forms
- Browse event details (cannot register)

### Volunteers (Authenticated Users)
- Full access to event registration and management
- Donation capabilities with multiple payment methods
- Personal dashboard with analytics
- Profile management and support resources

### Administrators
- Complete event lifecycle management
- User account oversight and moderation
- Donation verification and validation
- Analytics and reporting tools
- System configuration and settings

## API

The application uses JSON Server for development with RESTful endpoints:

- **Base URL**: `http://localhost:3001`
- **Endpoints**:
  - `/events` - Event data management
  - `/users` - User profile information
  - `/donations` - Donation records

## Project Structure

```
LIGAYA_USTUVU/
├── build/                 # Production build files
├── node_modules/          # Dependencies
├── public/               # Static assets
├── src/
│   ├── api/             # API service functions
│   ├── common/          # Shared utilities and constants
│   ├── components/      # Reusable React components
│   ├── context/         # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── App.js           # Main app component
│   ├── index.css        # Global styles
│   ├── index.js         # Entry point
│   └── setupProxy.js    # Development proxy configuration
├── .gitignore
├── db.json              # JSON Server database
├── package-lock.json    # Dependency lock file
├── package.json         # Project configuration
├── README.txt           # Project documentation
└── tailwind.config.js   # Tailwind CSS configuration

## Data Privacy and Security

- User information is protected and cannot be edited by administrators
- Secure authentication system for different user roles
- Payment receipt verification for donation transparency
- Archive/restore functionality instead of permanent deletion

## Support

For help and support:
- Check the in-app Help & Support section
- Contact information available in the volunteer dashboard
- Emergency contact details provided for urgent matters

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Developed for UST UVU Child Advocacy Initiatives