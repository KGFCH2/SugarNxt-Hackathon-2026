"""
Intelligent recommendation & optimization engine.

Provides:
  - Heat exchanger type suggestion
  - Optimal exit temperature recommendation
  - Multi-scenario generation (Base / Improved / Optimized)
  - 5-year ROI projection
  - Climate equivalence calculations
"""

from typing import List, Dict
from .calculator import run_scenario, check_dew_point, DEW_POINT_THRESHOLD


def recommend_heat_exchanger(temp_in: float, temp_out: float) -> dict:
    """
    Suggest heat exchanger type based on temperature range.

    Rules (industrial heuristics):
      - ΔT > 150 °C  → Waste Heat Boiler
      - ΔT > 80 °C   → Economizer
      - ΔT ≤ 80 °C   → Air Preheater
    """
    delta = temp_in - temp_out

    if delta > 150:
        hx_type = "Waste Heat Boiler"
        improvement = "High-grade heat recovery — potential for direct steam generation"
    elif delta > 80:
        hx_type = "Economizer"
        improvement = "Medium-grade heat recovery — ideal for boiler feed-water preheating"
    else:
        hx_type = "Air Preheater"
        improvement = "Low-grade heat recovery — suitable for combustion air preheating"

    # Optimal exit temp: as low as safely above dew point
    optimal_exit = max(temp_out, DEW_POINT_THRESHOLD + 10)

    dew_flag, dew_msg = check_dew_point(temp_out)

    return {
        "heat_exchanger_type": hx_type,
        "optimal_exit_temp": optimal_exit,
        "efficiency_improvement": improvement,
        "dew_point_warning": dew_flag,
        "warning_message": dew_msg if dew_flag else None,
    }


def generate_scenarios(
    flow_rate: float,
    temp_in: float,
    temp_out: float,
    fuel_type: str,
    fuel_cost: float,
    operating_hours: float,
    installation_cost: float,
) -> List[Dict]:
    """
    Generate three scenarios for comparison:

    1. Base Case      — user's input as-is
    2. Improved Case  — outlet temp lowered by 15 °C (capped at dew point)
    3. Optimized Case — outlet temp lowered by 30 °C (capped at dew point + 5)
    """
    scenarios = []

    # Base
    scenarios.append(
        run_scenario(
            flow_rate, temp_in, temp_out,
            fuel_type, fuel_cost, operating_hours, installation_cost,
            label="Base Case",
        )
    )

    # Improved
    improved_out = max(temp_out - 15, DEW_POINT_THRESHOLD)
    scenarios.append(
        run_scenario(
            flow_rate, temp_in, improved_out,
            fuel_type, fuel_cost, operating_hours,
            installation_cost * 1.10,  # 10% higher capex for better HX
            label="Improved Case",
        )
    )

    # Optimized
    optimized_out = max(temp_out - 30, DEW_POINT_THRESHOLD + 5)
    scenarios.append(
        run_scenario(
            flow_rate, temp_in, optimized_out,
            fuel_type, fuel_cost, operating_hours,
            installation_cost * 1.25,  # 25% higher capex for premium HX
            label="Optimized Case",
        )
    )

    return scenarios


def project_roi_5yr(annual_savings: float, installation_cost: float) -> List[float]:
    """
    Cumulative ROI over 5 years as a list of annual values (%).

    ROI_n = ((savings × n − cost) / cost) × 100
    """
    roi = []
    for year in range(1, 6):
        cumulative_savings = annual_savings * year
        roi_pct = ((cumulative_savings - installation_cost) / installation_cost) * 100.0
        roi.append(round(roi_pct, 2))
    return roi


def calculate_climate_equivalence(co2_tons_annual: float) -> dict:
    """
    Convert annual CO₂ reduction to tangible equivalences over 5 years.

    References (EPA):
      - 1 mature tree absorbs ~0.022 tons CO₂/year
      - 1 passenger car emits ~4.6 tons CO₂/year
    """
    total_5yr = co2_tons_annual * 5
    trees = int(total_5yr / 0.022) if co2_tons_annual > 0 else 0
    cars = int(total_5yr / 4.6) if co2_tons_annual > 0 else 0

    return {
        "total_co2_avoided_tons": round(total_5yr, 2),
        "equivalent_trees_planted": trees,
        "equivalent_cars_removed": cars,
    }
