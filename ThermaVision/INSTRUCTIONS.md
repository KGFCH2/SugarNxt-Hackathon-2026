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

## 🔗 How it Works: The Full-Stack Significance

ThermaVision is not just a visual tool; it is a **Mission-Critical Industrial Engine**. Here is how the frontend and backend collaborate to deliver technical value:

1.  **User Input (Frontend)**: The user enters specific mill parameters (e.g., Flue Gas Temp, Juice Flow Rate) in `simulation.html`.
2.  **Frontend Request**: `simulation.js` packages this data into a JSON payload and sends it via an asynchronous `POST` request to the FastAPI backend.
3.  **Thermodynamic Processing (Backend)**: 
    - The backend engine (`calculator.py`) applies the first law of thermodynamics ($Q = \dot{m} \times C_p \times \Delta T$) to convert raw temperatures into thermal energy (kW).
    - It then calculates equivalent steam savings, which directly translates to **Bagasse fuel reduction**.
4.  **AI Technical Consulting (Backend + Groq)**:
    - The server securely proxies data to the **Groq Llama-3 AI**.
    - The AI analyzes the calculated metrics and provides a boardroom-ready executive summary, recommending specific equipment (e.g., Shell & Tube vs. Plate Heat Exchangers).
5.  **Multi-Scenario Generation**: The backend runs optimization loops (`optimizer.py`) to generate "Base", "Improved", and "Optimized" versions of the recovery strategy.
6.  **Secure Persistence**: By handling logic on the backend, we keep sensitive industrial math and **API Keys** secured away from the client-side browser.
7.  **Data Visualization (Frontend)**: The frontend receives the calculated JSON, stores it in `sessionStorage`, and uses **Chart.js** and **Lucide** to turn raw numbers into actionable charts and metrics.
8.  **Professional Reporting**: The backend generates a timestamped PDF technical report using the `FPDF2` library, which is streamed back to the user for implementation planning.

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
