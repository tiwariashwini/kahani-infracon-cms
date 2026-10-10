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
KAHANI INFRACON

Integrated Construction Management System

Build a complete, professional, mobile-friendly construction management web application for KAHANI INFRACON.

1. Company Branding

- Company Name: KAHANI INFRACON
- Application Name: KAHANI INFRACON Management System
- Design: Professional corporate dashboard
- Colors: Navy blue, white, and teal
- Support Android mobile, tablet, and laptop.
- Use a clean interface with a sidebar, dashboard cards, tables, forms, and charts.

2. Dashboard

Display:

- Total Projects
- Active Projects
- Today's Manpower
- Today's Concrete Quantity
- Monthly Billing
- Pending Bills
- Material Stock Alerts
- Project Progress
- Pending Approvals
- Recent Activities

3. Employee Login and Roles

Create a secure authentication system with:

- Super Admin
- Company Admin
- Project Manager
- Site Engineer
- Billing Engineer
- Store Keeper
- HR Manager
- Accountant
- Quality Engineer
- Safety Officer

Each employee must have permissions appropriate to their role. Enforce authorization on the backend.

4. Project Management

Include:

- Project Name
- Project Code
- Project Location
- Client Name
- Consultant and PMC
- Project Manager
- Start Date
- Target Completion Date
- Project Budget
- Project Status
- Work Progress Percentage

Allow multiple projects and project-wise reports.

5. Planning and Scheduling

Include:

- Daily Work Plan
- Weekly Work Plan
- Monthly Work Plan
- Planned Quantity
- Actual Quantity
- Completion Percentage
- Delay Reason
- Target Dates
- Project Progress Reports

6. DPR – Daily Progress Report

Create a DPR form with:

- Date
- Project Name
- Work Location
- Activity Description
- Excavation Quantity
- PCC Quantity
- RCC Concrete Quantity
- Reinforcement Steel Quantity
- Shuttering Area
- Masonry Quantity
- Equipment Details
- Work Completed
- Work Planned for Tomorrow
- Site Issues
- Engineer Remarks
- Photo Attachments

Allow PDF and Excel exports.

7. DLR – Daily Labour Report

Include:

- Date and Project
- Contractor Name
- Carpenter
- Bar Bender
- Mason
- Helper
- Electrician
- Plumber
- Operator
- Other Workers
- Total Manpower
- Working Hours
- Shift
- Remarks

Automatically calculate total manpower.

8. Billing and BOQ

Include:

- Item Number
- Item Description
- Unit
- BOQ Quantity
- Rate
- BOQ Amount
- Previous Quantity
- Current Quantity
- Cumulative Quantity
- Balance Quantity
- RA Bill Number
- GST
- Deductions
- Retention
- Net Payable Amount
- Bill Status

Formulas:
Amount = Quantity × Rate

Cumulative Quantity = Previous Quantity + Current Quantity

Balance Quantity = BOQ Quantity − Cumulative Quantity

Provide bill abstracts, measurement records, approval tracking, and PDF/Excel exports.

9. Inventory and Material Management

Track:

- Cement
- Steel
- Sand
- Aggregate
- Concrete
- Bricks and Blocks
- Pipes
- Electrical Materials
- Other Construction Materials

Include:

- Opening Stock
- Received Quantity
- Issued Quantity
- Closing Stock
- Supplier Details
- Purchase Records
- Material Issue Slips
- Stock Alerts
- Project-wise Consumption

Formula:
Closing Stock = Opening Stock + Received Quantity − Issued Quantity

10. Manpower and Attendance

Include:

- Employee Name
- Employee ID
- Designation
- Department
- Project
- Attendance Date
- Present / Absent
- Overtime
- Working Hours
- Contractor Details

Generate daily and monthly attendance reports.

11. Quality Control

Include:

- Reinforcement Inspection
- Shuttering Inspection
- Concrete Pour Card
- Slump Test Records
- Cube Test Results
- Material Test Reports
- Inspection Requests
- Non-Conformance Reports
- Corrective Actions
- Approval Status

12. Safety Management

Include:

- Daily Safety Checklist
- PPE Compliance
- Toolbox Talks
- Safety Inspections
- Incident Reports
- Near-Miss Reports
- Hazard Identification
- Corrective Actions

13. Engineering and BBS

Include:

- Bar Bending Schedule
- Bar Diameter
- Bar Shape
- Bar Quantity
- Cutting Length
- Total Steel Weight
- Drawing Register
- Drawing Revision Tracking
- Concrete Quantity Calculator
- Shuttering Area Calculator
- Steel Weight Calculator

Show calculation formulas, units, and results.

14. HR and Accounts

HR:

- Employee Records
- Departments
- Designations
- Attendance
- Leave Applications
- Leave Approvals

Accounts:

- Project Expenses
- Petty Cash
- Vendor Payments
- Expense Records
- Payment Status
- Monthly Expense Reports

15. Document Management

Provide secure document storage for:

- Construction Drawings
- BOQ Files
- DPR Reports
- DLR Reports
- RA Bills
- Test Reports
- Site Photographs
- Safety Documents
- Employee Documents

Organize files project-wise with document numbers, revisions, upload dates, and access permissions.

16. Construction Calculator

Build working calculators for:

- Concrete Volume
- Excavation Volume
- Brickwork Volume
- Plaster Area
- Shuttering Area
- Steel Weight
- Bar Bending Schedule
- Cement Quantity
- Sand Quantity
- Aggregate Quantity
- Unit Conversion

Support millimetres, metres, feet, square metres, square feet, and cubic metres.

Show formulas and calculation steps for every result.

17. Technical Requirements

- Build a complete working application, not just a static design.
- Use HTML5, CSS3, and JavaScript for the frontend.
- Use a suitable backend API and database for shared company data.
- Implement secure authentication and backend-enforced role permissions.
- Validate user inputs and handle errors properly.
- Keep API keys and database credentials out of frontend code.
- Support PDF and Excel reports.
- Make the interface responsive on mobile and desktop.
- Provide clear setup and deployment instructions.
- Prefer free or low-cost hosting and disclose any paid requirements.
- GitHub Pages may host the static frontend but cannot run the backend server by itself.
- Test all implemented features before marking them complete.

18. Development Instructions

Build the application in stages:

1. Frontend and Dashboard
2. Login and User Roles
3. Project Management
4. DPR and DLR
5. Billing and BOQ
6. Inventory and Attendance
7. Quality and Safety
8. Engineering and Calculators
9. HR and Accounts
10. Document Management
11. Reports and Exports
12. Testing and Deployment

Create a proper project folder structure, database schema, and setup guide. Make every implemented form and button functional. Do not use fake login authentication or pretend that data has been saved when it has not.

Start with the frontend and provide the complete source code required to deploy it.