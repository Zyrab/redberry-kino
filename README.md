# Kino XII

A cinema website for the Kino XII network: browse films, filter showtimes, pick seats and buy tickets. Built as the Redberry Bootcamp assignment.

**Live demo:** <ADD LIVE URL>
**Video walkthrough:** <ADD LOOM URL>

Designed for a 1920x1080 viewport, as the brief specifies.

## Test account

| Email             | Password |
| ----------------- | -------- |
| jane@kinoxii.test | password |

The account has a complete profile. For payment, any 16-digit card number with a future expiry works (for example `4242 4242 4242 4242`).

## Tech stack

- React (JavaScript) with Vite
- `react-router` v7 (library mode)
- Plain `fetch`, with a small `api()` wrapper
- Plain CSS, one file per component, global design tokens, native CSS nesting
- `vite-plugin-svgr` for SVG icons

No UI, form, or state libraries were used.

## Getting started

```bash
pnpm install
pnpm run dev
```

Other scripts:

```bash
pnpm run build     # production build
pnpm run preview   # preview the production build
```

The API base URL is set in `src/utils/api.js`:
`https://api.kinoxii.redberryinternship.ge/api`

## Features

- **Home:** featured hero slider, Now Playing and Coming Soon rows, recently viewed (saved in `localStorage`)
- **Auth:** login and registration modals (with avatar preview), session restored on load, and protected actions that continue automatically after login
- **Account menu:** avatar, profile status indicator, links to profile and tickets, logout button
- **My Profile:** personal information and my tickets tabs
  - personal information form with full validation, derived age notice, and profile-complete status
  - tickets showing total, upcoming, with refund button and past ticekts,
- **Movie page:** details, 7-day date picker, sessions grouped by venue and hall, age-restriction handling
- **Sessions page:** sticky filters (venue, date, format, language, time of day), sorting, pagination, results counter
- **Booking modal:** API-driven seat map, per-seat ticket types, live price summary, seat hold with countdown, checkout form, confirmation view

## Project structure

```
src/
  components/
    ui/          Reusable pieces: Button, Badge, Icon, TextInput, SelectInput,
                 Modal, Tabs, DayPicker, Pagination, MovieCard, SessionCard, Seat
    layout/      Navbar, AccountMenu, Footer, Layout
    auth/        AuthModal, LoginForm, RegisterForm
    booking/     BookingModal, SeatStep, CheckoutStep, SeatMap, HoldTimer, Confirmation
  context/       AuthProvider, FilterOptionsProvider
  hooks/         Data and state logic (useBooking, useSessionFilters, useSessions, ...)
  pages/         home, movies, sessions, my-profile
  styles/        One CSS file per component or page, plus global tokens
  utils/         api, validators, dates, booking helpers, filter groups, pagination
```

## Key decisions

**The URL is the source of truth for the sessions page.** Filters, date, sort and page live in query parameters. This makes refresh, the Back button and shared links work. Every filter or sort change resets the page to 1, and venue changes drop formats the selected venues don't offer.

**The server decides, the frontend mirrors.** Venues, formats, languages, ticket types, the seat cap and the hold duration all come from `GET /filter-options`, which is fetched once and cached in context. Nothing like that is hardcoded. Seat prices in checkout come from the hold response.

**Context only where state is truly global.** `AuthProvider` and `FilterOptionsProvider` are the only contexts. Everything else is local state or a hook.

**One auth modal, mounted in `Layout`.** Any protected action calls `requireAuth(action)`. If the user is a guest, the login modal opens and the same action runs after login, so nobody has to click twice.

**Booking logic lives in `useBooking`.** The hook owns the step state machine (seats, checkout, confirmed), the hold, and every recovery path. `BookingModal` only chooses which view to show. A single `recover()` handles 401 (login and replay) and 409 (drop contested seats, keep the rest, refetch the map).

**Hold lifecycle.** The server owns the hold and the frontend keeps a copy. Going back to step 1 keeps it, selecting again replaces it, and it is released when the modal unmounts. The countdown runs from `expiresAt` rather than a duration, so background tabs don't drift. Seats flagged `isMine` stay selectable.

**Validation in one place.** `utils/validators.js` holds the messages, rules and per-form schemas for login, register, profile and checkout.

## Known limitations

- A hold is not resumed after a page reload. It expires on the server after the hold duration.
- The seat map scrolls natively. There is no zoom or drag-to-pan.

## Deployment

The app is a static SPA, so the host needs a fallback that serves `index.html` for every route.

- Netlify: `public/_redirects` containing `/* /index.html 200`
- Vercel: a `vercel.json` rewrite to `/index.html`
