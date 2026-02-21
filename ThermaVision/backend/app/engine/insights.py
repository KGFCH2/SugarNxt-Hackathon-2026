"""
AI Insight Generator — produces executive-ready engineering summaries.

No LLM required; uses template-based generation with contextual logic
to produce professional, technical language.
"""


def generate_ai_summary(
    heat_kw: float,
    steam_saved: float,
    annual_savings: float,
    payback_years: float,
    co2_tons: float,
    efficiency_pct: float,
    fuel_type: str,
    recommendation: str,
    dew_point_warning: bool,
) -> str:
    """
    Generate a professional executive insight paragraph.

    The tone is technical, confident, and boardroom-ready.
    """
    # Savings magnitude classification
    if annual_savings > 1_000_000:
        savings_adj = "substantial"
    elif annual_savings > 500_000:
        savings_adj = "significant"
    elif annual_savings > 100_000:
        savings_adj = "considerable"
    else:
        savings_adj = "meaningful"

    # Payback assessment
    if payback_years < 1:
        payback_desc = f"an exceptionally rapid payback of {payback_years:.1f} years"
    elif payback_years < 2:
        payback_desc = f"a highly attractive payback of {payback_years:.1f} years"
    elif payback_years < 3:
        payback_desc = f"a strong payback of {payback_years:.1f} years"
    elif payback_years < 5:
        payback_desc = f"an acceptable payback of {payback_years:.1f} years"
    else:
        payback_desc = f"a payback of {payback_years:.1f} years, which indicates further optimization may be required"

    # CO₂ narrative
    if co2_tons > 1000:
        co2_desc = f"eliminating approximately {co2_tons:,.0f} metric tons of CO₂ annually — equivalent to removing hundreds of vehicles from the road"
    elif co2_tons > 100:
        co2_desc = f"preventing approximately {co2_tons:,.0f} metric tons of CO₂ emissions annually"
    elif co2_tons > 0:
        co2_desc = f"reducing CO₂ emissions by {co2_tons:,.1f} metric tons per year"
    else:
        co2_desc = "utilizing carbon-neutral fuel with no direct fossil CO₂ emissions"

    # Dew point note
    dew_note = ""
    if dew_point_warning:
        dew_note = (
            " However, the proposed outlet temperature operates near the acid dew point; "
            "corrosion-resistant materials or a slightly elevated exit temperature "
            "is recommended to safeguard equipment longevity."
        )

    summary = (
        f"Based on the thermodynamic analysis, this {fuel_type.lower()}-fired system can recover "
        f"approximately {heat_kw:,.1f} kW of thermal energy from the flue gas stream, "
        f"generating an additional {steam_saved:,.1f} kg/hr of steam. "
        f"This translates to {savings_adj} annual fuel savings of ${annual_savings:,.0f}, "
        f"yielding {payback_desc}. "
        f"From an environmental perspective, the installation would be {co2_desc}. "
        f"The recommended heat recovery equipment is a {recommendation}, "
        f"delivering an estimated {efficiency_pct:.1f}% improvement in overall thermal efficiency."
        f"{dew_note}"
    )

    return summary
