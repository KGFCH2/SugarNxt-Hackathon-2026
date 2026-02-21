"""
Pydantic schemas for request / response validation.
All engineering units are documented in field descriptions.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class FuelType(str, Enum):
    COAL = "Coal"
    NATURAL_GAS = "Natural Gas"
    BAGASSE = "Bagasse"
    FUEL_OIL = "Fuel Oil"
    BIOMASS = "Biomass"


class AnalysisRequest(BaseModel):
    """Input payload for the /analyze endpoint."""

    flue_temp_in: float = Field(
        ..., gt=50, lt=800,
        description="Flue gas inlet temperature (°C)"
    )
    flue_temp_out: float = Field(
        ..., gt=30, lt=600,
        description="Flue gas outlet temperature (°C)"
    )
    flow_rate: float = Field(
        ..., gt=0, lt=500000,
        description="Flue gas mass flow rate (kg/hr)"
    )
    fuel_type: FuelType = Field(
        ..., description="Type of fuel used in the boiler"
    )
    fuel_cost: float = Field(
        ..., gt=0, lt=1000,
        description="Fuel cost ($/kg or $/m³)"
    )
    operating_hours: float = Field(
        ..., gt=0, le=8760,
        description="Annual operating hours"
    )
    installation_cost: float = Field(
        ..., gt=0,
        description="Estimated installation cost ($)"
    )
    steam_demand: Optional[float] = Field(
        default=5000,
        gt=0,
        description="Current steam demand (kg/hr)"
    )


class ScenarioResult(BaseModel):
    """Result for a single scenario."""

    label: str
    heat_recovered_kW: float
    steam_saved_kg_hr: float
    annual_savings: float
    payback_years: float
    co2_reduction_tons: float
    efficiency_gain_pct: float


class Recommendation(BaseModel):
    """Intelligent recommendation output."""

    heat_exchanger_type: str
    optimal_exit_temp: float
    efficiency_improvement: str
    dew_point_warning: bool
    warning_message: Optional[str] = None


class ClimateImpact(BaseModel):
    """5-year projected climate impact."""

    total_co2_avoided_tons: float
    equivalent_trees_planted: int
    equivalent_cars_removed: int


class AnalysisResponse(BaseModel):
    """Complete response from the /analyze endpoint."""

    # Core metrics
    heat_recovered_kW: float
    steam_saved_kg_hr: float
    annual_savings: float
    payback_years: float
    co2_reduction_tons: float
    efficiency_gain_pct: float

    # Multi-scenario
    scenarios: List[ScenarioResult]

    # Recommendation engine
    recommendation: Recommendation

    # Climate impact
    climate_impact: ClimateImpact

    # AI insight
    ai_summary: str

    # ROI projection
    roi_5yr: List[float]

    # Energy breakdown
    energy_recovered_pct: float
    energy_lost_pct: float


class ChatRequest(BaseModel):
    """Payload for the /chat endpoint."""
    message: str


class ChatResponse(BaseModel):
    """Response from the /chat endpoint."""
    response: str
