# 📖 ThermaVision — Project Instructions & Architecture

Welcome to the internal documentation for **ThermaVision**. This guide explains how the frontend and backend are connected, the data flow between them, the purpose of every file, and the core engineering principles behind the platform.

---

## 👥 Meet the Team

**ThermaVision** is a collaborative engineering solution built for the **SugarNxt Hackathon 2026**:

- 🧑‍💻 **Babin Bid** — Team Lead & Architect
- 👩‍💻 **Debasmita Bose** — Developer
- 👩‍💻 **Joita Paul** — Developer
- 👩‍💻 **Manisha Debnath** — Developer
- 🏠 **[Back to Project Overview](./README.md)** 🔙

---

## 🏗️ System Architecture Overview

ThermaVision follows a **Decoupled Full-Stack Architecture** where the frontend and backend run as independent servers that communicate through HTTP API calls.

```text
┌─────────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                               │
│                                                                     │
│  index.html ──────► simulation.html ──────► dashboard.html          │
│  (Landing Page)     (Input Form)            (Results & Charts)      │
│                          │                        ▲                  │
│                          │ POST /analyze          │ sessionStorage   │
│                          ▼                        │ (JSON data)      │
│                    ┌──────────┐                   │                  │
│                    │ fetch()  │───────────────────►│                  │
│                    └──────────┘                                      │
└────────────────────────┬────────────────────────────────────────────┘
                         │ HTTP Request (JSON body)
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│               FASTAPI BACKEND (thermavision.onrender.com)         │
│                                                                     │
│  routes.py ──► calculator.py ──► optimizer.py ──► insights.py       │
│  (API endpoints)  (Thermodynamics)  (Scenarios)   (AI Summary)      │
│                                                                     │
│  Returns: JSON response with all calculated metrics                 │
└─────────────────────────────────────────────────────────────────────┘
```

<a id="connect-steps-anchor"></a>
### 🔗 How They Connect — Step by Step

1. **User opens `index.html`** in the browser (served on `localhost:3000`). This is the landing page with project overview and a call-to-action to start the simulation
2. **User navigates to `simulation.html`** and fills the form with plant parameters (temperatures, flow rate, fuel type, costs)
3. **Form submission triggers `simulation.js`** which validates all inputs and packages them into a JSON object
4. **`simulation.js` sends a `POST` request** to `https://thermavision.onrender.com/analyze` using the browser `fetch()` API
5. **The FastAPI backend receives the request** at the `/analyze` endpoint defined in `routes.py`
6. **Backend processes the data** through three engine modules:
   - `calculator.py` runs thermodynamic calculations (heat recovered, steam saved, efficiency)
   - `optimizer.py` generates Base, Improved, and Optimized scenarios
   - `insights.py` calls the Groq AI API to generate an executive summary
7. **Backend returns a structured JSON response** containing all metrics, scenarios, recommendations, and the AI summary
8. **`simulation.js` stores the entire JSON response** in the browser `sessionStorage` and redirects the user to `dashboard.html`
9. **`dashboard.html` loads and `dashboard.js` reads the data** from `sessionStorage` to render charts (Chart.js), metrics, scenario tables, and the AI insight banner
10. **User can download a PDF report** which triggers a request to the `/report` endpoint and the backend generates a timestamped PDF using FPDF2
11. **Chatbot Interactions** are handled by `chatbot.js`, which sends messages to the `/chat` endpoint for real-time AI technical support

---

## 📂 File-by-File Breakdown

### 🌐 Frontend (`/frontend`)

The frontend is a collection of static HTML, CSS, and JavaScript files served via a simple HTTP server. There is no build step or bundler — everything runs directly in the browser.

<a id="html-pages-anchor"></a>
#### 📄 HTML Pages

| File | Purpose |
| :--- | :--- |
| `index.html` | Landing page with hero carousel, platform stats, feature cards, process flow, and CTA. This is the entry point for users |
| `simulation.html` | Configuration form where users enter plant parameters. Validates inputs before sending to the backend API |
| `dashboard.html` | Results page that displays all analysis data — metric cards, charts, AI insights, scenario comparison, sensitivity analysis, and climate impact projections |

<a id="css-styling-anchor"></a>
#### 🎨 CSS Styling (`/css`)

