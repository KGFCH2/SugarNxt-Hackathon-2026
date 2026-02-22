/**
 * dashboard.js — Renders analysis results, charts, sensitivity sliders
 */

(function () {
    'use strict';

    const API_BASE = 'http://localhost:8000';

    // ── Load data from sessionStorage ─────────────────────
    const rawResults = sessionStorage.getItem('whr_results');
    const rawInput = sessionStorage.getItem('whr_input');

    const noDataState = document.getElementById('no-data-state');
    const dashContent = document.getElementById('dashboard-content');

    if (!rawResults || !rawInput) {
        noDataState.style.display = 'block';
        dashContent.style.display = 'none';
        return;
    }

    noDataState.style.display = 'none';
    dashContent.style.display = 'block';

    const data = JSON.parse(rawResults);
    const input = JSON.parse(rawInput);

    // ── Utility formatters ────────────────────────────────
    function fmt(n, decimals = 2) {
        if (n === undefined || n === null) return '—';
        return Number(n).toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    }

    function fmtCurrency(n) {
        if (n === undefined || n === null) return '—';
        if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
        if (n >= 1e5) return '₹' + (n / 1e5).toFixed(2) + ' L';
        if (n >= 1e3) return '₹' + (n / 1e3).toFixed(1) + ' K';
        return '₹' + n.toFixed(2);
    }

    function fmtInt(n) {
        if (n === undefined || n === null) return '—';
        return Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 });
    }

    // ── Populate Metric Cards ─────────────────────────────
    document.getElementById('metric-heat').textContent = fmt(data.heat_recovered_kW);
    document.getElementById('metric-steam').textContent = fmt(data.steam_saved_kg_hr);
    document.getElementById('metric-savings').textContent = fmtCurrency(data.annual_savings);
    document.getElementById('metric-payback').textContent = fmt(data.payback_years);
    document.getElementById('metric-co2').textContent = fmt(data.co2_reduction_tons);
    document.getElementById('metric-eff').textContent = fmt(data.efficiency_gain_pct) + '%';

    // ── AI Insight Banner ─────────────────────────────────
    document.getElementById('ai-summary-text').textContent = data.ai_summary;

    // ── Dew Point Warning ─────────────────────────────────
    const warningBanner = document.getElementById('dew-point-warning');
    if (data.recommendation && data.recommendation.dew_point_warning) {
        warningBanner.classList.remove('hidden');
        document.getElementById('warning-text').textContent = data.recommendation.warning_message || 'Outlet temperature is below acid dew point. Corrosion risk detected.';
    }

    // ── Recommendation Card ───────────────────────────────
    if (data.recommendation) {
        document.getElementById('rec-type').textContent = data.recommendation.heat_exchanger_type;
        document.getElementById('rec-exit-temp').textContent = data.recommendation.optimal_exit_temp + '°C';
        document.getElementById('rec-improvement').textContent = data.recommendation.efficiency_improvement;
    }

    // ── Scenario Table ────────────────────────────────────
    const tbody = document.getElementById('scenario-tbody');
    if (data.scenarios && data.scenarios.length) {
        // Find best scenario (lowest payback)
        let bestIdx = 0;
        data.scenarios.forEach((s, i) => {
            if (s.payback_years < data.scenarios[bestIdx].payback_years) bestIdx = i;
        });

        data.scenarios.forEach((s, i) => {
            const isBest = (i === bestIdx);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="scenario-label">${s.label} ${isBest ? '<i data-lucide="star" style="width:12px; height:12px; display:inline-block; fill:var(--accent-orange); color:var(--accent-orange);"></i>' : ''}</td>
                <td class="${isBest ? 'scenario-best' : ''}">${fmt(s.heat_recovered_kW)}</td>
                <td class="${isBest ? 'scenario-best' : ''}">${fmt(s.steam_saved_kg_hr)}</td>
                <td class="${isBest ? 'scenario-best' : ''}">${fmtCurrency(s.annual_savings)}</td>
                <td class="${isBest ? 'scenario-best' : ''}">${fmt(s.payback_years)}</td>
                <td class="${isBest ? 'scenario-best' : ''}">${fmt(s.co2_reduction_tons)}</td>
                <td class="${isBest ? 'scenario-best' : ''}">${fmt(s.efficiency_gain_pct)}%</td>
            `;
            tbody.appendChild(tr);
        });

        // Re-initialize icons for dynamic content
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // ── Climate Impact ────────────────────────────────────
    if (data.climate_impact) {
        document.getElementById('climate-co2').textContent = fmtInt(data.climate_impact.total_co2_avoided_tons);
        document.getElementById('climate-trees').textContent = fmtInt(data.climate_impact.equivalent_trees_planted);
        document.getElementById('climate-cars').textContent = fmtInt(data.climate_impact.equivalent_cars_removed);
    }

    // ══════════════════════════════════════════════════════
    //  CHARTS (Chart.js)
    // ══════════════════════════════════════════════════════

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(148,163,184,0.08)';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // — 1. Steam Comparison Bar Chart ─────────────────────
    const steamDemand = input.steam_demand || 5000;
    const steamAfter = Math.max(0, steamDemand - data.steam_saved_kg_hr);

    new Chart(document.getElementById('chart-steam'), {
        type: 'bar',
        data: {
            labels: ['Before WHR', 'After WHR', 'Steam Saved'],
            datasets: [{
                label: 'Steam (kg/hr)',
                data: [steamDemand, steamAfter, data.steam_saved_kg_hr],
                backgroundColor: [
                    'rgba(255, 107, 53, 0.7)',
                    'rgba(251, 191, 36, 0.6)',
                    'rgba(0, 255, 136, 0.7)',
                ],
                borderColor: [
                    'rgba(255, 107, 53, 1)',
                    'rgba(251, 191, 36, 1)',
                    'rgba(0, 255, 136, 1)',
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.parsed.y.toLocaleString()} kg/hr`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(148,163,184,0.06)' },
                    ticks: { callback: v => v.toLocaleString() }
                },
                x: {
                    grid: { display: false }
                }
            },
            animation: {
                duration: 1200,
                easing: 'easeOutQuart',
            },
        },
    });

    // — 2. Energy Utilization Pie/Doughnut ─────────────────
    new Chart(document.getElementById('chart-energy'), {
        type: 'doughnut',
        data: {
            labels: ['Energy Recovered', 'Energy Lost'],
            datasets: [{
                data: [data.energy_recovered_pct, data.energy_lost_pct],
                backgroundColor: [
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(100, 116, 139, 0.4)',
                ],
                borderColor: [
                    'rgba(251, 191, 36, 1)',
                    'rgba(100, 116, 139, 0.6)',
                ],
                borderWidth: 2,
                hoverOffset: 10,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 20, usePointStyle: true, pointStyleWidth: 12 }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.label}: ${ctx.parsed.toFixed(1)}%`
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 1500,
                easing: 'easeOutQuart',
            },
        },
    });

    // — 3. ROI 5-Year Line Chart ──────────────────────────
    const roiData = data.roi_5yr || [0, 0, 0, 0, 0];

    new Chart(document.getElementById('chart-roi'), {
        type: 'line',
        data: {
            labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
            datasets: [{
                label: 'Cumulative ROI (%)',
                data: roiData,
                borderColor: '#ff4757',
                backgroundColor: 'rgba(255, 71, 87, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ff4757',
                pointBorderColor: '#fbbf24',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
                borderWidth: 3,
            },
            {
                label: 'Break-even Line',
                data: [0, 0, 0, 0, 0],
                borderColor: 'rgba(255, 71, 87, 0.5)',
                borderDash: [8, 4],
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { usePointStyle: true, pointStyleWidth: 12 }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`
                    }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(148,163,184,0.06)' },
                    ticks: { callback: v => v + '%' }
                },
                x: {
                    grid: { display: false }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart',
            },
        },
    });

    // ══════════════════════════════════════════════════════
    //  SENSITIVITY ANALYSIS
    // ══════════════════════════════════════════════════════

    const sensFuel = document.getElementById('sens-fuel');
    const sensHours = document.getElementById('sens-hours');
    const sensCost = document.getElementById('sens-cost');

    // Set slider defaults from input
    sensFuel.value = input.fuel_cost;
    sensHours.value = input.operating_hours;
    sensCost.value = input.installation_cost;

    function updateSensitivity() {
        const fuelCost = parseFloat(sensFuel.value);
        const hours = parseFloat(sensHours.value);
        const installCost = parseFloat(sensCost.value);

        // Re-calculate with sliders
        const steamSaved = data.steam_saved_kg_hr;
        const annualSavings = steamSaved * hours * fuelCost;
        const payback = installCost / annualSavings;
        const roi5yr = ((annualSavings * 5 - installCost) / installCost) * 100;

        // Update display values
        document.getElementById('sens-fuel-value').textContent = `₹${fuelCost.toFixed(2)}/kg`;
        document.getElementById('sens-hours-value').textContent = `${hours.toLocaleString()} hrs`;
        document.getElementById('sens-cost-value').textContent = `₹${installCost.toLocaleString()}`;

        // Update results
        document.getElementById('sens-savings').textContent = fmtCurrency(annualSavings);
        document.getElementById('sens-payback').textContent = payback.toFixed(2) + ' yrs';
        document.getElementById('sens-roi').textContent = roi5yr.toFixed(1) + '%';

        // Color coding
        const paybackEl = document.getElementById('sens-payback');
        paybackEl.style.color = payback < 3 ? 'var(--accent-green)' : payback < 5 ? 'var(--accent-orange)' : 'var(--accent-red)';

        const roiEl = document.getElementById('sens-roi');
        roiEl.style.color = roi5yr > 0 ? 'var(--accent-green)' : 'var(--accent-red)';
    }

    sensFuel.addEventListener('input', updateSensitivity);
    sensHours.addEventListener('input', updateSensitivity);
    sensCost.addEventListener('input', updateSensitivity);

    // Initial calculation
    updateSensitivity();

    // ══════════════════════════════════════════════════════
    //  PDF DOWNLOAD
    // ══════════════════════════════════════════════════════

    document.getElementById('btn-download-pdf').addEventListener('click', async () => {
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.classList.add('active');

        try {
            const res = await fetch(`${API_BASE}/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input),
            });

            if (!res.ok) throw new Error('Report generation failed');

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'WHR_Technical_Report.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('PDF download failed: ' + err.message);
        } finally {
            loadingOverlay.classList.remove('active');
        }
    });

    // ── Navbar scroll ─────────────────────────────────────
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        });
    }

})();
