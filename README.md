# StudentHub

Student portal for Web Development Frameworks (ITUE203). Practicals 1-7 complete.

## Pages (15)

**Public:** index.html, about.html, events.html, notices.html, faq.html, contact.html, login.html, register.html
**Student:** dashboard.html, profile.html, courses.html, attendance.html, feedback.html, settings.html
**Admin:** admin.html

## Features

- Semantic HTML5 with accessible forms and navigation
- Responsive CSS (7 modular files, mobile-first, Grid/Flex)
- Dark/light theme toggle (persists in localStorage)
- Mobile hamburger menu for sidebar navigation
- FAQ collapse, modal system, notifications, content slider
- Registration form validation (9 fields, regex, password strength meter)
- JSON data rendering with search, filter, sort, pagination (events, courses, FAQs)

## Data Files (/data)

courses.json (4), events.json (16), students.json (20), faqs.json (20)

## JavaScript (/js)

script.js (shared UI), validation.js (register form), data-renderer.js (generic JSON renderer), courses.js (legacy)

## CSS (/css)

variables.css, base.css, layout.css, components.css, pages.css, theme.css, utils.css

## Run

Open index.html in browser. For JSON pages (events, courses, faq), use a local server (Live Server, `python -m http.server`) due to CORS.