| File | Purpose |
| :--- | :--- |
| `styles.css` | The complete design system. Contains CSS variables, glassmorphism effects, responsive layouts, scroll animations, hero slider styles, card hover effects, and all component styling |
| `chatbot.css` | Styles for the AI chatbot overlay component |

<a id="js-logic-anchor"></a>
#### ⚡ JavaScript Logic (`/js`)

| File | Purpose | Key Connection |
| :--- | :--- | :--- |
| `app.js` | Handles the Three.js particle background, hero image slider (crossfade carousel), scroll-based animations, navbar scroll behavior, and stat counters | Runs on all pages — provides visual effects |
| `simulation.js` | Manages form validation and the critical API call to the backend. On form submit, it sends a POST request to `/analyze`, receives the JSON response, stores it in `sessionStorage`, and redirects to the dashboard | **This is the bridge between frontend and backend** |
| `dashboard.js` | Reads analysis results from `sessionStorage` and renders everything — Chart.js graphs, metric values, scenario table rows, sensitivity sliders, climate projections, and the PDF download trigger | Consumes the data that `simulation.js` stored |
| `chatbot.js` | Handles the AI chatbot interaction overlay | Sends user messages to the backend chatbot endpoint |

---

### ⚙️ Backend (`/backend`)

The backend is a Python FastAPI application that serves as the computation engine. It never serves HTML — it only accepts JSON requests and returns JSON responses.

<a id="server-setup-anchor"></a>
#### 🖥️ Server Setup

| File | Purpose |
| :--- | :--- |
| `run.py` | Entry point — launches the Uvicorn ASGI server on port 8080 |
| `app/main.py` | FastAPI app initialization. Configures **CORS middleware** (critical — this allows the frontend on `127.0.0.1:3000` to call the backend on `127.0.0.1:8080` without being blocked by the browser) and registers API routes |
| `app/__init__.py` | Package initializer |
| `requirements.txt` | Python dependencies: `fastapi`, `uvicorn`, `fpdf2`, `pydantic`, `groq`, `python-dotenv` |

<a id="api-layer-anchor"></a>
#### 📡 API Layer (`/app/api`)

| File | Purpose |
| :--- | :--- |
| `routes.py` | Defines the API endpoints. The `/analyze` endpoint receives plant parameters, calls the engine modules, and returns the full analysis JSON. The `/report` endpoint generates and streams a PDF file |
| `schemas.py` (`/app/models`) | Pydantic models that define the exact shape of request and response data. This ensures type safety — if the frontend sends invalid data, FastAPI returns a clear error |

#### ⚙️ Engineering Engine (`/backend/app/engine`)

These are the core computation modules that run the industrial thermodynamic logic:

| File | Purpose | Key Formula |
| :--- | :--- | :--- |
| `calculator.py` | Applies the first law of thermodynamics to calculate heat recovery potential from flue gas | $Q = \dot{m} \times C_p \times \Delta T$ where Q is heat recovered (kW), ṁ is mass flow rate, Cp is specific heat capacity, and ΔT is temperature difference |
| `optimizer.py` | Generates multiple recovery scenarios (Base, Improved, Optimized) with varying parameters. Calculates ROI, payback period, and annual savings for each | Runs iterative loops with varied exit temperatures and efficiency factors |
| `insights.py` | Connects to the **Groq Llama-3 AI API** to generate an executive summary and equipment recommendations based on the calculated metrics | API key is stored server-side in `.env` — never exposed to the browser |
| `__init__.py` | Marks the engine directory as a Python package, allowing imports between modules | - |

<a id="data-integration-anchor"></a>
#### 📊 Data & Integration (`/backend/app`)

| File | Purpose |
| :--- | :--- |
| `models/schemas.py` | Defines Pydantic data models for API requests and responses. Ensures strict data validation |
| `api/routes.py` | Contains the actual logic for `/analyze`, `/report`, and chatbot interactions. Redirects traffic to engine modules |
| `.env` | **Critical Security File**: Stores your secret `GROQ_API_KEY`. Must never be shared publicly |
| `.env.example` | Template file showing which environment variables are needed for the project to work |
| `__init__.py` | Top-level package initializer for the FastAPI application |

<a id="frontend-assets-anchor"></a>
#### 🖼️ Frontend Assets (`/frontend/public`)

| File | Purpose |
| :--- | :--- |
| `image_1.jpg` to `image_10.jpeg` | High-quality industrial imagery for the landing page hero carousel |
| `favicon.png` | The browser tab icon for the ThermaVision portal |

