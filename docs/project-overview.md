# StudentHub - Project Overview

## What This Is

StudentHub is a student portal built across 6 practicals (P1-P6). It contains 15 HTML pages with responsive CSS, JavaScript interactivity, client-side form validation, and JSON data rendering.

## Pages

**Public (accessible without login)**
- index.html - Home page with hero, quick access cards, academic info, upcoming events, latest notices, student services
- about.html - Purpose, objectives, student services
- events.html - 16 events with search, category filter, sort by date/title, pagination (6 per page)
- notices.html - Important, academic, and general notices
- faq.html - 20 FAQs with search, category filter, pagination (10 per page)
- contact.html - Contact information and contact form
- login.html - Email and password login form
- register.html - 9-field registration form with client-side validation

**Student (after login)**
- dashboard.html - Welcome, courses, attendance, notices, events, quick actions
- profile.html - Personal, academic, and contact information
- courses.html - 4 courses with search, sort, pagination (8 per page)
- attendance.html - Overall percentage, course-wise breakdown, status indicators
- feedback.html - Feedback form with category, subject, rating, message
- settings.html - Account, notification, and preference settings

**Admin**
- admin.html - Statistics cards, student management, event management, recent registrations

## Navigation Flow

1. Start at index.html (home)
2. Public pages link to each other via top navigation
3. Login and Register accessible from any public page
4. After login (simulated), student pages use sidebar navigation
5. Admin page uses its own sidebar navigation
6. All pages link back to home via logo

## Data Files (in /data)

- courses.json - 4 courses (code, title, faculty, credits, schedule, room)
- events.json - 16 events (id, title, date, endDate, venue, category, description)
- students.json - 20 students (id, name, email, course, year, rollNo, phone)
- faqs.json - 20 FAQs (id, question, answer, category)

## JavaScript Modules (in /js)

- script.js - Hamburger menu (mobile), theme switcher (light/dark, persists), FAQ collapse, modal system, notification banner, content slider
- validation.js - Registration form validation for all 9 fields with regex patterns, password strength meter, accessible error messages
- data-renderer.js - Generic class for rendering JSON data with search, filter, sort, pagination
- courses.js - Legacy loader for courses.json (used by courses.html)

## CSS Files (in /css)

- variables.css - Design tokens (colors, spacing, radius, shadows, typography scale)
- base.css - Reset, body, links, images, visually-hidden utility
- layout.css - Header, nav, main, page-header, sidebar, dashboard-layout, footer
- components.css - Buttons, cards, forms, tables, badges, pagination, controls, loading/error/empty states
- pages.css - Page-specific styles (hero, dashboard grid, profile info, course cards, faculty cards, attendance circle, admin stats)
- theme.css - Dark mode variable overrides
- utils.css - Responsive breakpoints, hamburger menu styles, print styles

## How to Run

Open any .html file directly in a browser. For JSON data rendering (events.html, courses.html, faq.html), serve via a local server (e.g., VS Code Live Server, Python http.server) due to CORS restrictions on file:// protocol.

## Practical Coverage

- P1: Planning, requirements, wireframes, folder structure, README, Git
- P2: 15 semantic HTML pages, accessible forms, working navigation
- P3: Responsive CSS (7 files, mobile-first, Grid/Flex)
- P4: JavaScript interactivity (hamburger, theme, FAQ, modal, notifications, slider)
- P5: Registration form validation (9 fields, regex, strength meter)
- P6: JSON data rendering with search, filter, sort, pagination (3 pages)
- P7: PHP Form Processing with Server-Side Validation and CSV/JSON File Storage