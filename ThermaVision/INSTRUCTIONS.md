# 📖 ThermaVision Project Instructions & Architecture

Welcome to the internal documentation for **ThermaVision**. This guide explains how the frontend and backend are interconnected, the purpose of every file, and the core engineering principles behind the platform.

---

## 👥 Meet the Team
**ThermaVision** is the result of a collaborative spirit from the engineering team for the **SugarNxt Hackathon**:

- 🧑‍💻 **Babin Bid** — Team Lead & Architect
- 👩‍💻 **Debasmita Bose** — Developer
- 👩‍💻 **Joita Paul** — Developer
- 👩‍💻 **Manisha Debnath** — Developer

---

## 🏗️ System Architecture

ThermaVision follows a modern **Decoupled Full-Stack Architecture**:

1.  **Frontend (Client side)**: Built with Vanilla HTML5, CSS3 (Glassmorphism), and JavaScript. It uses **Three.js** for 3D visualizations and **Chart.js** for data rendering.
2.  **Backend (Server side)**: A high-performance **FastAPI** (Python) server that handles complex thermodynamic calculations, AI-powered insight generation, and PDF report creation.
3.  **API Communication**: The frontend sends plant parameters via `POST` requests to the backend. The backend returns a structured JSON object which the frontend stores in `sessionStorage` for persistence across pages (Simulation -> Dashboard).

---

## 📂 File-by-File Breakdown

### 🌐 Frontend ( `/frontend` )

#### 🦴 Layout & Structure
*   **`index.html`**: The main landing page. Introduces the project, showcases high-level stats, and features a 3D particle background.
*   **`simulation.html`**: The configuration interface. A validated form where users enter plant data.
*   **`dashboard.html`**: The results center. Displays metrics, charts, AI recommendations, and environmental impact.

#### 🎨 Styling
*   **`css/styles.css`**: The design system. Contains all CSS variables, glassmorphism logic, and responsive layouts.

#### 🧠 Logic & Interactivity
*   **`js/app.js`**: Global interactions. Handles Three.js background and hero slider.
*   **`js/simulation.js`**: Form controller. Manages validation and calls the `/analyze` API.
*   **`js/dashboard.js`**: Data visualizer. Renders Chart.js instances and handles PDF downloads.

---

### ⚙️ Backend ( `/backend` )

#### 🚀 Core Server
*   **`run.py`**: The entry point. Launches the Uvicorn server.
*   **`app/main.py`**: FastAPI initialization. Configures CORS and routes.
*   **`requirements.txt`**: Dependency list (`fastapi`, `uvicorn`, `fpdf2`, `pydantic`).

#### 🛣️ API Layer
*   **`app/api/routes.py`**: The command center. Defines `/analyze` and `/report` endpoints.
*   **`app/models/schemas.py`**: Data integrity. Pydantic models for request/response.

#### 🧪 Engineering Engine ( `/app/engine` )
*   **`calculator.py`**: Thermodynamic logic ($Q = \dot{m} \times C_p \times \Delta T$) for heat recovery.
*   **`optimizer.py`**: Scenario engine. Generates comparisons and ROI.
*   **`insights.py`**: AI Insight Generator. Creates summaries based on results.

---

## 🔗 How it Works: The Connection

1.  **User Input**: User fills the form in `simulation.html`.
2.  **Frontend Request**: `simulation.js` sends JSON to the backend.
3.  **Backend Calculation**: The engine processes thermodynamics, ROI, and AI insights.
4.  **Backend Response**: FastAPI returns a comprehensive JSON result set.
5.  **Data Storage**: Results are saved in `sessionStorage`.
6.  **UI Update**: `dashboard.html` retrieves data and renders visualizations instantly.

---

## 🏆 SugarNxt Hackathon Context

This project specifically targets **Sugar Industry Flue Gas Waste**. 

### 🔴 The Problem Statement
Boilers emit high-temperature flue gases, wasting significant thermal energy. Capturing this is critical for efficiency.

### 🟢 Our Solution
- **Methodology**: Pre-heating "Raw Juice" using flue gas heat.
- **Impact**: Reduces steam demand from the boiler.
- **Sustainability**: Saves **Bagasse** fuel and lowers $CO_2$ emissions.

---
<div align="center">
<i>Created by Team Four-0-Four for SugarNxt 2026.</i>
</div>
