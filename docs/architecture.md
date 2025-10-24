# AI Rythu Mitra: Functional Architecture & Navigation Flow

## 1. App Overview 🧭

AI Rythu Mitra is a multilingual Progressive Web App (PWA) designed for Indian farmers, supporting Telugu, Hindi, and English. It integrates AI, IoT, and government data to provide a comprehensive, automated solution covering the entire farm-to-market lifecycle. The platform aims to empower farmers with data-driven insights for improved productivity and profitability.

---

## 2. Core Architecture 🧱

The system follows a three-tier architecture, separating presentation, logic, and data management for scalability and maintainability.

```
Frontend (React PWA + Vite + Tailwind)
   │
   ├── FastAPI Backend (Python)
   │     ├─ Auth & API Layer (Firebase + JWT)
   │     ├─ AI Engine (Recommendation, Health, Subsidy, Price Prediction)
   │     ├─ PostgreSQL / Firestore Database
   │     └─ ESP32 IoT Gateway Integration
   │
   └── External Services
         ├─ OpenWeatherMap API
         ├─ Data.gov.in API
         ├─ Google Calendar API
         └─ WhatsApp Business API
```

**Architecture Principle**: Three-tier (Presentation → Logic → Data).

---

## 3. Full Functional Flow by Farming Phase 🌾

The user journey is organized logically around real-world farming phases.

### Phase 1 – Farmer Setup & Soil Testing

1️⃣ **🧑‍🌾 Farmer Onboarding (`/signup`)**
- User selects a primary language (Telugu, Hindi, or English).
- Enters farm size and location (GPS auto-detect).
- **System Action**:
    - Creates a new record in the `users` table.
    - Initializes related empty records in `soil_reports` and `crop_data` tables, linked by `userId`.

🏛️ **Smart Subsidy Alerts (`/subsidies`)**
- **System Action (Backend Job)**:
    - Periodically fetches government schemes from the Data.gov.in API.
    - The AI Engine filters schemes based on the user's registered district and crop preferences.
    - Matched subsidies are pushed as notifications to the user's dashboard and via WhatsApp.
- **User Action**:
    - Users can view alerts and use "Apply Now" links to navigate to the official portals.

2️⃣ 🌱 **Soil Testing & Analysis (`/soil-analysis`)**
- User uploads a soil test report (PDF/image) or syncs data from a connected ESP32 IoT sensor.
- **System Action**:
    - The AI Engine's soil model analyzes the input for pH, NPK levels, and overall fertility.
    - The extracted data is stored in the `soil_reports` table, linked to the user.
    - The resulting numeric features (NPK, pH) are passed directly to the Crop Recommendation module.

---

### Phase 2 – AI Crop Selection

3️⃣ 🤖 **AI Crop Recommendation (`/crop-recommendation`)**
- **Input**: Soil data (from Phase 1), current season, local weather forecast (from Weather API), and market demand trends (from historical `crop_data`).
- **System Action**:
    - The AI Recommendation Engine processes the inputs.
    - **Output**: Recommends the top 3 most suitable crops with forecasted yield and potential profit margins.
- **User Action**:
    - The farmer reviews the options and confirms a single crop for the season.
- **System Action (on confirmation)**:
    - The selected crop is saved to the user's `crop_data` record for the current cycle.
    - This action triggers the Crop Lifecycle Management phase, linking the crop choice to monitoring and alert systems.

---

### Phase 3 – Crop Lifecycle Management

4️⃣ 💧 **IoT Monitoring & Irrigation (`/moisture-monitor`)**
- **System Action**:
    - The ESP32 device continuously streams soil moisture, temperature, and humidity data to the FastAPI IoT Gateway.
    - The AI Engine analyzes this data against the selected crop's ideal conditions.
- **Output & Alerts**:
    - Generates an optimal watering schedule.
    - Sends critical alerts (e.g., "Soil moisture is low, irrigate now") to the Dashboard and via WhatsApp.
    - Automatically syncs scheduled irrigation events to the user's Google Calendar.

5️⃣ 🧠 **AI Crop Health Diagnosis (`/crop-health`)**
- **User Action**:
    - The farmer uploads a photo of a leaf or crop showing potential distress.
- **System Action**:
    - The image is processed by a Convolutional Neural Network (CNN) to detect diseases or pests.
    - The AI suggests organic treatment plans and appropriate fertilizer doses.
- **Output & Logging**:
    - A new entry is logged in the `crop_health` database.
    - An immediate alert with the diagnosis and remedy is pushed via WhatsApp.

