"""
API routes — single router with the /analyze endpoint + PDF download.
"""

from fastapi import APIRouter, Response, HTTPException
from ..models.schemas import AnalysisRequest, AnalysisResponse, ChatRequest, ChatResponse
from ..engine.calculator import (
    calculate_heat_recovered,
    calculate_steam_saved,
    calculate_annual_savings,
    calculate_payback,
    calculate_co2_reduction,
    calculate_efficiency_gain,
)
from ..engine.optimizer import (
    recommend_heat_exchanger,
    generate_scenarios,
    project_roi_5yr,
    calculate_climate_equivalence,
)
from ..engine.insights import generate_ai_summary
from fpdf import FPDF
import io
import os
from groq import Groq

router = APIRouter()


def _sanitize_pdf(text: str) -> str:
    """Replace unicode characters that Helvetica cannot render."""
    replacements = {
        "\u2014": "--",  # em-dash
        "\u2013": "-",   # en-dash
        "\u2018": "'",   # left single quote
        "\u2019": "'",   # right single quote
        "\u201c": '"',   # left double quote
        "\u201d": '"',   # right double quote
        "\u2026": "...", # ellipsis
        "\u00b2": "2",   # superscript 2
        "\u2248": "~",   # approx
        "\u00b0": " deg",# degree
        "\u2022": "*",   # bullet
        "\u20ac": "EUR", # euro
        "\u00a3": "GBP", # pound
        "\u2705": "[OK]",
        "\u26a0\ufe0f": "[!]",
        "\u26a0": "[!]",
        "\u2757": "[!]",
        "\u20b9": "Rs.",   # indian rupee
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    # Strip any remaining non-latin1 characters
    return text.encode("latin-1", errors="replace").decode("latin-1")


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze(req: AnalysisRequest):
    """
    Main analysis endpoint.

    Accepts plant parameters, runs all calculations,
    generates scenarios, recommendations, and AI insight.
    """
    # --- Core calculations ---
    heat_kw = calculate_heat_recovered(req.flow_rate, req.flue_temp_in, req.flue_temp_out)
    steam = calculate_steam_saved(heat_kw)
    savings = calculate_annual_savings(steam, req.operating_hours, req.fuel_cost)
    payback = calculate_payback(req.installation_cost, savings)
    co2 = calculate_co2_reduction(steam, req.operating_hours, req.fuel_type.value)
    eff = calculate_efficiency_gain(heat_kw, req.flow_rate, req.flue_temp_in)

    # --- Multi-scenario ---
    scenarios = generate_scenarios(
        req.flow_rate, req.flue_temp_in, req.flue_temp_out,
        req.fuel_type.value, req.fuel_cost,
        req.operating_hours, req.installation_cost,
    )

    # --- Recommendation ---
    rec = recommend_heat_exchanger(req.flue_temp_in, req.flue_temp_out)

    # --- 5-year ROI ---
    roi_5yr = project_roi_5yr(savings, req.installation_cost)

    # --- Climate impact ---
    climate = calculate_climate_equivalence(co2)

    # --- Energy breakdown ---
    total_input_kw = (req.flow_rate * 1.0 * req.flue_temp_in) / 3600.0
    energy_recovered_pct = round((heat_kw / total_input_kw) * 100, 2) if total_input_kw > 0 else 0
    energy_lost_pct = round(100 - energy_recovered_pct, 2)

    # --- AI insight ---
    summary = generate_ai_summary(
        heat_kw, steam, savings, payback, co2, eff,
        req.fuel_type.value, rec["heat_exchanger_type"],
        rec["dew_point_warning"],
    )

    return AnalysisResponse(
        heat_recovered_kW=heat_kw,
        steam_saved_kg_hr=steam,
        annual_savings=savings,
        payback_years=payback,
        co2_reduction_tons=co2,
        efficiency_gain_pct=eff,
        scenarios=scenarios,
        recommendation=rec,
        climate_impact=climate,
        ai_summary=summary,
        roi_5yr=roi_5yr,
        energy_recovered_pct=energy_recovered_pct,
        energy_lost_pct=energy_lost_pct,
    )


@router.post("/report")
async def generate_report(req: AnalysisRequest):
    """
    Generate and return a downloadable PDF technical report.
    """
    # Re-run analysis
    heat_kw = calculate_heat_recovered(req.flow_rate, req.flue_temp_in, req.flue_temp_out)
    steam = calculate_steam_saved(heat_kw)
    savings = calculate_annual_savings(steam, req.operating_hours, req.fuel_cost)
    payback = calculate_payback(req.installation_cost, savings)
    co2 = calculate_co2_reduction(steam, req.operating_hours, req.fuel_type.value)
    eff = calculate_efficiency_gain(heat_kw, req.flow_rate, req.flue_temp_in)
    rec = recommend_heat_exchanger(req.flue_temp_in, req.flue_temp_out)
    climate = calculate_climate_equivalence(co2)
    summary = generate_ai_summary(
        heat_kw, steam, savings, payback, co2, eff,
        req.fuel_type.value, rec["heat_exchanger_type"],
        rec["dew_point_warning"],
    )

    # Build PDF
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Title
    pdf.set_font("Helvetica", "B", 20)
    pdf.cell(0, 15, "Waste Heat Recovery - Technical Report", ln=True, align="C")
    pdf.ln(5)

    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 8, "Generated by Smart Flue Gas WHR Intelligence Portal", ln=True, align="C")
    pdf.ln(10)

    # Input Parameters
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "1. Input Parameters", ln=True)
    pdf.set_font("Helvetica", "", 11)
    params = [
        f"Flue Gas Inlet Temperature: {req.flue_temp_in} C",
        f"Flue Gas Outlet Temperature: {req.flue_temp_out} C",
        f"Flow Rate: {req.flow_rate:,.0f} kg/hr",
        f"Fuel Type: {req.fuel_type.value}",
        f"Fuel Cost: Rs. {req.fuel_cost}/kg",
        f"Operating Hours: {req.operating_hours:,.0f} hrs/yr",
        f"Installation Cost: Rs. {req.installation_cost:,.0f}",
    ]
    for p in params:
        pdf.cell(0, 7, _sanitize_pdf(f"  - {p}"), ln=True)
    pdf.ln(5)

    # Results
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "2. Analysis Results", ln=True)
    pdf.set_font("Helvetica", "", 11)
    results = [
        f"Heat Recovered: {heat_kw:,.2f} kW",
        f"Steam Saved: {steam:,.2f} kg/hr",
        f"Annual Savings: Rs. {savings:,.2f}",
        f"Payback Period: {payback:.2f} years",
        f"CO2 Reduction: {co2:,.2f} tons/year",
        f"Efficiency Gain: {eff:.2f}%",
    ]
    for r in results:
        pdf.cell(0, 7, _sanitize_pdf(f"  - {r}"), ln=True)
    pdf.ln(5)

    # Recommendation
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "3. Recommendation", ln=True)
    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 7, _sanitize_pdf(f"  Equipment: {rec['heat_exchanger_type']}"), ln=True)
    pdf.cell(0, 7, _sanitize_pdf(f"  Optimal Exit Temp: {rec['optimal_exit_temp']} C"), ln=True)
    pdf.cell(0, 7, _sanitize_pdf(f"  {rec['efficiency_improvement']}"), ln=True)
    if rec["dew_point_warning"]:
        pdf.set_text_color(200, 0, 0)
        pdf.cell(0, 7, _sanitize_pdf(f"  WARNING: {rec.get('warning_message', '')}"), ln=True)
        pdf.set_text_color(0, 0, 0)
    pdf.ln(5)

    # Climate Impact
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "4. Five-Year Climate Impact", ln=True)
    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 7, f"  Total CO2 Avoided: {climate['total_co2_avoided_tons']:,.0f} tons", ln=True)
    pdf.cell(0, 7, f"  Equivalent Trees Planted: {climate['equivalent_trees_planted']:,}", ln=True)
    pdf.cell(0, 7, f"  Equivalent Cars Removed: {climate['equivalent_cars_removed']:,}", ln=True)
    pdf.ln(5)

    # AI Summary
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "5. Executive Summary", ln=True)
    pdf.set_font("Helvetica", "", 11)
    pdf.multi_cell(0, 7, _sanitize_pdf(summary))

    # Footer
    pdf.ln(15)
    pdf.set_font("Helvetica", "I", 9)
    pdf.cell(0, 8, "This report was automatically generated. All values are estimates based on standard engineering assumptions.", ln=True, align="C")

    # Output
    pdf_bytes = pdf.output()
    return Response(
        content=bytes(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=WHR_Technical_Report.pdf"},
    )


