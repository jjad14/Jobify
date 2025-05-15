# Jobify

Jobify is a job tracking app that helps users organize and manage their job applications throughout the hiring process. Users can sign in using Google or email, track job statuses (interviewed, rejected, accepted, etc.), and view monthly analytics. It also allows attaching detailed job descriptions for each entry.

### Prerequisites

-   [Node.js](https://nodejs.org/) (LTS recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Features

-   Google and Email Sign-In (via Clerk)
-   Monthly Job Application Analytics
-   Track job applications with detailed descriptions
-   Clean and responsive UI with Tailwind and Shadcn components

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Language**: TypeScript
-   **Auth**: [Clerk](https://clerk.dev/)
-   **Styling**: Tailwind CSS + [Shadcn/ui](https://ui.shadcn.com/)
-   **Database**: PostgreSQL (via [Render](https://render.com/))
-   **ORM**: Prisma

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/jobify.git
cd jobify
```

### 2. Install dependencies

Clone the repository and install dependencies:

```sh
git clone https://github.com/jjad14/Jobify.git
cd your-repo
npm install
```

### 3. Set up Prisma

```bash
npx prisma init
npx prisma migrate dev
npx prisma studio
```

### 4. Configure environment variables

Create a `.env` file in the root directory and add the following:

```env
# Clerk (Authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_<your_key>
CLERK_SECRET_KEY=sk_test_<your_key>

# Render DB
DATABASE_URL=postgresql://<your_db_url>
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## License

This project is licensed under the MIT License.
