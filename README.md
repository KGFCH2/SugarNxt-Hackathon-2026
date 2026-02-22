<div align="center">

# 🚀 SugarNxt Hackathon 2026 — ThermaVision 🔥

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Three.js](https://img.shields.io/badge/three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D?style=for-the-badge&logo=chart.js&logoColor=white)
![Status](https://img.shields.io/badge/Status-Hackathon_Ready-success?style=for-the-badge)

</div>

---

## 📚 Table of Contents

- [✨ Overview](#overview)
- [🏛️ About ISMA](#about-isma)
- [🧩 Hackathon Problem Statements](#hackathon-problem-statements)
- [🔥 ThermaVision — Our PS-5 Solution](#thermavision-solution)
- [🏗️ Technical Architecture](#technical-architecture)
- [▶️ Quick Start — Run Locally](#quick-start)
- [👥 Team Four-0-Four](#team)
- [📂 Project Structure](#project-structure)
- [🤝 Future Roadmap](#future-roadmap)

---

<a id="overview"></a>

## ✨ Overview

The **ISMA SugarNXT Hackathon 2026** is an industry-driven initiative accelerating technology-led transformation across the Indian sugar ecosystem.

Our submission, **ThermaVision**, addresses **PS-5**: *Converting Flue Gas Waste into Process Energy ♻️*

*ThermaVision* is a high-fidelity full-stack prototype designed to model, analyze, and optimize recovery of usable process energy from flue-gas streams—helping mills improve efficiency, sustainability, and thermodynamic ROI.

---

<a id="about-isma"></a>

## 🏛️ About ISMA

The **Indian Sugar Mills Association (ISMA)** has represented the Indian sugarcane sector for over nine decades. ISMA works closely with policymakers, industry leaders, and farmers to modernize operations and drive sustainable growth.

🌐 **Website:** [https://ismaindia.org](https://ismaindia.org)

---

<a id="hackathon-problem-statements"></a>

## 🧩 Hackathon Problem Statements

- **PS-1** — Developing MOC for High-Impact Cane Preparation 🍃
- **PS-2** — Micro-Filtration for High-Yield Juice Clarification 🧫
- **PS-3** — Advanced Molecular Separation for Crystal-Pure Juice 🧪
- **PS-4** — AI-Driven “Cane-to-Bag” Zero-Touch Manufacturing 🤖
- **PS-5** — **Converting Flue Gas Waste into Process Energy ♻️** (Our Focus)
- **PS-6** — Precision AI for Cane Quality Assessment 🧠
- **PS-7** — Smarter Cooling for Maximum Sugar Recovery ❄️
- **PS-8** — Transforming Sugar By-Products into High-Value Future Fuels 🔋

---

<a id="thermavision-solution"></a>

## 🔥 ThermaVision — Our PS-5 Solution

<div align="center">
**Flue gas emissions from industrial boilers — a massive untapped energy source**
</div>

### 🎯 Objective

Capture thermal energy potential from boiler flue gas and convert it into usable process energy (via pre-heating raw juice) while maximizing operational safety and sustainability.

### ✨ Key Features

- **Thermodynamic Engine**: Precise energy-balance calculations using industrial-grade physics.
- **AI Insight Generator**: Automatically creates boardroom-ready executive summaries.
- **Interactive Dashboards**: 3D visualizations and real-time ROI sensitivity analysis.
- **Technical Reports**: Professional PDF generation for engineering stakeholders.

---

<a id="technical-architecture"></a>

## 🏗️ Technical Architecture

We have built a robust **Decoupled Full-Stack** solution:

- **Backend**: FastAPI (Python), Uvicorn, Pydantic, FPDF2.
- **Frontend**: HTML5, Vanilla CSS (Glassmorphism), JavaScript (ES6+), Three.js, Chart.js.

---

<a id="quick-start"></a>

## ▶️ Quick Start — Run ThermaVision Locally

### Prerequisites

- **Python 3.9+** — ([Download here](https://www.python.org/downloads/))
- **pip** — Comes bundled with Python
- Modern Web Browser (Chrome / Edge / Firefox)

### Step 1: Clone & Setup Environment

```bash
# Clone the repository (or download ZIP)
git clone <repo-url>
cd SugarNxt_Hackathon_2026/ThermaVision

# Create and activate virtual environment
cd backend
python -m venv venv

# Activate:
# Windows (PowerShell):
.\venv\Scripts\activate
# Windows (CMD):
venv\Scripts\activate.bat
# Mac / Linux:
source venv/bin/activate
```

### Step 2: Install Dependencies

```bash
# Inside the backend directory with venv active
pip install -r requirements.txt
```

### Step 3: Launch Backend Server

```bash
# From the backend directory
python run.py
```

You should see: `INFO: Uvicorn running on http://0.0.0.0:8000`

### Step 4: Launch Frontend (New Terminal)

```bash
# Open a NEW terminal, navigate to the frontend folder
cd SugarNxt_Hackathon_2026/ThermaVision/frontend

# Start a simple HTTP server
python -m http.server 3000
```

You should see: `Serving HTTP on :: port 3000 ...`

### Step 5: Open in Browser

Go to **<http://localhost:3000>** — The ThermaVision portal is now live!

> **Important:** Keep both terminals running. The frontend (port 3000) sends API requests to the backend (port 8000).

---

<a id="team"></a>

## 👥 Team Four-0-Four

We are a dedicated group of engineers passionate about industrial sustainability.

| Name | Role | GitHub |
| :--- | :--- | :--- |
| **Babin Bid** | Team Leader & Developer | [@KGFCH2](https://github.com/KGFCH2) |
| **Debasmita Bose** | Developer | [@DebasmitaBose0](https://github.com/DebasmitaBose0) |
| **Joita Paul** | Developer | [@joitapaul](https://github.com/joitapaul) |
| **Manisha Debnath** | Developer | [@mistu7debnath](https://github.com/mistu7debnath) |

---

<a id="project-structure"></a>

## 📂 Project Structure

```bash
ThermaVision/
├── backend/                # ⚙️ FastAPI Python Server
│   ├── app/
│   │   ├── api/            # Route definitions
│   │   ├── engine/         # Calc & AI Logic
│   │   └── models/         # Data Schemas
│   └── run.py              # Server Entry
├── frontend/               # 🌐 Client-side Dashboard
│   ├── css/                # Styling (Glassmorphism)
│   ├── js/                 # 3D & Chart Logic
│   └── index.html          # Entry Point
├── INSTRUCTIONS.md         # 📖 Technical Manual
└── README.md               # 📋 Project Overview
```

---

<a id="future-roadmap"></a>

## 🤝 Future Roadmap

- [ ] **Hardware Integration**: Real-time IoT sensor telemetry.
- [ ] **Predictive Maintenance**: AI-driven fouling detection for heat exchangers.
- [ ] **Multi-Plant Aggregation**: Dashboard for multi-mill groups.
- [ ] **Export to CAD**: Auto-generate heat exchanger specs for manufacturers.

---

## 📝 License & Credits

Developed for **ISMA SugarNXT Hackathon 2026** by **Team Four-0-Four**.
All contributors retain ownership of their respective work.

---
<div align="center">
Thank you for exploring <b>ThermaVision</b>.
</div>
