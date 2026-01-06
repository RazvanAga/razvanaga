# Project Context: Razvan & Kasiia Wedding App

## Overview
This is a Next.js web application designed as a wedding RSVP platform for "Răzvan & Kasiia". It allows guests to confirm their attendance, specify their menu preferences, and indicate if they are bringing children.

## Tech Stack
-   **Framework:** Next.js 16.0.10 (App Router)
-   **Library:** React 19.2.1
-   **Styling:** Tailwind CSS 4, utilizing a specific color palette defined mainly via inline styles and standard Tailwind utility classes.
-   **Language:** TypeScript
-   **Package Manager:** npm (based on `package-lock.json` presence)

## Key Directories & Files
-   `app/page.tsx`: Entry point, currently redirects immediately to `/kasiia`.
-   `app/kasiia/page.tsx`: Main RSVP page containing the logic for guest management and form submission.
-   `app/globals.css`: Global styles (presumed standard Next.js setup).
-   `public/Images/`: Contains static assets like `Thumbnail.jpeg`.

## Application Logic (`app/kasiia/page.tsx`)
-   **State Management:** Uses `useState` for guest count, guest details, swipe interactions, and submission status.
-   **Guest Selection:** specific UI implementation allowing users to swipe or click numbers to select guest count (1-9).
-   **Form Fields:**
    -   First Name & Last Name (Text)
    -   Age Category (Adult/Child toggle)
    -   Menu (Meat/Vegetarian toggle)
-   **Data Submission:** Sends a POST request to a Google Apps Script Web App (`https://script.google.com/...`).
    -   Handles `no-cors` mode.
    -   Includes basic validation (all names required).
    -   Visual feedback for submission states (loading, success, error toast).

## Design System
-   **Color Palette:**
    -   Background: `#FEFAE0` (Cream/Off-white)
    -   Primary Text/Accents: `#5F6F52` (Deep Green)
    -   Secondary Accents/Borders: `#A9B388` (Sage Green)
    -   Highlights/Active States: `#B99470` (Muted Brown/Gold)
-   **Typography:** Sans-serif (Geist font family via Next.js defaults).

## Development Conventions
-   **Component Structure:** Functional components with Hooks (`useState`, `useEffect`, `useRef`).
-   **Styling Strategy:** Hybrid of Tailwind CSS classes for layout/spacing/typography and inline `style` objects for specific theme colors.
-   **Code Quality:** TypeScript used for type safety (e.g., `Guest` type definition). ESLint configured.

## External Integrations
-   **Backend:** Google Sheets via Google Apps Script (acting as a serverless backend).
