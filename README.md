# KAHANI INFRACON – Integrated Construction Management System

KAHANI INFRACON is a professional construction-company management application designed for desktop and Android-friendly workflows. The prototype focuses on the dashboard and the core project, DPR, inventory, and billing modules while keeping the architecture modular for future AI and analytics features.

## Features included in this prototype
- Construction-sector dashboard with navy blue, white, and green design language
- Responsive sidebar and mobile-first layout
- Project management module with sample project records
- Daily Progress Report (DPR) workflow with progress tracking and form validation
- Material inventory module with stock and movement tracking
- Billing, BOQ, and RA Bill summary module with invoice-like tables
- Demo data clearly marked to avoid confusion with production data
- PostgreSQL-ready database schema and API endpoints
- Secure authentication preparation using hashed passwords and JWT-based permissions
- Role-based permission scaffolding for key construction roles

## Architecture
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Security: JWT + bcrypt password hashing + middleware authorization checks

## Repository structure
- `src/` – frontend application
- `server/` – Express API and PostgreSQL bootstrapping logic
- `index.html` – app entry point
- `package.json` – project dependencies and scripts
- `.env.example` – environment configuration template
- `docker-compose.yml` – local PostgreSQL + app orchestration

## Quick start

### Option 1: Local Node.js + PostgreSQL
1. Create a PostgreSQL database named `kahani_infracon`.
2. Copy `.env.example` to `.env` and update the values if needed.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Initialize the database schema and demo users:
   ```bash
   npm run db:init
   ```
5. Start the application:
   ```bash
   npm run dev
   ```
6. Open the app in a browser at `http://localhost:5173`.
7. API is served from `http://localhost:3001`.

### Option 2: Docker Compose
1. Copy `.env.example` to `.env`.
2. Run:
   ```bash
   docker compose up --build
   ```
3. Open the frontend at `http://localhost:5173`.
4. PostgreSQL will be available on `localhost:5432`.

## Important security and implementation notes
- Passwords are hashed before storage.
- Database credentials and secrets must stay in environment variables, never in frontend code.
- This prototype includes authentication and role checks in the backend, but they should be tested against a live PostgreSQL instance before claiming production readiness.
- The demo data is intentionally labeled as sample data for development and demonstration only.

## Default demo roles and accounts
The database bootstrap script seeds role-aware demo accounts such as:
- Super Admin
- Admin
- Project Manager
- Site Engineer
- Billing Engineer
- Store Keeper
- HR
- Accountant
- Quality Engineer
- Safety Officer

Use the seeded email addresses defined in the API bootstrap logic for local testing after the database is running.

## Production deployment guidance
- Set strong environment variables for JWT secrets and Postgres credentials.
- Use a real managed PostgreSQL service in production.
- Restrict CORS policies to trusted client origins.
- Enable HTTPS and secure cookies or bearer-token storage for mobile deployment.
- Add observability, backups, and audit logging before production rollout.

## Future-ready roadmap
- AI-driven productivity insights and forecast generation
- Contract, sub-contractor, and vendor management modules
- Document OCR and drawing analysis integration
- Automated DPR analytics and anomaly detection
- Advanced reporting and Excel/PDF generation
