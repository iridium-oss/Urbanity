# Urbanivity - Product Requirements Document

## Original Problem Statement
Build Urbanivity - a provenance-aware, multimodal urban mobility intelligence platform for Azerbaijani cities (Baku primary). Full-stack web product with premium landing page, complete dashboard, demo mode, audience perspective modes, and all core mobility intelligence modules.

## Architecture
- **Backend**: FastAPI (Python) with in-memory demo data, MongoDB connected
- **Frontend**: React with Tailwind CSS, Shadcn UI, Leaflet maps, Recharts, Framer Motion
- **Database**: MongoDB (connected, demo data served from memory)
- **Hosting**: Kubernetes container with supervisor-managed services

## User Personas
1. **Judges/Mentors**: Need quick understanding of product value, strongest visuals
2. **Public Sector (B2G)**: Need equity, resilience, transparency, planning support
3. **Operators (B2B)**: Need operational dashboard, route insight, alert management
4. **Riders (B2C)**: Need trip understanding, route clarity, accessibility info
5. **Technical Evaluators**: Need provenance system, API readiness, system health

## Core Requirements (Static)
- 14 mobility modes supported (walking through shared mobility)
- 13+ data providers with provenance classification
- 12 Baku districts with equity indices
- Wheelchair accessibility as core feature
- Source transparency for every data point
- Demo mode for showcase readiness

## What's Been Implemented (March 15, 2026)
### Landing Page
- Hero with stats (14 modes, 13 providers, 12 districts, 2.8M trips)
- Vision / Why Now section
- Multimodal mobility grid (14 modes with status)
- How It Works (Aggregate > Analyze > Activate)
- Source Trust & Provenance (9 provenance classifications)
- Product Modules (6 modules)
- WUF13 alignment section
- Business model (B2G, B2B, B2C)
- Roadmap (4 phases)
- Team section
- CTA and Footer

### Dashboard (Dark Theme)
- Sidebar navigation (9 sections)
- Executive Overview (KPIs, pie chart, area chart, bar chart)
- Transit Network (Leaflet map with metro lines, line details panel)
- Routing Intelligence (multimodal route comparison, 4 options)
- Congestion Forecasting (area chart, corridor tabs, confidence bands)
- Alerts & Incidents (alert cards, severity badges, provenance tags, filters)
- Mobility Equity (district comparison chart, accessibility table, insights)
- Earth Observation (satellite layer cards, trend indicators)
- Provider Provenance (full provider table, provenance legend, filters)
- Demo Guide (walkthrough steps, progress bar, navigation)

### Features
- 5 audience perspective modes (Executive, B2G, B2B, B2C, Technical)
- Demo mode toggle
- Responsive design (desktop, tablet, mobile)
- Glass-morphism navigation
- Custom fonts (Outfit, Public Sans, JetBrains Mono)

## Prioritized Backlog

### P0 (Critical - Done)
- [x] Landing page with all sections
- [x] Dashboard with all 9 modules
- [x] Backend API with demo data
- [x] Audience mode selector
- [x] Demo mode toggle

### P1 (High Priority - Next)
- [ ] Settings/Help page
- [ ] Digital Twin dedicated view
- [ ] Mobile drawer navigation refinement
- [ ] Animated transitions between dashboard sections
- [ ] More detailed routing with map visualization

### P2 (Medium Priority)
- [ ] Real MongoDB persistence for user preferences
- [ ] Export/download functionality for reports
- [ ] Comparison mode for districts
- [ ] Search functionality across dashboard
- [ ] Keyboard shortcuts for navigation

### P3 (Nice to Have)
- [ ] Dark/Light theme toggle for landing page
- [ ] Multilingual support (Azerbaijani/English)
- [ ] PDF report generation
- [ ] API documentation page
- [ ] Interactive onboarding tour

## Next Tasks
1. Add Settings/Help surface
2. Add map visualization to routing intelligence
3. Add district markers to equity view map
4. Add more interactivity to demo guide (auto-navigation)
5. Build dedicated Digital Twin view