---

## 🔗 The Frontend-Backend Connection in Detail

<a id="why-two-servers-anchor"></a>
### ❓ Why Two Servers?

The frontend runs on `127.0.0.1:3000` (a simple Python HTTP server) and the backend runs on `127.0.0.1:8080` (FastAPI/Uvicorn). They are separate because:

-   **Security**: The backend holds the Groq API key and sensitive calculation logic — these never reach the browser 🔒
-   **Separation of concerns**: The frontend handles presentation, the backend handles computation 🧩
-   **CORS**: The backend explicitly allows requests from any origin (or specific frontend domains) via FastAPI CORS middleware in `main.py` 🌐

<a id="data-flow-anchor"></a>
### 🌊 The Data Flow

```text
simulation.html (form)
        │
        ▼
simulation.js → fetch("https://thermavision.onrender.com/analyze", {
                    method: "POST",
                    body: JSON.stringify({
                        flue_temp_in: 250,
                        flue_temp_out: 140,
                        flow_rate: 10000,
                        fuel_type: "Bagasse",
                        fuel_cost: 5,
                        operating_hours: 6000,
                        installation_cost: 500000,
                        steam_demand: 5000
                    })
                })
        │
        ▼
Backend routes.py → calculator.py → optimizer.py → insights.py
        │
        ▼
Returns JSON: {
    heat_recovered_kw, steam_saved_kg_hr,
    annual_savings, payback_years,
    co2_reduction, efficiency_gain,
    scenarios: [...], recommendation: {...},
    ai_summary: "..."
}
        │
        ▼
simulation.js → sessionStorage.setItem("analysisResult", JSON.stringify(data))
        │
        ▼
Redirect to dashboard.html
        │
        ▼
dashboard.js → JSON.parse(sessionStorage.getItem("analysisResult"))
        │
        ▼
Renders charts, metrics, tables, AI insights
```

<a id="session-anchor"></a>
### 🌉 How sessionStorage Bridges the Pages

Since `simulation.html` and `dashboard.html` are separate pages (full page navigation, not a SPA), the data from the API response needs to persist across the page transition. We use `sessionStorage` because:

-   It persists across page navigations within the same tab
-   It automatically clears when the tab is closed (no stale data)
-   It avoids passing large JSON payloads through URL parameters

---

## 🏆 SugarNxt Hackathon Context

This project specifically targets **Sugar Industry Flue Gas Waste**.

### 🔴 The Problem Statement

Industrial boilers in sugar mills emit high-temperature flue gases that escape through the stack, **wasting significant thermal energy**. This heat could be captured and reused instead of being lost to the atmosphere.

### 🟢 Our Solution

- **Methodology**: Pre-heating raw juice using captured flue gas heat through waste heat recovery units (WHRU)
- **Impact**: Reduces steam demand from the boiler, lowering fuel consumption
- **Sustainability**: Saves bagasse fuel and reduces CO₂ emissions
- **Decision Support**: Provides AI-powered engineering recommendations with ROI projections to help plant managers make informed decisions

---

## 🚀 How to Run the Project

<a id="prerequisites-anchor"></a>
### 📋 Prerequisites

- Python 3.8+ installed
- A Groq API key (optional — for AI insights)

<a id="run-backend-anchor"></a>
### ⚙️ Step 1 — Start the Backend

```bash
cd ThermaVision/backend
pip install -r requirements.txt
python run.py
```

Backend starts locally at `http://127.0.0.1:8080` or is available at `https://thermavision.onrender.com`

<a id="run-frontend-anchor"></a>
### 🌐 Step 2 — Start the Frontend

```bash
cd ThermaVision/frontend
python -m http.server 3000 --bind 127.0.0.1
```

Frontend starts at `http://127.0.0.1:3000`

<a id="use-app-anchor"></a>
### 🖱️ Step 3 — Use the App

1. Open `http://127.0.0.1:3000` in your browser
2. Click "Launch Simulation" to go to the input form
3. Fill in plant parameters and click "Run Analysis"
4. View your results on the Dashboard page

---

## ⚖️ License

This documentation and the ThermaVision software are provided under the [MIT License](../LICENSE).

---

_Created by Team Four-0-Four for SugarNxt Hackathon 2026. All rights reserved._
