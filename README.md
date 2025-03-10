# RizzTek Tryout Platform

A modern, interactive platform for creating, managing, and taking online tests and assessments.

## Features

- **User Authentication**: Secure login and registration system
- **Create Tryouts**: Build tests with multiple question types (Multiple Choice, True/False, Short Answer)
- **Time-Limited Tests**: Set duration and availability windows for each test
- **Dynamic Filtering**: Find tests by category or search by title
- **Real-time Countdown**: Timer shows remaining time during test attempts
- **Progress Tracking**: Automatically saves answers as you go
- **Test Management**: Edit, delete, and view results for your created tests
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Framework**: [Remix](https://remix.run/) (React-based)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **State Management**: React hooks
- **Form Handling**: Remix forms with client validation
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Project Structure

```
tryout-rizztek-fe/
├── app/                       # Main application code
│   ├── auth/                  # Authentication related code
│   ├── components/            # Reusable UI components
│   │   ├── elements/          # Custom elements
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/                 # API integration hooks
│   ├── lib/                   # Utility functions
│   └── routes/                # Application routes
│       ├── _page._index.tsx   # Home page
│       ├── _page.login.tsx    # Login page
│       ├── _page.tryout.attempt.$id.tsx  # Test taking page
│       ├── _page.tryout.form.tsx         # Test creation form
│       ├── _page.tryout.view.$id.tsx     # Test preview page
│       └── _page.tryout.edit.$id.tsx     # Test editing page
├── public/                    # Static assets
└── server/                    # Server-specific code
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/tryout-rizztek-fe.git
   cd tryout-rizztek-fe
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables (see Environment Variables)

4. **Run the development server**

   ```bash
   pnpm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to your localhost

## Authentication

The application uses token-based authentication. Tokens are stored in cookies and automatically included in API requests. The authentication flow:

1. User logs in with email/password
2. Server returns a JWT token
3. Token is stored in a cookie
4. Subsequent requests include this token in the Authorization header

## Available Pages

- **Home** (`/`): Lists all available tryouts with filtering options
- **Login** (`/login`): User authentication
- **Create Tryout** (`/tryout/form`): Form to create a new test
- **View Tryout** (`/tryout/view/:id`): Preview a test before attempting
- **Attempt Tryout** (`/tryout/attempt/:id`): Take a test
- **Edit Tryout** (`/tryout/edit/:id`): Modify an existing test

## API Integration

The frontend connects to a backend API using fetch. API interactions are abstracted in the `hooks/` directory:

- `tryouts.ts`: CRUD operations for tests
- `submissions.ts`: Handling test submissions and answers
- `auth.ts`: Authentication-related API calls
