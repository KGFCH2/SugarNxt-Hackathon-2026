"""
Core thermodynamic calculation engine.

All formulas are based on standard industrial engineering references:
  Q = m * Cp * DeltaT   (kJ/hr → kW)
  Steam saved = Q / latent_heat_of_steam
  CO2 reduction via emission factors per fuel type
"""

from typing import Dict

# Specific heat of flue gas (kJ/kg·K) – standard approximation
CP_FLUE_GAS = 1.0

# Latent heat of steam vaporisation (kJ/kg) at ~100 °C
LATENT_HEAT_STEAM = 2257.0

# CO₂ emission factors (kg CO₂ per kg fuel burned)
EMISSION_FACTORS: Dict[str, float] = {
    "Coal": 2.40,
    "Natural Gas": 2.75,
    "Bagasse": 0.0,
    "Fuel Oil": 3.15,
    "Biomass": 0.10,
}

# Dew-point threshold for acid-gas condensation (°C)
DEW_POINT_THRESHOLD = 120.0


def calculate_heat_recovered(
    flow_rate_kg_hr: float,
    temp_in: float,
    temp_out: float,
) -> float:
    """
    Calculate recoverable heat in kW.

    Q (kJ/hr) = flow_rate × Cp × (T_in − T_out)
    Q (kW)    = Q (kJ/hr) / 3600
    """
    delta_t = temp_in - temp_out
    q_kj_hr = flow_rate_kg_hr * CP_FLUE_GAS * delta_t
    q_kw = q_kj_hr / 3600.0
    return round(q_kw, 2)


def calculate_steam_saved(heat_kw: float) -> float:
    """
    Steam that can be generated from recovered heat (kg/hr).

    steam_saved = Q (kJ/hr) / latent_heat
    Q (kJ/hr) = heat_kw × 3600
    """
    q_kj_hr = heat_kw * 3600.0
    steam = q_kj_hr / LATENT_HEAT_STEAM
    return round(steam, 2)


def calculate_annual_savings(
    steam_saved_kg_hr: float,
    operating_hours: float,
    fuel_cost: float,
) -> float:
    """Annual monetary savings ($)."""
    return round(steam_saved_kg_hr * operating_hours * fuel_cost, 2)


def calculate_payback(
    installation_cost: float,
    annual_savings: float,
) -> float:
    """Simple payback period in years."""
    if annual_savings <= 0:
        return 999.0
    return round(installation_cost / annual_savings, 2)


def calculate_co2_reduction(
    steam_saved_kg_hr: float,
    operating_hours: float,
    fuel_type: str,
) -> float:
    """
    Annual CO₂ reduction in metric tons.

    co2 = steam_saved × hours × emission_factor / 1000
    """
    factor = EMISSION_FACTORS.get(fuel_type, 0.0)
    co2_kg = steam_saved_kg_hr * operating_hours * factor
    return round(co2_kg / 1000.0, 2)


def calculate_efficiency_gain(
    heat_recovered_kw: float,
    flow_rate_kg_hr: float,
    temp_in: float,
) -> float:
    """
    Efficiency improvement as a percentage.

    total_heat_input (kW) = flow_rate × Cp × T_in / 3600
    gain = (recovered / total_input) × 100
    """
    total_input_kw = (flow_rate_kg_hr * CP_FLUE_GAS * temp_in) / 3600.0
    if total_input_kw <= 0:
        return 0.0
    return round((heat_recovered_kw / total_input_kw) * 100.0, 2)


def check_dew_point(temp_out: float) -> tuple[bool, str]:
    """Return (warning_flag, message) if outlet temp is below acid dew point."""
    if temp_out < DEW_POINT_THRESHOLD:
        return (
            True,
            f"⚠️ Outlet temperature ({temp_out}°C) is below the acid dew point "
            f"({DEW_POINT_THRESHOLD}°C). Risk of sulphuric acid condensation and "
            "heat-exchanger corrosion. Consider raising exit temperature or "
            "using corrosion-resistant materials.",
        )
    return (False, "")


def run_scenario(
    flow_rate: float,
    temp_in: float,
    temp_out: float,
    fuel_type: str,
    fuel_cost: float,
    operating_hours: float,
    installation_cost: float,
    label: str = "Base Case",
) -> dict:
    """Run a full calculation pass and return a results dict."""
    heat = calculate_heat_recovered(flow_rate, temp_in, temp_out)
    steam = calculate_steam_saved(heat)
    savings = calculate_annual_savings(steam, operating_hours, fuel_cost)
    payback = calculate_payback(installation_cost, savings)
    co2 = calculate_co2_reduction(steam, operating_hours, fuel_type)
    eff = calculate_efficiency_gain(heat, flow_rate, temp_in)

    return {
        "label": label,
        "heat_recovered_kW": heat,
        "steam_saved_kg_hr": steam,
        "annual_savings": savings,
        "payback_years": payback,
        "co2_reduction_tons": co2,
        "efficiency_gain_pct": eff,
    }