6️⃣ 🗓️ **Smart Calendar & Reminders (`/calendar`)**
- **System Action**:
    - Automatically generates a full-cycle task list (watering, fertilizing, spraying) based on the selected crop's roadmap.
    - Syncs these events with the user's Google Calendar.
- **User Action**:
    - The calendar is fully editable from the UI.
- **Integration**: Events are dynamically updated based on real-time AI alerts and IoT data (e.g., a rain forecast might postpone a scheduled irrigation).

7️⃣ 💬 **WhatsApp AI Assistant**
- A conversational interface accessible directly through WhatsApp.
- **Capabilities**:
    - **Voice & Text**: Handles queries in Telugu, Hindi, and English (e.g., “రేపు వర్షం ఉంటుందా?” - "Will it rain tomorrow?").
    - **Quick Checks**: Allows farmers to perform quick crop health checks by sending a photo.
    - **Automated Alerts**: Proactively sends all notifications from the system (subsidy, weather, IoT, calendar reminders).

---

### Phase 4 – Harvest & Post-Harvest

9️⃣ 🧾 **Harvest Completion**
- **System Action**:
    - The AI Engine predicts the optimal harvest window based on the crop calendar and long-range weather forecasts.
    - Notifies the farmer when the harvest window is approaching.
- **User Action**:
    - The farmer confirms harvest completion in the app.
- **System Action (on confirmation)**:
    - The final yield data is recorded in `crop_data`.
    - The produce is automatically listed as "Available" in the Marketplace module.

🔟 🛒 **Marketplace (`/marketplace`)**
- **Functionality**:
    - Lists available produce from all farmers on the platform (supports over 1,000 crop types).
    - The AI Price Predictor suggests optimal mandi/retail prices based on location and real-time market data.
- **Admin Features**:
    - Admins can manually override prices or perform bulk price updates via an Excel upload feature.
- **Buyer Interaction**:
    - Includes an optional "Contact via WhatsApp" button for direct buyer-farmer communication.

---

### Phase 5 – Reports & Analytics

1️⃣1️⃣ **📈 Profit Analytics (`/analytics`)**
- **System Action**:
    - Aggregates all data for the crop cycle: yield, input costs (fertilizer, water), and final sale revenue from the marketplace.
    - The AI Engine generates a "predicted vs. actual" profit analysis.
- **Output**:
    - Visualizes profit/loss with charts and key metrics.
    - Generates a downloadable monthly PDF report and a shareable Telugu voice summary.

---

### Phase 6 – Profile & System Settings

1️⃣2️⃣ **👤 Profile Management (`/profile`)**
- **User Action**:
    - Manage personal details, farm information, and language preferences.
    - Link/unlink IoT devices.
    - Configure notification preferences (e.g., enable/disable WhatsApp alerts).
- **System Tracking**:
    - Users can track the status of their subsidy applications and manage premium subscription plans.

---

## 🔗 Feature Dependency Matrix (Simplified)

| Phase | Feature                | Depends On                       | Leads To                                   |
| :---- | :--------------------- | :------------------------------- | :----------------------------------------- |
| 1     | Soil Testing           | IoT/Upload                       | Crop Recommendation                        |
| 2     | Crop Recommendation    | Soil + Weather + Market          | Lifecycle (plan for 30–365 days)           |
| 3     | IoT Monitoring         | ESP32 + Crop Data                | Health AI / Alerts                         |
| 3     | Crop Health            | Image AI + IoT                   | Alerts / WhatsApp                          |
| 3     | Calendar               | Crop Plan + AI                   | Reminders / WhatsApp                       |
| 3     | Subsidy AI             | Govt API                         | Dashboard Alerts                           |
| 4     | Harvest                | Calendar + Weather               | Marketplace                                |
| 4     | Marketplace            | Harvest Data                     | Profit Analytics                           |
| 5     | Analytics              | All Data                         | Reports                                    |
| 6     | Profile                | Users DB                         | All Modules                                |

---

## 🧠 Data & AI Pipelines

1.  **IoT Data Pipeline**
    `IoT Sensor → FastAPI Gateway → Database → Real-time Dashboard + AI Irrigation Model`

2.  **Soil & Crop Planning Pipeline**
    `Soil Report Upload → AI Soil Model → Crop Recommendation Engine → Calendar + Alert System`

3.  **Crop Health Pipeline**
    `Image Upload → Pest/Disease CNN Model → Diagnosis → WhatsApp Alert`

4.  **Market Intelligence Pipeline**
    `Market API Data → AI Price Predictor Model → Marketplace Pricing + Profit Analytics`

5.  **Government Scheme Pipeline**
    `Govt API (Data.gov.in) → Smart Subsidy AI Filter → Dashboard + WhatsApp Updates`

