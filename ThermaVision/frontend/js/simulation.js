/**
 * simulation.js — Form validation, submission, and API integration
 */

(function () {
    'use strict';

    const API_BASE = 'https://thermavision.onrender.com';

    const form = document.getElementById('simulation-form');
    const btnAnalyze = document.getElementById('btn-analyze');
    const loadingOverlay = document.getElementById('loading-overlay');

    // Field definitions with validation rules
    const fields = {
        flue_temp_in: { min: 50, max: 800, label: 'Inlet Temperature' },
        flue_temp_out: { min: 30, max: 600, label: 'Outlet Temperature' },
        flow_rate: { min: 1, max: 500000, label: 'Flow Rate' },
        steam_demand: { min: 1, max: 500000, label: 'Steam Demand' },
        fuel_cost: { min: 0.01, max: 1000, label: 'Fuel Cost' },
        operating_hours: { min: 1, max: 8760, label: 'Operating Hours' },
        installation_cost: { min: 1, max: 100000000, label: 'Installation Cost' },
    };

    // ── Real-time Validation ──────────────────────────────
    function validateField(id) {
        const input = document.getElementById(id);
        const errEl = document.getElementById('err-' + id);
        const config = fields[id];
        if (!config) return true;

        const val = parseFloat(input.value);

        if (input.value.trim() === '' || isNaN(val)) {
            input.classList.add('invalid');
            input.classList.remove('valid');
            errEl.textContent = `${config.label} is required`;
            return false;
        }
        if (val < config.min || val > config.max) {
            input.classList.add('invalid');
            input.classList.remove('valid');
            errEl.textContent = `Must be between ${config.min.toLocaleString()} and ${config.max.toLocaleString()}`;
            return false;
        }

        input.classList.remove('invalid');
        input.classList.add('valid');
        errEl.textContent = '';
        return true;
    }

    // Cross-field validation: outlet must be < inlet
    function validateCrossFields() {
        const tin = parseFloat(document.getElementById('flue_temp_in').value);
        const tout = parseFloat(document.getElementById('flue_temp_out').value);
        const errEl = document.getElementById('err-flue_temp_out');

        if (!isNaN(tin) && !isNaN(tout) && tout >= tin) {
            document.getElementById('flue_temp_out').classList.add('invalid');
            document.getElementById('flue_temp_out').classList.remove('valid');
            errEl.textContent = 'Outlet must be lower than inlet temperature';
            return false;
        }
        return true;
    }

    // Attach real-time validation
    Object.keys(fields).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => validateField(id));
            input.addEventListener('blur', () => validateField(id));
        }
    });

    // ── Form Submission ───────────────────────────────────
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        let allValid = true;
        Object.keys(fields).forEach(id => {
            if (!validateField(id)) allValid = false;
        });
        if (!validateCrossFields()) allValid = false;

        if (!allValid) return;

        // Build payload
        const payload = {
            flue_temp_in: parseFloat(document.getElementById('flue_temp_in').value),
            flue_temp_out: parseFloat(document.getElementById('flue_temp_out').value),
            flow_rate: parseFloat(document.getElementById('flow_rate').value),
            steam_demand: parseFloat(document.getElementById('steam_demand').value) || 5000,
            fuel_type: document.getElementById('fuel_type').value,
            fuel_cost: parseFloat(document.getElementById('fuel_cost').value),
            operating_hours: parseFloat(document.getElementById('operating_hours').value),
            installation_cost: parseFloat(document.getElementById('installation_cost').value),
        };

        // Show loading
        loadingOverlay.classList.add('active');
        btnAnalyze.disabled = true;

        try {
            const res = await fetch(`${API_BASE}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || `Server error (${res.status})`);
            }

            const data = await res.json();

            // Store results + input for dashboard
            sessionStorage.setItem('whr_results', JSON.stringify(data));
            sessionStorage.setItem('whr_input', JSON.stringify(payload));

            // Navigate to dashboard
            window.location.href = 'dashboard.html';

        } catch (err) {
            loadingOverlay.classList.remove('active');
            btnAnalyze.disabled = false;
            alert('Analysis failed: ' + err.message + '\n\nMake sure the backend server is running on port 8000.');
        }
    });

    // ── Reset Handling ────────────────────────────────────
    document.getElementById('btn-reset').addEventListener('click', () => {
        // Clear validation states
        Object.keys(fields).forEach(id => {
            const input = document.getElementById(id);
            const errEl = document.getElementById('err-' + id);
            if (input) {
                input.classList.remove('invalid', 'valid');
            }
            if (errEl) errEl.textContent = '';
        });
    });

    // ── Navbar scroll ─────────────────────────────────────
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        });
    }

})();
