# 🚀 SugarNxt Hackathon 2026 — ThermaVision

<div align="center">

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Three.js](https://img.shields.io/badge/three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D?style=for-the-badge&logo=chart.js&logoColor=white)
![Status](https://img.shields.io/badge/Status-Hackathon_Ready-success?style=for-the-badge)

</div>

---

## 📚 Table of Contents

- [✨ Overview](#-overview)
- [🏛️ About ISMA](#️-about-isma)
- [🧩 Hackathon Problem Statements](#-hackathon-problem-statements)
- [🔥 ThermaVision — Our PS-5 Solution](#-thermavision--our-ps-5-solution)
- [🏗️ Technical Architecture](#️-technical-architecture)
- [▶️ Quick Start — Run Locally](#️-quick-start--run-locally)
- [👥 Team Four-0-Four](#-team-four-0-four)
- [📂 Project Structure](#-project-structure)
- [🤝 Future Roadmap](#-future-roadmap)

---

## ✨ Overview

The **ISMA SugarNXT Hackathon 2026** is an industry-driven initiative accelerating technology-led transformation across the Indian sugar ecosystem.

Our submission, **ThermaVision**, addresses **PS-5**: *Converting Flue Gas Waste into Process Energy ♻️*

*ThermaVision* is a high-fidelity full-stack prototype designed to model, analyze, and optimize recovery of usable process energy from flue-gas streams—helping mills improve efficiency, sustainability, and thermodynamic ROI.

---

## 🏛️ About ISMA

The **Indian Sugar Mills Association (ISMA)** has represented the Indian sugarcane sector for over nine decades. ISMA works closely with policymakers, industry leaders, and farmers to modernize operations and drive sustainable growth.

🌐 **Website:** [https://ismaindia.org](https://ismaindia.org)

---

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

## 🔥 ThermaVision — Our PS-5 Solution

### 🎯 Objective
Capture thermal energy potential from boiler flue gas and convert it into usable process energy (via pre-heating raw juice) while maximizing operational safety and sustainability.

### ✨ Key Features
- **Thermodynamic Engine**: Precise energy-balance calculations using industrial-grade physics.
- **AI Insight Generator**: Automatically creates boardroom-ready executive summaries.
- **Interactive Dashboards**: 3D visualizations and real-time ROI sensitivity analysis.
- **Technical Reports**: Professional PDF generation for engineering stakeholders.

---

## 🏗️ Technical Architecture

We have built a robust **Decoupled Full-Stack** solution:

- **Backend**: FastAPI (Python), Uvicorn, Pydantic, FPDF2.
- **Frontend**: HTML5, Vanilla CSS (Glassmorphism), JavaScript (ES6+), Three.js, Chart.js.

---

## ▶️ Quick Start — Run ThermaVision Locally

### Prerequisites
- Python 3.9+
- Modern Web Browser (Chrome/Edge/Firefox)

### Step 1: Clone & Setup Environment
```bash
# Create and activate virtual environment
python -m venv .venv
# On Windows:
.\.venv\Scripts\Activate.ps1
# On Mac/Linux:
source .venv/bin/activate
```

### Step 2: Install Dependencies
```bash
pip install -r ThermaVision/backend/requirements.txt
```

### Step 3: Launch Backend Server
```bash
python ThermaVision/backend/run.py
```
*API will be available at: `http://localhost:8000`*

### Step 4: Open Frontend
You can open the following files directly in your browser or use a live server:
- `ThermaVision/frontend/index.html` (Landing Page)
- `ThermaVision/frontend/simulation.html` (Data Entry)

---

## 👥 Team Four-0-Four

We are a dedicated group of engineers passionate about industrial sustainability.

| Name | Role |
| :--- | :--- |
| **Babin Bid** | Team Lead & Full-Stack Architect |
| **Debasmita Bose** | Engineering Logic |
| **Joita Paul** | Frontend UX & Data Visualization |
| **Manisha Debnath** | Documentation & Quality Assurance |

---

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
