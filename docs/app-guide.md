
# AI Rythu Mitra: Developer Guide & App Overview

This document provides a technical overview of the AI Rythu Mitra application, its core features, and the user navigation flow.

---

## 1. Core Architecture & Philosophy

AI Rythu Mitra is a Next.js Progressive Web App (PWA) designed to function as a comprehensive digital assistant for Indian farmers. The core philosophy is to transform farming from a reactive to a proactive, data-driven business, turning farmers into "agripreneurs."

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, ShadCN UI
- **AI/ML**: Google Gemini via Genkit flows for all generative AI tasks.
- **Styling**: Uses HSL-based CSS variables defined in `src/app/globals.css`, making the theme easily customizable.
- **State Management**: Primarily uses React hooks (`useState`, `useContext`) and URL search parameters for state. A `LanguageContext` manages multilingual translations.

---

## 2. Key Features & Functionality

The application is organized around the key stages of a farming lifecycle.

### Phase 1: Planning & Preparation

#### a. Soil Analysis (`/soil-analysis`)
- **Functionality**: Allows a farmer to upload a soil test report (as a PDF or image).
- **AI Integration**: A Genkit flow (`extractSoilData`) analyzes the document, extracts key metrics (Nitrogen, Phosphorus, Potassium, pH), and provides a fertility assessment.
- **User Flow**: The extracted data can be passed directly to the Crop Recommendation feature via URL parameters, creating a seamless workflow.

#### b. AI Crop Recommendation (`/crop-recommendation`)
- **Functionality**: Suggests the most suitable and profitable crops based on the farmer's soil data and location.
- **AI Integration**: The `cropRecommendationFromSoil` flow recommends crops, provides nutritional info (vitamins, medicinal value), and offers smart intercropping suggestions to maximize land use.
- **User Flow**: After reviewing recommendations, the farmer can select a crop to generate a detailed farming plan.

#### c. AI Multi-Crop Planner (`/crop-planner`)
- **Functionality**: Provides advanced intercropping (companion planting) strategies.
- **AI Integration**: The `generateCropPlan` flow takes a list of primary crops and a location, then suggests companion crops, explaining the synergistic benefits (e.g., pest control, nutrient sharing) and providing simple layout ideas.

### Phase 2: Crop Lifecycle Management

This is the central hub for managing an active crop.

#### a. Crop Lifecycle Dashboard (`/crop-dashboard`)
- **Functionality**: A tab-based interface that consolidates all tools needed for managing the currently tracked crop (hardcoded as "Tomato" for the prototype).
- **Navigation**: This page acts as a container for the features below.

#### b. IoT Sensor Dashboard (`/moisture-monitor` tab)
- **Functionality**: Displays real-time data from on-field sensors.
- **Implementation**: Currently uses mock data but is designed to be connected to a live data source (like Firestore streams from IoT devices). It shows soil moisture, temperature, humidity, and light intensity.

#### c. AI Crop Health Diagnosis (`/crop-health` tab)
- **Functionality**: A farmer can upload a photo of a distressed crop.
- **AI Integration**: The `diagnosePestDisease` flow analyzes the image to identify potential pests or diseases and suggests organic, actionable remedies. The results can be shared via WhatsApp.

#### d. Smart Calendar (`/calendar` tab)
- **Functionality**: Provides a day-wise farming schedule for the selected crop.
- **AI Integration**: The `generateCropRoadmap` flow is called to create a complete activity list from land preparation to post-harvest.
- **UI**: Activities are displayed on an interactive calendar. Clicking a day reveals the tasks scheduled for it.

#### e. AI "Agripreneur" Assistant (`/chat` tab)
- **Functionality**: A sophisticated, multilingual (English, Telugu, Hindi) chatbot that acts as a business advisor.
- **AI Integration**: The `chatFlow` is designed to be context-aware, using data about the active crop, soil, and weather to provide proactive, profitable advice. It also features text-to-speech capabilities.

### Phase 3: Governance & Market

#### a. Smart Subsidy Alerts (`/subsidies`)
- **Functionality**: Automatically filters and displays government schemes relevant to the farmer's location and cultivated crops.
- **Implementation**: This page currently uses a mock dataset but is designed to be powered by an API feed (e.g., from Data.gov.in).

#### b. Community Marketplace (`/marketplace`)
- **Functionality**: A digital marketplace where farmers can list their produce and browse listings from others. It displays current prices, price trends (vs. yesterday), and allows direct contact with sellers via WhatsApp.
- **Features**: Includes search, category filtering, and a dialog for listing new produce. It's populated with a rich mock dataset of over 100 crop types.

---

## 3. Navigation Flow

The application uses a responsive layout that adapts for desktop and mobile users.

### a. Desktop Navigation (Sidebar)
- A persistent sidebar is present on the left, managed by `src/app/(app)/layout.tsx`.
- **States**: The sidebar can be **expanded** (showing icons and labels) or **collapsed** (icon-only for a minimal footprint). The state is saved in a cookie.
- **Items**: The sidebar contains links to all major features of the application, providing quick access to any page.
- **Trigger**: The sidebar can be toggled using the menu icon in the header or the keyboard shortcut `(Ctrl/Cmd + B)`.

### b. Mobile Navigation (Bottom Nav Bar & Sheet)
- **Bottom Bar**: For screen sizes below 768px, a bottom navigation bar provides access to the five most essential features: Home, Soil, Market, Chat, and Profile. This offers a familiar, thumb-friendly experience.
- **Sheet Menu**: A "hamburger" menu in the header opens a slide-out sheet from the left. This sheet contains the full list of all navigation items, ensuring that even on mobile, every page is just two taps away.

### c. Page Routing
- The app uses the Next.js App Router. All main application pages are located within the `src/app/(app)/` directory group.
- Dynamic routes are used for features like the crop roadmap (e.g., `/crop-roadmap/tomato`), allowing for content to be generated based on URL parameters.

This structure provides a comprehensive yet easy-to-navigate experience, whether the user is on a desktop computer or a mobile phone in the field.
