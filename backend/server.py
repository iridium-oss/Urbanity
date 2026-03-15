from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import Optional
from pydantic import BaseModel
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Urbanivity API", version="1.0.0")
api_router = APIRouter(prefix="/api")

# ============================================================
# AUTH MODELS
# ============================================================

class LoginRequest(BaseModel):
    name: str
    email: str
    role: str

USER_ROLES = [
    {"id": "executive", "name": "Executive / Jury", "description": "Strategic overview with strongest proof points and visual summaries", "icon": "Crown", "color": "#f59e0b"},
    {"id": "b2g", "name": "B2G / Public Sector", "description": "Resilience, equity, public transport access, source transparency, and planning support", "icon": "Building2", "color": "#3b82f6"},
    {"id": "b2b", "name": "B2B / Operator", "description": "Operational dashboard, provider health, route insight, alert management", "icon": "Server", "color": "#8b5cf6"},
    {"id": "b2c", "name": "B2C / Rider", "description": "Trip planning, route clarity, service alerts, accessibility-aware navigation", "icon": "Smartphone", "color": "#10b981"},
    {"id": "technical", "name": "Technical / System", "description": "Providers, provenance, forecast status, API readiness, system health", "icon": "Code", "color": "#ef4444"},
]

@api_router.get("/auth/roles")
async def get_user_roles():
    return USER_ROLES

