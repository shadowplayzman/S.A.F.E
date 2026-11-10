# S.A.F.E. - Shelter Allocation and Finder Environment

A real-time emergency shelter allocation platform built with Vanilla JS, HTML5, CSS3, and Supabase.

## Features
- **Smart Shelter Finder:** Filter shelters by city, group size, and specific facilities.
- **Real-Time Data Persistence:** Integrated with Supabase PostgreSQL database.
- **Authentication:** User signup, login, and session persistence powered by Supabase Auth.
- **User Dashboard:** Track individual request status (`pending`, `approved`, `rejected`, `cancelled`).
- **Admin Management Panel:** Approve or reject requests with real-time capacity deduction.

## Tech Stack
- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Backend & Database: Supabase (PostgreSQL, Row Level Security, RPC Stored Procedures)
- CDN Libraries: `@supabase/supabase-js` v2