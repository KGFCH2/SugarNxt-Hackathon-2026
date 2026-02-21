# 🔥 ThermaVision — Smart Flue Gas Waste Heat Recovery Intelligence Portal

<div align="center">
  <p><b>SugarNxt Hackathon 2026 Entry</b></p>
  <p>AI-powered industrial energy optimization platform for waste heat analysis, CO₂ reduction, and ROI calculation.</p>
</div>

---

## 📋 Table of Contents
- [👥 Meet the Team](#-meet-the-team)
- [🎯 Project Objective](#-project-objective)
- [🔴 Problem Statement](#-problem-statement)
- [✨ Key Features](#-key-features)
- [🏗️ Technical Architecture](#️-technical-architecture)
- [📂 Folder Structure](#-folder-structure)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🚀 Running the Application](#-running-the-application)
- [📖 Technical Instructions](#-technical-instructions)
- [🌐 API Documentation](#-api-documentation)
- [🚢 Deployment](#-deployment)

---

## 👥 Meet the Team
I am proud to present the engineering team behind **ThermaVision**, participating in the **SugarNxt Hackathon 2026**:

1.  **Babin Bid** (Team Leader)
2.  **Debasmita Bose**
3.  **Joita Paul**
4.  **Manisha Debnath**

---

## 🎯 Project Objective
The sugar industry generates massive amounts of flue gas as waste. **ThermaVision** is designed to capture this lost energy. By installing a waste heat recovery unit (WHRU), plants can pre-heat raw juice using flue gases, directly reducing the steam demand from the boiler. 

My project provides a high-fidelity simulation and decision-support tool to:
1.  **Quantify** the exact heat available in the flue gas stream.
2.  **Optimize** the thermal ROI based on fuel costs and operating hours.
3.  **Translate** engineering data into executive-ready AI insights and PDF reports.

---

## 🔴 Problem Statement
The sugar industry is one of the most energy-intensive sectors, where boilers consume massive amounts of **Bagasse** (biomass) to generate high-pressure steam. Traditionally, a significant portion of this thermal energy is lost to the atmosphere through **Flue Gases** exiting at high temperatures (160°C – 250°C).

**The Challenge**: How can we minimize this "invisible waste" and redirect it back into the production cycle? 

**The Solution**: ThermaVision addresses this by providing an intelligent simulation engine that calculates the feasibility of diverting flue gas heat into **Process Energy**. By pre-heating "Raw Juice" or "Mixed Juice" using a specialized Heat Recovery Unit (HRU), we can:
-   Reduce the steam required in juice heaters.
-   Directly lower the demand on the boiler.
-   Save tons of Bagasse fuel annually.
-   Drastically reduce the plant's overall carbon footprint.

---

## ✨ Key Features
-   **3D Intelligence UI**: Modern dashboard with Three.js visualizations and Lucide iconography.
-   **Thermodynamic Engine**: Precise energy-balance calculations for industrial scale ($Q = \dot{m} \times C_p \times \Delta T$).
-   **Multi-Scenario Analysis**: Compare Base vs. Optimized hardware configurations side-by-side.
-   **Interactive Sensitivity**: Live ROI updates via real-time sliders for CAPEX and Fuel costs.
-   **AI Insight Generator**: Professional boardroom-ready summaries for engineering stakeholders.
-   **Technical Reports**: Auto-generated PDF reports with full data breakdowns and equipment recommendations.

---

## 🏗️ Technical Architecture
I have built a robust **Full-Stack** solution where both ends share equal engineering weight:

-   **Backend**: FastAPI (Python), Uvicorn, Pydantic, FPDF2. Handles calculations and AI logic.
-   **Frontend**: HTML5, CSS3 (Glassmorphism), JavaScript (ES6+), Three.js, Chart.js. Handles visualization and UX.

---

## 📂 Folder Structure
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

## ⚙️ Installation & Setup

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Frontend Setup
The frontend is built with pure web technologies and requires no installation. Just serve it using any static server or open `index.html`.

---

## 🚀 Running the Application

### 1. Launch Backend
```bash
cd backend
python run.py
```
*Backend runs on: `http://localhost:8000`*

### 2. Launch Frontend
Use VS Code Live Server or python's built-in server:
```bash
cd frontend
python -m http.server 3000
```
*Frontend runs on: `http://localhost:3000`*

---

## 📖 Technical Instructions
For a file-by-file explanation, backend-frontend connection logic, and a deep dive into the engineering math, please refer to my primary instruction document:

👉 **[Read INSTRUCTIONS.md](./INSTRUCTIONS.md)**

---

## 🌐 API Documentation

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

---

## 🚢 Deployment
-   **Backend**: Optimized for deployment on **Render** (via uvicorn).
-   **Frontend**: Optimized for **Netlify** or **GitHub Pages**.
-   **CORS**: Pre-configured in `backend/app/main.py` to allow cross-origin requests.

---
*Developed for the SugarNxt Hackathon 2026. Converting industrial waste into process energy.*