@api_router.post("/auth/login")
async def login(req: LoginRequest):
    if not req.name or not req.email or not req.role:
        return {"error": "Name, email, and role are required"}
    role_info = next((r for r in USER_ROLES if r["id"] == req.role), USER_ROLES[0])
    user = {
        "id": str(uuid.uuid4()),
        "name": req.name,
        "email": req.email,
        "role": req.role,
        "role_name": role_info["name"],
        "logged_in_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.sessions.insert_one({**user, "_id": user["id"]})
    return {k: v for k, v in user.items() if k != "_id"}

# ============================================================
# DEMO DATA - Baku Mobility Intelligence
# ============================================================

MOBILITY_MODES = [
    {"id": "walking", "name": "Walking", "icon": "Footprints", "category": "active", "status": "active", "provenance": "official", "description": "Pedestrian routing with sidewalk and crossing data", "color": "#10b981"},
    {"id": "wheelchair", "name": "Wheelchair", "icon": "Accessibility", "category": "active", "status": "active", "provenance": "official", "description": "Wheelchair-accessible routing with ramp and elevator data", "color": "#8b5cf6"},
    {"id": "bicycle", "name": "Bicycle", "icon": "Bike", "category": "active", "status": "limited", "provenance": "public_web_observed", "description": "Cycling routes with lane availability", "color": "#06b6d4"},
    {"id": "e_bike", "name": "E-Bike", "icon": "Zap", "category": "active", "status": "emerging", "provenance": "configuration_required", "description": "Electric bicycle routing and charging stations", "color": "#14b8a6"},
    {"id": "scooter", "name": "Scooter", "icon": "CircleDot", "category": "micro", "status": "limited", "provenance": "public_undocumented", "description": "Personal scooter routing", "color": "#f59e0b"},
    {"id": "e_scooter", "name": "E-Scooter", "icon": "Zap", "category": "micro", "status": "emerging", "provenance": "configuration_required", "description": "Shared e-scooter availability and routing", "color": "#eab308"},
    {"id": "private_car", "name": "Private Car", "icon": "Car", "category": "vehicle", "status": "active", "provenance": "public_web_observed", "description": "Road network routing with traffic context", "color": "#64748b"},
    {"id": "taxi", "name": "Taxi / Ride-hailing", "icon": "Navigation", "category": "vehicle", "status": "active", "provenance": "licensed_partner", "description": "Taxi and ride-hailing with estimated pricing", "color": "#f97316"},
    {"id": "metro", "name": "Metro", "icon": "Train", "category": "transit", "status": "active", "provenance": "official", "description": "Baku Metro with 3 lines and 27 stations", "color": "#ef4444"},
    {"id": "bus", "name": "Bus", "icon": "Bus", "category": "transit", "status": "active", "provenance": "official", "description": "BakuBus network with 85+ routes", "color": "#3b82f6"},
    {"id": "minibus", "name": "Minibus", "icon": "Truck", "category": "transit", "status": "active", "provenance": "public_undocumented", "description": "Informal minibus routes with observed schedules", "color": "#a855f7"},
    {"id": "shuttle", "name": "Shuttle", "icon": "Bus", "category": "transit", "status": "limited", "provenance": "configuration_required", "description": "Corporate and event shuttle services", "color": "#ec4899"},
    {"id": "park_and_ride", "name": "Transfer / Multimodal", "icon": "Repeat", "category": "transfer", "status": "active", "provenance": "official", "description": "Transfer-based multimodal journeys combining metro, bus, walking, and other modes", "color": "#6366f1"},
    {"id": "shared_mobility", "name": "Future Shared Mobility", "icon": "Users", "category": "emerging", "status": "planned", "provenance": "configuration_required", "description": "Future shared mobility services including carpooling and on-demand transit", "color": "#0ea5e9"},
]

PROVIDERS = [
    {"id": "baku_metro", "name": "Baku Metropolitan (BMA)", "type": "Transit Authority", "provenance": "official", "modes": ["metro"], "coverage": "3 lines, 27 stations", "last_updated": "2026-03-15T10:30:00Z", "reliability": 0.94, "description": "Official schedule and station data from Baku Metro", "endpoints": 4, "freshness_hours": 24},
    {"id": "baku_bus", "name": "BakuBus LLC", "type": "Transit Operator", "provenance": "official", "modes": ["bus"], "coverage": "85 routes, 1200+ stops", "last_updated": "2026-03-14T16:00:00Z", "reliability": 0.89, "description": "Official GTFS feed from BakuBus operator", "endpoints": 6, "freshness_hours": 12},
    {"id": "bna", "name": "Baku Transport Agency (BNA)", "type": "Regulatory Authority", "provenance": "official_alerts_only", "modes": ["bus", "metro", "minibus"], "coverage": "All public transport", "last_updated": "2026-03-13T08:00:00Z", "reliability": 0.92, "description": "Service alerts and regulatory notices", "endpoints": 2, "freshness_hours": 48},
    {"id": "bolt_az", "name": "Bolt Azerbaijan", "type": "Ride-hailing", "provenance": "licensed_partner", "modes": ["taxi"], "coverage": "Baku metropolitan", "last_updated": "2026-03-15T12:00:00Z", "reliability": 0.91, "description": "Licensed API for ETA and availability", "endpoints": 3, "freshness_hours": 1},
    {"id": "uber_baku", "name": "Uber Baku", "type": "Ride-hailing", "provenance": "licensed_partner", "modes": ["taxi"], "coverage": "Baku city center", "last_updated": "2026-03-15T11:45:00Z", "reliability": 0.88, "description": "Licensed partner integration for ride estimates", "endpoints": 3, "freshness_hours": 1},
    {"id": "google_traffic", "name": "Google Maps Traffic", "type": "Traffic Data", "provenance": "public_web_observed", "modes": ["private_car", "walking", "bicycle"], "coverage": "Baku road network", "last_updated": "2026-03-15T12:15:00Z", "reliability": 0.85, "description": "Publicly observed traffic conditions", "endpoints": 2, "freshness_hours": 0.5},
    {"id": "yandex_maps", "name": "Yandex Maps", "type": "Navigation", "provenance": "public_web_observed", "modes": ["private_car", "walking"], "coverage": "Azerbaijan nationwide", "last_updated": "2026-03-15T12:10:00Z", "reliability": 0.83, "description": "Publicly observed navigation data", "endpoints": 2, "freshness_hours": 0.5},
    {"id": "osm_baku", "name": "OpenStreetMap Baku", "type": "Community Map", "provenance": "public_web_observed", "modes": ["walking", "bicycle", "wheelchair"], "coverage": "Baku full city", "last_updated": "2026-03-10T00:00:00Z", "reliability": 0.78, "description": "Community map data for pedestrian infrastructure", "endpoints": 1, "freshness_hours": 168},
    {"id": "baku_taxi_obs", "name": "Baku Street Taxis", "type": "Observed", "provenance": "public_undocumented", "modes": ["taxi"], "coverage": "Major intersections", "last_updated": "2026-03-14T09:00:00Z", "reliability": 0.55, "description": "Observed taxi availability at major stands", "endpoints": 0, "freshness_hours": 72},
    {"id": "minibus_obs", "name": "Minibus Routes Network", "type": "Observed", "provenance": "public_undocumented", "modes": ["minibus"], "coverage": "65+ observed routes", "last_updated": "2026-03-12T14:00:00Z", "reliability": 0.60, "description": "Community-observed minibus routes", "endpoints": 0, "freshness_hours": 120},
    {"id": "citybike_baku", "name": "CityBike Baku", "type": "Bike Share", "provenance": "configuration_required", "modes": ["bicycle"], "coverage": "Central Baku", "last_updated": None, "reliability": None, "description": "Pending API configuration", "endpoints": 0, "freshness_hours": None},
    {"id": "e_scooter_baku", "name": "E-Scooter Operators", "type": "Micro-mobility", "provenance": "configuration_required", "modes": ["e_scooter"], "coverage": "TBD", "last_updated": None, "reliability": None, "description": "Awaiting partnership agreements", "endpoints": 0, "freshness_hours": None},
    {"id": "sentinel_eo", "name": "Copernicus Sentinel-2", "type": "Earth Observation", "provenance": "official", "modes": [], "coverage": "Baku metro area (10m)", "last_updated": "2026-03-13T09:30:00Z", "reliability": 0.97, "description": "ESA satellite imagery for urban context", "endpoints": 1, "freshness_hours": 120},
]

ALERTS = [
    {"id": "alert_001", "title": "Red Line Service Reduced", "severity": "warning", "type": "service_change", "source": "baku_metro", "provenance": "official", "mode": "metro", "description": "Reduced frequency on Red Line due to maintenance between Ulduz and Koroglu. Trains every 8 min instead of 4.", "affected_area": "Ulduz to Koroglu", "start_time": "2026-03-15T06:00:00Z", "end_time": "2026-03-15T22:00:00Z", "status": "active"},
    {"id": "alert_002", "title": "Route 65 Temporary Diversion", "severity": "info", "type": "route_change", "source": "baku_bus", "provenance": "official", "mode": "bus", "description": "Route 65 diverted via Nizami Street due to road works. Three stops temporarily relocated.", "affected_area": "Nizami district", "start_time": "2026-03-14T00:00:00Z", "end_time": "2026-03-20T23:59:00Z", "status": "active"},
    {"id": "alert_003", "title": "Elevated Congestion Near 28 May", "severity": "warning", "type": "congestion", "source": "google_traffic", "provenance": "public_web_observed", "mode": "private_car", "description": "Congestion levels 40% above average near 28 May intersection during evening hours.", "affected_area": "28 May area", "start_time": "2026-03-15T16:00:00Z", "end_time": "2026-03-15T20:00:00Z", "status": "active"},
    {"id": "alert_004", "title": "Green Line Signal Issue Resolved", "severity": "resolved", "type": "incident", "source": "baku_metro", "provenance": "official", "mode": "metro", "description": "Signal malfunction at Khatai station resolved. Normal service resumed.", "affected_area": "Khatai station", "start_time": "2026-03-14T14:00:00Z", "end_time": "2026-03-14T16:30:00Z", "status": "resolved"},
    {"id": "alert_005", "title": "Wheelchair Ramp Maintenance at Sahil", "severity": "info", "type": "accessibility", "source": "baku_metro", "provenance": "official", "mode": "wheelchair", "description": "Elevator at Sahil station entrance B under maintenance. Use entrance A.", "affected_area": "Sahil station", "start_time": "2026-03-15T09:00:00Z", "end_time": "2026-03-17T18:00:00Z", "status": "active"},
    {"id": "alert_006", "title": "Minibus Route 145 Schedule Change", "severity": "info", "type": "schedule", "source": "minibus_obs", "provenance": "public_undocumented", "mode": "minibus", "description": "Observed frequency reduction on Route 145 during midday hours.", "affected_area": "Binagadi to Nasimi", "start_time": "2026-03-13T10:00:00Z", "end_time": None, "status": "active"},
    {"id": "alert_007", "title": "Boulevard Cycle Path Partially Blocked", "severity": "warning", "type": "obstruction", "source": "osm_baku", "provenance": "public_web_observed", "mode": "bicycle", "description": "Construction debris partially blocking Boulevard cycle path near Flag Square. Cyclists advised to dismount for 50m section.", "affected_area": "Boulevard near Flag Square", "start_time": "2026-03-14T08:00:00Z", "end_time": "2026-03-18T18:00:00Z", "status": "active"},
    {"id": "alert_008", "title": "E-Scooter Speed Limit Zone Expanded", "severity": "info", "type": "regulation", "source": "bna", "provenance": "official_alerts_only", "mode": "e_scooter", "description": "Speed limit zone for e-scooters expanded to include Fountain Square pedestrian area. Max 5 km/h in zone.", "affected_area": "Fountain Square", "start_time": "2026-03-10T00:00:00Z", "end_time": None, "status": "active"},
    {"id": "alert_009", "title": "Taxi Surge Pricing Active Near Stadium", "severity": "info", "type": "pricing", "source": "bolt_az", "provenance": "licensed_partner", "mode": "taxi", "description": "Event-related surge pricing active near Baku Olympic Stadium. Estimated 1.5x normal fare.", "affected_area": "Olympic Stadium area", "start_time": "2026-03-15T17:00:00Z", "end_time": "2026-03-15T23:00:00Z", "status": "active"},
    {"id": "alert_010", "title": "Heydar Aliyev Ave Congestion High", "severity": "warning", "type": "congestion", "source": "yandex_maps", "provenance": "public_web_observed", "mode": "private_car", "description": "Heavy congestion on Heydar Aliyev Avenue southbound. Estimated 25 min delay. Consider metro alternative.", "affected_area": "Heydar Aliyev Ave", "start_time": "2026-03-15T17:30:00Z", "end_time": "2026-03-15T20:00:00Z", "status": "active"},
    {"id": "alert_011", "title": "Airport Shuttle Delayed", "severity": "warning", "type": "delay", "source": "bna", "provenance": "official_alerts_only", "mode": "shuttle", "description": "Airport Express shuttle running 15 min behind schedule due to traffic on airport road.", "affected_area": "Airport Road", "start_time": "2026-03-15T14:00:00Z", "end_time": "2026-03-15T18:00:00Z", "status": "active"},
    {"id": "alert_012", "title": "New Pedestrian Crossing at Nizami", "severity": "info", "type": "improvement", "source": "bna", "provenance": "official_alerts_only", "mode": "walking", "description": "New signalized pedestrian crossing installed at Nizami Street and Istiglaliyyat junction. Improved safety for pedestrians.", "affected_area": "Nizami / Istiglaliyyat", "start_time": "2026-03-12T00:00:00Z", "end_time": None, "status": "active"},
]

DISTRICTS = [
    {"id": "nasimi", "name": "Nasimi", "population": 212000, "area_km2": 10.3, "metro_stations": 5, "bus_routes": 22, "wheelchair_accessible_stops": 18, "avg_transit_time_min": 24, "mobility_score": 82, "equity_index": 0.78, "green_space_pct": 12.5, "lat": 40.4150, "lng": 49.8700},
    {"id": "yasamal", "name": "Yasamal", "population": 238000, "area_km2": 13.8, "metro_stations": 4, "bus_routes": 18, "wheelchair_accessible_stops": 12, "avg_transit_time_min": 28, "mobility_score": 74, "equity_index": 0.71, "green_space_pct": 8.2, "lat": 40.3950, "lng": 49.8350},
    {"id": "sabail", "name": "Sabail", "population": 96000, "area_km2": 28.1, "metro_stations": 3, "bus_routes": 15, "wheelchair_accessible_stops": 22, "avg_transit_time_min": 22, "mobility_score": 88, "equity_index": 0.85, "green_space_pct": 18.7, "lat": 40.3660, "lng": 49.8370},
    {"id": "nizami", "name": "Nizami", "population": 178000, "area_km2": 7.6, "metro_stations": 2, "bus_routes": 20, "wheelchair_accessible_stops": 14, "avg_transit_time_min": 26, "mobility_score": 76, "equity_index": 0.73, "green_space_pct": 9.1, "lat": 40.4200, "lng": 49.8500},
    {"id": "khatai", "name": "Khatai", "population": 275000, "area_km2": 25.4, "metro_stations": 3, "bus_routes": 24, "wheelchair_accessible_stops": 10, "avg_transit_time_min": 32, "mobility_score": 68, "equity_index": 0.64, "green_space_pct": 6.8, "lat": 40.4100, "lng": 49.9050},
    {"id": "surakhani", "name": "Surakhani", "population": 215000, "area_km2": 65.2, "metro_stations": 2, "bus_routes": 14, "wheelchair_accessible_stops": 6, "avg_transit_time_min": 42, "mobility_score": 48, "equity_index": 0.45, "green_space_pct": 4.2, "lat": 40.4300, "lng": 50.0100},
    {"id": "binagadi", "name": "Binagadi", "population": 265000, "area_km2": 22.7, "metro_stations": 2, "bus_routes": 16, "wheelchair_accessible_stops": 8, "avg_transit_time_min": 35, "mobility_score": 58, "equity_index": 0.55, "green_space_pct": 5.5, "lat": 40.4550, "lng": 49.8600},
    {"id": "narimanov", "name": "Narimanov", "population": 192000, "area_km2": 11.5, "metro_stations": 3, "bus_routes": 19, "wheelchair_accessible_stops": 16, "avg_transit_time_min": 25, "mobility_score": 79, "equity_index": 0.76, "green_space_pct": 11.3, "lat": 40.4250, "lng": 49.8800},
    {"id": "sabunchu", "name": "Sabunchu", "population": 215000, "area_km2": 42.3, "metro_stations": 1, "bus_routes": 12, "wheelchair_accessible_stops": 4, "avg_transit_time_min": 45, "mobility_score": 42, "equity_index": 0.40, "green_space_pct": 3.8, "lat": 40.4500, "lng": 49.9500},
    {"id": "qaradag", "name": "Qaradag", "population": 115000, "area_km2": 86.5, "metro_stations": 0, "bus_routes": 8, "wheelchair_accessible_stops": 2, "avg_transit_time_min": 55, "mobility_score": 28, "equity_index": 0.25, "green_space_pct": 2.1, "lat": 40.3400, "lng": 49.9800},
    {"id": "pirallahi", "name": "Pirallahi", "population": 22000, "area_km2": 15.8, "metro_stations": 0, "bus_routes": 3, "wheelchair_accessible_stops": 0, "avg_transit_time_min": 65, "mobility_score": 15, "equity_index": 0.12, "green_space_pct": 1.5, "lat": 40.4900, "lng": 50.1200},
    {"id": "khazar", "name": "Khazar", "population": 188000, "area_km2": 35.6, "metro_stations": 1, "bus_routes": 10, "wheelchair_accessible_stops": 5, "avg_transit_time_min": 40, "mobility_score": 52, "equity_index": 0.48, "green_space_pct": 7.2, "lat": 40.4800, "lng": 50.0600},
]

TRANSIT_LINES = [
    # Metro
    {"id": "metro_red", "name": "Red Line", "mode": "metro", "color": "#ef4444", "stations": 12, "length_km": 19.3, "frequency_min": 4, "hours": "06:00-00:00", "provenance": "official", "status": "active", "fare_azn": 0.60, "coords": [[40.3762, 49.8524], [40.3830, 49.8535], [40.3892, 49.8619], [40.3954, 49.8685], [40.4010, 49.8670], [40.4093, 49.8671], [40.4145, 49.8698], [40.4195, 49.8755], [40.4265, 49.8802], [40.4312, 49.8845], [40.4380, 49.8912], [40.4435, 49.8960]]},
    {"id": "metro_green", "name": "Green Line", "mode": "metro", "color": "#22c55e", "stations": 8, "length_km": 11.2, "frequency_min": 5, "hours": "06:00-00:00", "provenance": "official", "status": "active", "fare_azn": 0.60, "coords": [[40.4093, 49.8671], [40.4120, 49.8750], [40.4155, 49.8820], [40.4180, 49.8900], [40.4210, 49.8960], [40.4230, 49.9030], [40.4250, 49.9100], [40.4280, 49.9180]]},
    {"id": "metro_purple", "name": "Purple Line (Planned)", "mode": "metro", "color": "#a855f7", "stations": 5, "length_km": 7.8, "frequency_min": 6, "hours": "06:00-00:00", "provenance": "official", "status": "planned", "fare_azn": 0.60, "coords": [[40.4093, 49.8671], [40.4050, 49.8580], [40.4020, 49.8500], [40.3990, 49.8420], [40.3960, 49.8340]]},
    # Bus Routes
    {"id": "bus_18", "name": "Route 18", "mode": "bus", "color": "#3b82f6", "stations": 22, "length_km": 14.5, "frequency_min": 8, "hours": "06:00-23:00", "provenance": "official", "status": "active", "fare_azn": 0.60, "coords": [[40.3780, 49.8490], [40.3830, 49.8530], [40.3890, 49.8580], [40.3950, 49.8640], [40.4020, 49.8670], [40.4070, 49.8690], [40.4120, 49.8720], [40.4180, 49.8770], [40.4230, 49.8810], [40.4280, 49.8860]]},
    {"id": "bus_65", "name": "Route 65", "mode": "bus", "color": "#2563eb", "stations": 18, "length_km": 11.8, "frequency_min": 10, "hours": "06:00-22:30", "provenance": "official", "status": "active", "fare_azn": 0.60, "coords": [[40.4093, 49.8671], [40.4130, 49.8630], [40.4170, 49.8590], [40.4200, 49.8550], [40.4240, 49.8510], [40.4270, 49.8480], [40.4300, 49.8460], [40.4340, 49.8440]]},
    {"id": "bus_125", "name": "Route 125", "mode": "bus", "color": "#1d4ed8", "stations": 25, "length_km": 18.2, "frequency_min": 12, "hours": "06:30-22:00", "provenance": "official", "status": "active", "fare_azn": 0.60, "coords": [[40.3700, 49.8400], [40.3760, 49.8480], [40.3830, 49.8550], [40.3920, 49.8620], [40.4010, 49.8680], [40.4100, 49.8750], [40.4200, 49.8830], [40.4300, 49.8920], [40.4400, 49.9010]]},
    {"id": "bus_210", "name": "Route 210", "mode": "bus", "color": "#60a5fa", "stations": 15, "length_km": 9.4, "frequency_min": 15, "hours": "07:00-21:00", "provenance": "official", "status": "active", "fare_azn": 0.60, "coords": [[40.4250, 49.8800], [40.4300, 49.8750], [40.4350, 49.8700], [40.4400, 49.8650], [40.4450, 49.8600], [40.4500, 49.8570]]},
    # Minibus Routes
    {"id": "minibus_145", "name": "Minibus 145", "mode": "minibus", "color": "#a855f7", "stations": 14, "length_km": 12.3, "frequency_min": 5, "hours": "06:00-23:30", "provenance": "public_undocumented", "status": "active", "fare_azn": 0.40, "coords": [[40.4550, 49.8600], [40.4480, 49.8620], [40.4400, 49.8650], [40.4320, 49.8680], [40.4250, 49.8700], [40.4180, 49.8710], [40.4100, 49.8700]]},
    {"id": "minibus_77", "name": "Minibus 77", "mode": "minibus", "color": "#c084fc", "stations": 11, "length_km": 8.7, "frequency_min": 7, "hours": "06:30-22:00", "provenance": "public_undocumented", "status": "active", "fare_azn": 0.40, "coords": [[40.4100, 49.9050], [40.4080, 49.8980], [40.4050, 49.8900], [40.4010, 49.8820], [40.3970, 49.8740], [40.3930, 49.8660], [40.3880, 49.8580]]},
    {"id": "minibus_202", "name": "Minibus 202", "mode": "minibus", "color": "#9333ea", "stations": 16, "length_km": 10.1, "frequency_min": 6, "hours": "06:00-22:30", "provenance": "public_undocumented", "status": "active", "fare_azn": 0.40, "coords": [[40.3950, 49.8350], [40.3990, 49.8430], [40.4030, 49.8510], [40.4070, 49.8590], [40.4110, 49.8670], [40.4160, 49.8740], [40.4210, 49.8810]]},
    # Bicycle
    {"id": "bike_boulevard", "name": "Boulevard Cycle Path", "mode": "bicycle", "color": "#06b6d4", "stations": 8, "length_km": 6.2, "frequency_min": 0, "hours": "24/7", "provenance": "public_web_observed", "status": "active", "fare_azn": 0, "coords": [[40.3590, 49.8350], [40.3640, 49.8400], [40.3690, 49.8460], [40.3740, 49.8520], [40.3790, 49.8570], [40.3840, 49.8610], [40.3890, 49.8640]]},
    {"id": "bike_white_city", "name": "White City Cycle Lane", "mode": "bicycle", "color": "#22d3ee", "stations": 5, "length_km": 3.8, "frequency_min": 0, "hours": "24/7", "provenance": "public_web_observed", "status": "active", "fare_azn": 0, "coords": [[40.3920, 49.8850], [40.3960, 49.8880], [40.4000, 49.8910], [40.4040, 49.8940], [40.4080, 49.8970]]},
    # Shuttle
    {"id": "shuttle_airport", "name": "Airport Express Shuttle", "mode": "shuttle", "color": "#ec4899", "stations": 4, "length_km": 25.0, "frequency_min": 30, "hours": "05:00-01:00", "provenance": "configuration_required", "status": "limited", "fare_azn": 1.50, "coords": [[40.4093, 49.8671], [40.4200, 49.8900], [40.4400, 49.9200], [40.4675, 50.0467]]},
]

# Mode-specific details for each mobility type
MODE_DETAILS = {
    "walking": {
        "routes_available": 850, "avg_speed_kmh": 5, "coverage_km": 420,
        "infrastructure": {"sidewalks_km": 380, "pedestrian_zones": 12, "crossings_signalized": 245, "lighting_coverage_pct": 72},
        "popular_routes": [
            {"name": "Boulevard Promenade", "distance_m": 3200, "time_min": 38, "rating": 4.8},
            {"name": "Old City Walking Tour", "distance_m": 2100, "time_min": 25, "rating": 4.9},
            {"name": "Fountain Square to 28 May", "distance_m": 800, "time_min": 10, "rating": 4.5},
        ],
    },
    "wheelchair": {
        "routes_available": 320, "avg_speed_kmh": 4, "coverage_km": 180,
        "infrastructure": {"accessible_stops": 117, "ramps_total": 340, "elevators_metro": 18, "tactile_paving_km": 45},
        "popular_routes": [
            {"name": "Sahil to Fountain Square (Accessible)", "distance_m": 1500, "time_min": 22, "rating": 4.2},
            {"name": "Boulevard Accessible Path", "distance_m": 2800, "time_min": 42, "rating": 4.6},
            {"name": "28 May to Nizami (Ramp Route)", "distance_m": 900, "time_min": 14, "rating": 4.0},
        ],
    },
    "bicycle": {
        "routes_available": 45, "avg_speed_kmh": 15, "coverage_km": 62,
        "infrastructure": {"bike_lanes_km": 28, "bike_racks": 85, "repair_stations": 6, "share_stations": 12},
        "popular_routes": [
            {"name": "Boulevard Cycle Path", "distance_m": 6200, "time_min": 25, "rating": 4.7},
            {"name": "White City Loop", "distance_m": 3800, "time_min": 15, "rating": 4.3},
            {"name": "Seaside Park Circuit", "distance_m": 4500, "time_min": 18, "rating": 4.5},
        ],
    },
    "e_bike": {
        "routes_available": 38, "avg_speed_kmh": 25, "coverage_km": 55,
        "infrastructure": {"charging_stations": 8, "allowed_lanes_km": 42, "max_speed_kmh": 25, "avg_battery_range_km": 45},
        "popular_routes": [
            {"name": "28 May to White City (E-Bike)", "distance_m": 5200, "time_min": 12, "rating": 4.4},
            {"name": "Narimanov to Sahil Express", "distance_m": 7800, "time_min": 19, "rating": 4.2},
        ],
    },
    "scooter": {
        "routes_available": 30, "avg_speed_kmh": 12, "coverage_km": 35,
        "infrastructure": {"allowed_zones": 8, "parking_areas": 22, "speed_limit_kmh": 15, "prohibited_zones": 5},
        "popular_routes": [
            {"name": "Fountain Square to Boulevard", "distance_m": 1200, "time_min": 6, "rating": 4.1},
            {"name": "Nizami Street Short Trip", "distance_m": 800, "time_min": 4, "rating": 4.0},
        ],
    },
    "e_scooter": {
        "routes_available": 25, "avg_speed_kmh": 20, "coverage_km": 30,
        "infrastructure": {"pickup_zones": 15, "charging_docks": 10, "avg_cost_per_min": 0.15, "operators_count": 2},
        "popular_routes": [
            {"name": "Central Baku Quick Ride", "distance_m": 2200, "time_min": 7, "rating": 4.3},
            {"name": "28 May to Port Baku", "distance_m": 3500, "time_min": 11, "rating": 4.1},
        ],
    },
    "private_car": {
        "routes_available": 2400, "avg_speed_kmh": 28, "coverage_km": 1850,
        "infrastructure": {"road_km": 1850, "parking_lots": 340, "fuel_stations": 125, "ev_chargers": 18},
        "popular_routes": [
            {"name": "28 May to Airport", "distance_m": 25000, "time_min": 35, "rating": 3.8},
            {"name": "City Center to Mardakan Beach", "distance_m": 32000, "time_min": 45, "rating": 3.5},
            {"name": "Narimanov to Baku Mall", "distance_m": 8500, "time_min": 18, "rating": 4.0},
        ],
    },
    "taxi": {
        "routes_available": 2400, "avg_speed_kmh": 22, "coverage_km": 1850,
        "infrastructure": {"active_drivers_est": 12000, "operators": ["Bolt", "Uber", "189 Taxi"], "avg_wait_min": 4, "avg_fare_per_km": 0.80},
        "popular_routes": [
            {"name": "Airport Transfer", "distance_m": 25000, "time_min": 30, "rating": 4.2, "est_cost": 15.0},
            {"name": "28 May to Flame Towers", "distance_m": 3200, "time_min": 10, "rating": 4.5, "est_cost": 4.50},
            {"name": "Boulevard to Heydar Aliyev Center", "distance_m": 5800, "time_min": 15, "rating": 4.3, "est_cost": 6.00},
        ],
    },
    "metro": {
        "routes_available": 3, "avg_speed_kmh": 40, "coverage_km": 38.3,
        "infrastructure": {"lines": 3, "stations": 27, "daily_capacity": 800000, "fare_azn": 0.60, "payment": "BakiKart"},
        "popular_routes": [
            {"name": "Red Line Full (Icherisheher to Hazi Aslanov)", "distance_m": 19300, "time_min": 28, "rating": 4.6},
            {"name": "28 May to Koroglu", "distance_m": 8500, "time_min": 12, "rating": 4.7},
            {"name": "Sahil to Khatai (Green Line)", "distance_m": 7200, "time_min": 10, "rating": 4.5},
        ],
    },
    "bus": {
        "routes_available": 85, "avg_speed_kmh": 18, "coverage_km": 1200,
        "infrastructure": {"routes_total": 85, "stops_total": 1200, "daily_capacity": 950000, "fare_azn": 0.60, "payment": "BakiKart"},
        "popular_routes": [
            {"name": "Route 18 (Baku Station to White City)", "distance_m": 14500, "time_min": 48, "rating": 4.0},
            {"name": "Route 65 (28 May to Narimanov)", "distance_m": 11800, "time_min": 35, "rating": 3.8},
            {"name": "Route 125 (Sahil to Surakhani)", "distance_m": 18200, "time_min": 55, "rating": 3.6},
        ],
    },
    "minibus": {
        "routes_available": 65, "avg_speed_kmh": 20, "coverage_km": 800,
        "infrastructure": {"routes_observed": 65, "est_vehicles": 3500, "avg_fare_azn": 0.40, "payment": "Cash / BakiKart"},
        "popular_routes": [
            {"name": "Minibus 145 (Binagadi to Nasimi)", "distance_m": 12300, "time_min": 35, "rating": 3.5},
            {"name": "Minibus 77 (Khatai to Sabail)", "distance_m": 8700, "time_min": 25, "rating": 3.4},
            {"name": "Minibus 202 (Yasamal to Narimanov)", "distance_m": 10100, "time_min": 30, "rating": 3.6},
        ],
    },
    "shuttle": {
        "routes_available": 3, "avg_speed_kmh": 35, "coverage_km": 85,
        "infrastructure": {"airport_shuttle": True, "corporate_shuttles": 5, "event_shuttles": 2, "avg_fare_azn": 1.50},
        "popular_routes": [
            {"name": "Airport Express (28 May to Heydar Aliyev Airport)", "distance_m": 25000, "time_min": 40, "rating": 4.4},
            {"name": "SOCAR Corporate Shuttle", "distance_m": 15000, "time_min": 25, "rating": 4.2},
        ],
    },
    "park_and_ride": {
        "routes_available": 8, "avg_speed_kmh": 0, "coverage_km": 0,
        "infrastructure": {"transfer_hubs": 4, "supported_combinations": 12, "avg_transfer_time_min": 5, "multimodal_trips_daily": 45000},
        "popular_routes": [
            {"name": "Metro + Bus (28 May to Surakhani)", "distance_m": 22000, "time_min": 45, "rating": 4.1},
            {"name": "Metro + Walking (Sahil to Old City)", "distance_m": 3500, "time_min": 15, "rating": 4.6},
            {"name": "Bus + Minibus (Narimanov to Binagadi)", "distance_m": 14000, "time_min": 40, "rating": 3.7},
        ],
    },
    "shared_mobility": {
        "routes_available": 0, "avg_speed_kmh": 0, "coverage_km": 0,
        "infrastructure": {"planned_launch": "Q3 2026", "expected_operators": 3, "pilot_zone": "Sabail district", "expected_modes": ["Carpooling", "On-demand minibus", "Ride-sharing"]},
        "popular_routes": [],
    },
}

DEMO_ROUTE = {
    "origin": {"name": "28 May Station", "lat": 40.4093, "lng": 49.8671},
    "destination": {"name": "Heydar Aliyev Center", "lat": 40.3958, "lng": 49.8679},
    "options": [
        {"id": "r_walk", "name": "Walking Only", "primary_mode": "walking", "modes": ["walking"], "time_min": 45, "cost_azn": 0, "emissions_g": 0, "reliability": 0.99, "accessibility": "full", "segments": [
            {"mode": "walking", "from": "28 May Station", "to": "Heydar Aliyev Center", "min": 45, "m": 3500}]},
        {"id": "r_wheelchair", "name": "Wheelchair Accessible", "primary_mode": "wheelchair", "modes": ["wheelchair"], "time_min": 55, "cost_azn": 0, "emissions_g": 0, "reliability": 0.95, "accessibility": "full", "segments": [
            {"mode": "wheelchair", "from": "28 May (Ramp Exit A)", "to": "Nizami St Accessible Path", "min": 20, "m": 1200},
            {"mode": "wheelchair", "from": "Nizami St", "to": "Heydar Aliyev Center (Entrance C - Ramp)", "min": 35, "m": 2600}]},
        {"id": "r_bike", "name": "Bicycle", "primary_mode": "bicycle", "modes": ["bicycle"], "time_min": 18, "cost_azn": 0, "emissions_g": 0, "reliability": 0.90, "accessibility": "limited", "segments": [
            {"mode": "bicycle", "from": "28 May CityBike Station", "to": "Heydar Aliyev Center Bike Rack", "min": 18, "m": 4200}]},
        {"id": "r_ebike", "name": "E-Bike", "primary_mode": "e_bike", "modes": ["e_bike"], "time_min": 12, "cost_azn": 0.50, "emissions_g": 8, "reliability": 0.88, "accessibility": "limited", "segments": [
            {"mode": "e_bike", "from": "28 May E-Bike Dock", "to": "Heydar Aliyev Center", "min": 12, "m": 4200}]},
        {"id": "r_scooter", "name": "Kick Scooter", "primary_mode": "scooter", "modes": ["scooter"], "time_min": 22, "cost_azn": 0, "emissions_g": 0, "reliability": 0.85, "accessibility": "limited", "segments": [
            {"mode": "scooter", "from": "28 May Station area", "to": "Heydar Aliyev Center", "min": 22, "m": 3800}]},
        {"id": "r_escooter", "name": "E-Scooter", "primary_mode": "e_scooter", "modes": ["e_scooter"], "time_min": 14, "cost_azn": 2.10, "emissions_g": 5, "reliability": 0.82, "accessibility": "limited", "segments": [
            {"mode": "e_scooter", "from": "28 May Pickup Zone", "to": "Heydar Aliyev Center Drop Zone", "min": 14, "m": 4000}]},
        {"id": "r_car", "name": "Private Car", "primary_mode": "private_car", "modes": ["private_car"], "time_min": 14, "cost_azn": 1.20, "emissions_g": 1100, "reliability": 0.75, "accessibility": "full", "segments": [
            {"mode": "private_car", "from": "28 May Parking", "to": "Heydar Aliyev Center Parking", "min": 14, "m": 5800}]},
        {"id": "r_taxi", "name": "Taxi Direct", "primary_mode": "taxi", "modes": ["taxi"], "time_min": 12, "cost_azn": 5.50, "emissions_g": 850, "reliability": 0.85, "accessibility": "request_required", "segments": [
            {"mode": "taxi", "from": "28 May Station", "to": "Heydar Aliyev Center", "min": 12, "m": 5800}]},
        {"id": "r_metro", "name": "Metro + Walking", "primary_mode": "metro", "modes": ["walking", "metro", "walking"], "time_min": 18, "cost_azn": 0.60, "emissions_g": 45, "reliability": 0.92, "accessibility": "full", "segments": [
            {"mode": "walking", "from": "28 May entrance", "to": "28 May Metro", "min": 3, "m": 200},
            {"mode": "metro", "from": "28 May", "to": "Nariman Narimanov", "min": 8, "m": 4200, "line": "Red Line"},
            {"mode": "walking", "from": "Narimanov Metro", "to": "Heydar Aliyev Center", "min": 7, "m": 550}]},
        {"id": "r_bus", "name": "Bus Direct", "primary_mode": "bus", "modes": ["walking", "bus", "walking"], "time_min": 25, "cost_azn": 0.60, "emissions_g": 120, "reliability": 0.78, "accessibility": "partial", "segments": [
            {"mode": "walking", "from": "28 May", "to": "Fountain Square Stop", "min": 4, "m": 300},
            {"mode": "bus", "from": "Fountain Square", "to": "Heydar Aliyev Center Stop", "min": 16, "m": 5100, "route": "Route 18"},
            {"mode": "walking", "from": "Bus Stop", "to": "Heydar Aliyev Center", "min": 5, "m": 400}]},
        {"id": "r_minibus", "name": "Minibus", "primary_mode": "minibus", "modes": ["walking", "minibus", "walking"], "time_min": 22, "cost_azn": 0.40, "emissions_g": 150, "reliability": 0.65, "accessibility": "limited", "segments": [
            {"mode": "walking", "from": "28 May", "to": "Minibus Stop (Nizami St)", "min": 5, "m": 350},
            {"mode": "minibus", "from": "Nizami St", "to": "Near Heydar Aliyev Center", "min": 12, "m": 4800, "route": "Minibus 77"},
            {"mode": "walking", "from": "Minibus Stop", "to": "Heydar Aliyev Center", "min": 5, "m": 380}]},
        {"id": "r_shuttle", "name": "Shuttle Service", "primary_mode": "shuttle", "modes": ["walking", "shuttle"], "time_min": 20, "cost_azn": 1.50, "emissions_g": 90, "reliability": 0.80, "accessibility": "full", "segments": [
            {"mode": "walking", "from": "28 May", "to": "Shuttle Pickup Point", "min": 5, "m": 300},
            {"mode": "shuttle", "from": "Shuttle Stop", "to": "Heydar Aliyev Center", "min": 15, "m": 5500}]},
        {"id": "r_transfer", "name": "Metro + Bus Transfer", "primary_mode": "park_and_ride", "modes": ["walking", "metro", "bus", "walking"], "time_min": 28, "cost_azn": 1.20, "emissions_g": 65, "reliability": 0.82, "accessibility": "partial", "segments": [
            {"mode": "walking", "from": "28 May entrance", "to": "28 May Metro", "min": 2, "m": 150},
            {"mode": "metro", "from": "28 May", "to": "Sahil", "min": 4, "m": 2100, "line": "Red Line"},
            {"mode": "walking", "from": "Sahil Metro", "to": "Sahil Bus Stop", "min": 3, "m": 200},
            {"mode": "bus", "from": "Sahil", "to": "Heydar Aliyev Center area", "min": 14, "m": 4200, "route": "Route 125"},
            {"mode": "walking", "from": "Bus Stop", "to": "Heydar Aliyev Center", "min": 5, "m": 350}]},
        {"id": "r_shared", "name": "Shared Mobility (Planned)", "primary_mode": "shared_mobility", "modes": ["shared_mobility"], "time_min": 0, "cost_azn": 0, "emissions_g": 0, "reliability": 0, "accessibility": "planned", "segments": []},
    ]
}

CONGESTION_FORECAST = {
    "corridors": {
        "Heydar Aliyev Ave": [
            {"hour": "06:00", "level": 0.15, "confidence": 0.88}, {"hour": "07:00", "level": 0.35, "confidence": 0.91},
            {"hour": "08:00", "level": 0.72, "confidence": 0.93}, {"hour": "09:00", "level": 0.85, "confidence": 0.90},
            {"hour": "10:00", "level": 0.65, "confidence": 0.87}, {"hour": "11:00", "level": 0.45, "confidence": 0.85},
            {"hour": "12:00", "level": 0.55, "confidence": 0.84}, {"hour": "13:00", "level": 0.60, "confidence": 0.86},
            {"hour": "14:00", "level": 0.50, "confidence": 0.85}, {"hour": "15:00", "level": 0.55, "confidence": 0.87},
            {"hour": "16:00", "level": 0.70, "confidence": 0.89}, {"hour": "17:00", "level": 0.88, "confidence": 0.92},
            {"hour": "18:00", "level": 0.92, "confidence": 0.91}, {"hour": "19:00", "level": 0.78, "confidence": 0.88},
            {"hour": "20:00", "level": 0.50, "confidence": 0.84}, {"hour": "21:00", "level": 0.30, "confidence": 0.82},
        ],
        "Tbilisi Ave": [
            {"hour": "06:00", "level": 0.12, "confidence": 0.85}, {"hour": "07:00", "level": 0.40, "confidence": 0.88},
            {"hour": "08:00", "level": 0.78, "confidence": 0.90}, {"hour": "09:00", "level": 0.82, "confidence": 0.88},
            {"hour": "10:00", "level": 0.58, "confidence": 0.85}, {"hour": "11:00", "level": 0.40, "confidence": 0.83},
            {"hour": "12:00", "level": 0.48, "confidence": 0.82}, {"hour": "13:00", "level": 0.52, "confidence": 0.84},
            {"hour": "14:00", "level": 0.45, "confidence": 0.83}, {"hour": "15:00", "level": 0.50, "confidence": 0.85},
            {"hour": "16:00", "level": 0.68, "confidence": 0.87}, {"hour": "17:00", "level": 0.85, "confidence": 0.90},
            {"hour": "18:00", "level": 0.88, "confidence": 0.89}, {"hour": "19:00", "level": 0.72, "confidence": 0.86},
            {"hour": "20:00", "level": 0.42, "confidence": 0.82}, {"hour": "21:00", "level": 0.25, "confidence": 0.80},
        ],
    },
    "model": "gradient_boost_v2",
    "last_trained": "2026-03-14T00:00:00Z"
}

EARTH_OBSERVATION = {
    "last_capture": "2026-03-13T09:30:00Z",
    "satellite": "Sentinel-2",
    "resolution": "10m",
    "coverage": "Baku Metropolitan Area",
    "layers": [
        {"id": "ndvi", "name": "Vegetation Index (NDVI)", "description": "Green space density across urban districts", "status": "available", "value": 0.32, "unit": "index", "trend": "stable"},
        {"id": "lst", "name": "Land Surface Temperature", "description": "Urban heat island detection and thermal mapping", "status": "available", "value": 8.2, "unit": "C (Jan avg)", "trend": "seasonal"},
        {"id": "built_up", "name": "Built-up Area Index", "description": "Urban expansion and construction monitoring", "status": "available", "value": 0.74, "unit": "index", "trend": "increasing"},
        {"id": "water", "name": "Water Body Detection", "description": "Caspian shoreline and water monitoring", "status": "available", "value": 0.89, "unit": "clarity index", "trend": "stable"},
        {"id": "air_quality", "name": "Aerosol Optical Depth", "description": "Atmospheric particulate proxy", "status": "partial", "value": 0.21, "unit": "AOD", "trend": "improving"},
        {"id": "nightlight", "name": "Night Light Intensity", "description": "Economic activity and infrastructure proxy", "status": "available", "value": 42.5, "unit": "nW/cm2/sr", "trend": "increasing"},
    ]
}

DEMO_GUIDE_STEPS = [
    {"step": 1, "title": "Executive Overview", "section": "overview", "description": "See the complete mobility picture for Baku with 14 supported modes and 13 data providers.", "duration_sec": 60},
    {"step": 2, "title": "Transit Network", "section": "transit", "description": "Explore metro lines, bus routes, and station coverage across Baku on an interactive map.", "duration_sec": 90},
    {"step": 3, "title": "Multimodal Routing", "section": "routing", "description": "Compare route options across modes by time, cost, emissions, and accessibility.", "duration_sec": 90},
    {"step": 4, "title": "Congestion Forecasting", "section": "forecasting", "description": "Review congestion predictions with confidence intervals and source transparency.", "duration_sec": 60},
    {"step": 5, "title": "Alerts and Incidents", "section": "alerts", "description": "Browse active alerts with provenance indicators showing data origin.", "duration_sec": 60},
    {"step": 6, "title": "Mobility Equity", "section": "equity", "description": "Compare district-level access, wheelchair accessibility, and equity indices.", "duration_sec": 90},
    {"step": 7, "title": "Earth Observation", "section": "earth-observation", "description": "See satellite-derived environmental context for urban planning.", "duration_sec": 60},
    {"step": 8, "title": "Provider Provenance", "section": "provenance", "description": "Review all data providers and their trust status.", "duration_sec": 90},
]

OVERVIEW_STATS = {
    "total_modes": 14,
    "active_providers": 10,
    "active_alerts": 10,
    "districts_covered": 12,
    "data_freshness_pct": 94,
    "forecast_accuracy_pct": 87,
    "wheelchair_accessible_pct": 62,
    "daily_trips_estimate": 2800000,
    "mode_distribution": [
        {"mode": "Metro", "share": 28, "color": "#ef4444"},
        {"mode": "Bus", "share": 32, "color": "#3b82f6"},
        {"mode": "Minibus", "share": 15, "color": "#a855f7"},
        {"mode": "Private Car", "share": 18, "color": "#64748b"},
        {"mode": "Taxi", "share": 5, "color": "#f97316"},
        {"mode": "Walking/Other", "share": 2, "color": "#10b981"},
    ],
    "weekly_trend": [
        {"day": "Mon", "trips": 2950, "alerts": 4},
        {"day": "Tue", "trips": 2880, "alerts": 2},
        {"day": "Wed", "trips": 2920, "alerts": 3},
        {"day": "Thu", "trips": 2900, "alerts": 5},
        {"day": "Fri", "trips": 3100, "alerts": 3},
        {"day": "Sat", "trips": 2200, "alerts": 1},
        {"day": "Sun", "trips": 1800, "alerts": 1},
    ],
    "provider_health": [
        {"name": "BMA", "uptime": 99.2},
        {"name": "BakuBus", "uptime": 97.8},
        {"name": "BNA", "uptime": 95.1},
        {"name": "Bolt", "uptime": 98.5},
        {"name": "Google", "uptime": 99.9},
        {"name": "Yandex", "uptime": 98.2},
    ]
}

# ============================================================
# API ENDPOINTS
# ============================================================

@api_router.get("/")
async def root():
    return {"message": "Urbanivity API", "version": "1.0.0", "status": "operational"}

@api_router.get("/dashboard/overview")
async def get_dashboard_overview():
    return OVERVIEW_STATS

@api_router.get("/mobility-modes")
async def get_mobility_modes():
    return MOBILITY_MODES

@api_router.get("/providers")
async def get_providers():
    return PROVIDERS

@api_router.get("/alerts")
async def get_alerts(status: Optional[str] = None, severity: Optional[str] = None):
    result = ALERTS
    if status:
        result = [a for a in result if a["status"] == status]
    if severity:
        result = [a for a in result if a["severity"] == severity]
    return result

@api_router.get("/transit/network")
async def get_transit_network():
    total_stations = sum(l["stations"] for l in TRANSIT_LINES)
    return {"lines": TRANSIT_LINES, "total_stations": total_stations, "total_routes": len(TRANSIT_LINES), "daily_ridership": 1680000}

@api_router.get("/mobility-modes/{mode_id}/detail")
async def get_mode_detail(mode_id: str):
    mode = next((m for m in MOBILITY_MODES if m["id"] == mode_id), None)
    if not mode:
        return {"error": "Mode not found"}
    detail = MODE_DETAILS.get(mode_id, {})
    mode_alerts = [a for a in ALERTS if a.get("mode") == mode_id and a["status"] == "active"]
    mode_providers = [p for p in PROVIDERS if mode_id in p.get("modes", [])]
    mode_lines = [l for l in TRANSIT_LINES if l["mode"] == mode_id]
    return {
        **mode,
        "detail": detail,
        "active_alerts": len(mode_alerts),
        "alerts": mode_alerts[:3],
        "providers": [{"id": p["id"], "name": p["name"], "provenance": p["provenance"], "reliability": p["reliability"]} for p in mode_providers],
        "transit_lines": [{"id": l["id"], "name": l["name"], "stations": l["stations"], "length_km": l["length_km"]} for l in mode_lines],
    }

@api_router.get("/routing/demo")
async def get_demo_route():
    return DEMO_ROUTE

@api_router.get("/forecasting/congestion")
async def get_congestion_forecast(corridor: Optional[str] = None):
    c = corridor or "Heydar Aliyev Ave"
    data = CONGESTION_FORECAST["corridors"].get(c, CONGESTION_FORECAST["corridors"]["Heydar Aliyev Ave"])
    return {"corridor": c, "forecast": data, "model": CONGESTION_FORECAST["model"], "last_trained": CONGESTION_FORECAST["last_trained"], "available_corridors": list(CONGESTION_FORECAST["corridors"].keys())}

@api_router.get("/equity/districts")
async def get_equity_districts():
    return DISTRICTS

@api_router.get("/earth-observation")
async def get_earth_observation():
    return EARTH_OBSERVATION

@api_router.get("/demo/guide")
async def get_demo_guide():
    return {"steps": DEMO_GUIDE_STEPS, "total_duration_min": 10}

@api_router.post("/demo/reset")
async def reset_demo():
    return {"status": "reset", "message": "Demo state reset to initial configuration"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
