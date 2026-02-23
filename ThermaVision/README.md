# 🚀 ThermaVision — Smart Flue Gas Waste Heat Recovery Intelligence Portal

## Capturing waste heat from industrial flue gas to power sugar mill operations

### SugarNxt Hackathon 2026 Entry

AI-powered industrial energy optimization platform for waste heat analysis, CO₂ reduction, and ROI calculation.

---

## Table of Contents

- [👥 Meet the Team](#meet-the-team)
- [🎯 Project Objective](#project-objective)
- [🔴 Problem Statement](#problem-statement)
- [✨ Key Features](#key-features)
- [🏗️ Technical Architecture](#technical-architecture)
- [📂 Folder Structure](#folder-structure)
- [⚙️ Installation & Setup](#installation-and-setup)
- [🚀 Running the Application](#running-the-application)
- [📖 Technical Instructions](#technical-instructions)
- [🌐 API Documentation](#api-documentation)
- [🚢 Deployment Guide](#deployment-guide)
- [🎨 UI Features](#ui-features)

---

## Meet the Team

I am proud to present the engineering team behind **ThermaVision**, participating in the **SugarNxt Hackathon 2026**:

1. **Babin Bid** (Team Leader & Developer) — [@KGFCH2](https://github.com/KGFCH2)
2. **Debasmita Bose** (Developer) — [@DebasmitaBose0](https://github.com/DebasmitaBose0)
3. **Joita Paul** (Developer) — [@joitapaul](https://github.com/joitapaul)
4. **Manisha Debnath** (Developer) — [@mistu7debnath](https://github.com/mistu7debnath)

---

## Project Objective

The sugar industry generates massive amounts of flue gas as waste. **ThermaVision** is designed to capture this lost energy. By installing a waste heat recovery unit (WHRU), plants can pre-heat raw juice using flue gases, directly reducing the steam demand from the boiler.

My project provides a high-fidelity simulation and decision-support tool to:

1. **Quantify** the exact heat available in the flue gas stream.
2. **Optimize** the thermal ROI based on fuel costs and operating hours.
3. **Translate** engineering data into executive-ready AI insights and PDF reports.

---

## Problem Statement

_Sugarcane being transported to the mill — where bagasse-fired boilers generate flue gas waste._

The sugar industry is one of the most energy-intensive sectors, where boilers consume massive amounts of **Bagasse** (biomass) to generate high-pressure steam. Traditionally, a significant portion of this thermal energy is lost to the atmosphere through **Flue Gases** exiting at high temperatures (160°C – 250°C).

**The Challenge**: How can we minimize this "invisible waste" and redirect it back into the production cycle?

**The Solution**: ThermaVision addresses this by providing an intelligent simulation engine that calculates the feasibility of diverting flue gas heat into **Process Energy**. By pre-heating "Raw Juice" or "Mixed Juice" using a specialized Heat Recovery Unit (HRU), we can:

- Reduce the steam required in juice heaters.
- Directly lower the demand on the boiler.
- Save tons of Bagasse fuel annually.
- Drastically reduce the plant's overall carbon footprint.

---

## Key Features

- **3D Intelligence UI**: Modern dashboard with Three.js visualizations and Lucide iconography.
- **Thermodynamic Engine**: Precise energy-balance calculations for industrial scale ($Q = \dot{m} \times C_p \times \Delta T$).
- **Multi-Scenario Analysis**: Compare Base vs. Optimized hardware configurations side-by-side.
- **Interactive Sensitivity**: Live ROI updates via real-time sliders for CAPEX and Fuel costs.
- **AI Insight Generator**: Professional boardroom-ready summaries for engineering stakeholders.
- **Technical Reports**: Auto-generated PDF reports with full data breakdowns and equipment recommendations.

---

## Technical Architecture

I have built a robust **Full-Stack** solution where both ends share equal engineering weight:

- **Backend**: FastAPI (Python), Uvicorn, Pydantic, FPDF2. Handles calculations and AI logic.
- **Frontend**: HTML5, CSS3 (Glassmorphism), JavaScript (ES6+), Three.js, Chart.js. Handles visualization and UX.

---

## Folder Structure

```bash
ThermaVision/
├── backend/                # ⚙️ Python FastAPI Server
│   ├── app/
│   │   ├── api/            # API Route definitions (/analyze, /report)
│   │   ├── engine/         # Core thermodynamic & AI logic
│   │   ├── models/         # Pydantic data schemas
│   │   └── main.py         # App entry point & CORS config
│   ├── run.py              # Server launcher
│   └── requirements.txt    # Backend dependencies
├── frontend/               # 🌐 Client-side Application
│   ├── css/                # Glassmorphism, Animations, UI Tokens
│   ├── js/                 # Three.js 3D, Hero Slider, Dashboard logic
│   ├── index.html          # Landing Page (Three.js Background)
│   ├── simulation.html     # Input Form (Real-time Validation)
│   └── dashboard.html      # Results Center (Charts & Slicers)
├── INSTRUCTIONS.md         # 📖 Extensive Dev Documentation & Architecture
└── README.md               # 📋 Project Overview
```

---

## Installation and Setup

### Prerequisites

Before you begin, make sure the following are installed on your machine:

- **Python 3.9+** — [Download Python](https://www.python.org/downloads/)
- **pip** — Comes bundled with Python
- **Git** — [Download Git](https://git-scm.com/downloads)
- A modern web browser (Chrome, Edge, Firefox)

### 1. Clone the Repository

```bash
git clone <repo-url>
cd SugarNxt_Hackathon_2026/ThermaVision
```

### 2. Backend Setup

```bash
cd backend

# (Recommended) Create a virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\activate
# Windows (CMD):
venv\Scripts\activate.bat
# Mac / Linux:
source venv/bin/activate

# Install all dependencies
pip install -r requirements.txt
```

> **Note:** The `requirements.txt` includes `fastapi`, `uvicorn`, `fpdf2`, and `pydantic`.

---

## Running the Application

### Step 1 — Start the Backend Server

Open a terminal and run:

```bash
cd ThermaVision/backend
python run.py
```

You should see output like:

```text
INFO:     Uvicorn running on http://127.0.0.1:8080
INFO:     Application startup complete.
```

**Backend is now live at:** `https://thermavision.onrender.com`

### Step 2 — Start the Frontend Server

Open a **second terminal** (keep the backend running) and run:

```bash
cd ThermaVision/frontend
python -m http.server 3000 --bind 127.0.0.1
```

You should see:

```text
Serving HTTP on :: port 3000 ...
```

**Frontend is now live at:** [http://127.0.0.1:3000](http://127.0.0.1:3000)

### Step 3 — Use the Application

1. Open your browser and go to [http://127.0.0.1:3000](http://127.0.0.1:3000)
2. You'll land on the **Home** page with a 3D particle background and image carousel
3. Click **Launch Simulation** to enter plant parameters
4. After submitting, the app calls the backend API and redirects you to the **Dashboard**
5. View charts, metrics, AI insights, and download the PDF report

> **Tip:** Both terminals must stay open while using the app locally. For production, the frontend talks to the backend via `https://thermavision.onrender.com`.

---

## Technical Instructions

For a file-by-file explanation, backend-frontend connection logic, and a deep dive into the engineering math, please refer to my primary instruction document:

👉 **[Read INSTRUCTIONS.md](./INSTRUCTIONS.md)**

---

## API Documentation

### `POST /analyze`

Performs full thermodynamic and financial analysis.

**Payload Example:**

```json
{
  "flue_temp_in": 250,
  "flue_temp_out": 140,
  "flow_rate": 10000,
  "fuel_type": "Coal",
  "fuel_cost": 5.0,
  "operating_hours": 6000,
  "installation_cost": 500000,
  "steam_demand": 5000
}
```

### `POST /report`

Generates and downloads a timestamped PDF technical report based on the analysis data.

---

## Deployment Guide

Deploying ThermaVision to the cloud is straightforward since the backend and frontend are decoupled.

### Backend → Render (Free Tier)

1. Push your code to a **GitHub** repository
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo, set:
   - **Root Directory:** `ThermaVision/backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Deploy — Render gives you a public URL: `https://thermavision.onrender.com`

### Frontend → Netlify or GitHub Pages

**Option A — Netlify (Recommended):**

1. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
2. Connect your repo, set:
   - **Base directory:** `ThermaVision/frontend`
   - **Publish directory:** `ThermaVision/frontend`
3. Deploy — Netlify gives you a URL like `https://thermavision.netlify.app`

**Option B — GitHub Pages:**

1. In your GitHub repo settings → **Pages** → set source to the `frontend` folder
2. Your site will be live at `https://<username>.github.io/<repo>/`

### Post-Deployment: Update API URL

After deploying the backend, update the API base URL in the frontend JS files:

```javascript
// In js/simulation.js, js/dashboard.js, and js/chatbot.js, change:
const API_BASE = 'http://127.0.0.1:8080';
// To your deployed backend URL:
const API_BASE = 'https://thermavision.onrender.com';
```

### CORS Configuration

CORS is already pre-configured in `backend/app/main.py` to allow all origins. For production, you can restrict it to your frontend domain.

---

## UI Features

- **Crossfade Image Carousel** — Smooth background transitions with always-visible images (no blank frames)
- **Scroll In/Out Animations** — Elements animate in when scrolling down and gracefully animate out when scrolling up
- **3D Particle Background** — Interactive Three.js particle system that responds to mouse movement
- **Glassmorphism Design** — Modern frosted-glass card effects throughout the interface
- **Responsive Layout** — Optimized for desktop, tablet, and mobile devices

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](../LICENSE) file for details.

---

_Developed for the SugarNxt Hackathon 2026. Converting industrial waste into process energy._
