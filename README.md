# Sentinel Nigeria

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Code for Change](https://img.shields.io/badge/Code%20for-Change-blue)](https://bloodhoundsecurity.ca/code-for-change)

> Community-powered safety network protecting West African communities from kidnapping through real-time incident reporting, ML-powered threat mapping, and virtual escort coordination.

Part of [Bloodhound's Code for Change](https://bloodhoundsecurity.ca/code-for-change) initiative - building technology that saves lives.

---

## The Problem

West Africa faces a **kidnapping epidemic** with:
- **3,000+ reported incidents** annually in Nigeria alone
- **300% increase** since 2016
- Ransom demands ranging from **$10,000 to $500,000 USD**
- Limited police resources and poor coordination
- **No centralized platform** for communities to share threats or coordinate safety

Students, travelers, and rural communities are increasingly at risk.

---

## Our Solution

Sentinel Nigeria is a **mobile-first platform** that empowers communities to:

### SafeRoute Navigator
Plan safe travel routes with real-time incident overlay, crowd-sourced safety ratings, and community-verified safe zones.

### Guardian Network
Virtual escort system for journey tracking with trusted contacts, automatic check-ins, and panic button for emergencies.

### Community Watch Hub
Collective intelligence platform for anonymous incident reporting, pattern recognition, and hotspot visualization.

### Emergency Response
Rapid response coordination with SOS triggers, location sharing, and direct integration with police and response teams.

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Mobile Apps** | React Native (iOS + Android) |
| **Web Dashboard** | Next.js 14, TypeScript, Tailwind CSS |
| **Realtime Server** | Socket.io, Node.js |
| **Database** | PostgreSQL with PostGIS (geospatial) |
| **Machine Learning** | Python, FastAPI, scikit-learn |
| **Cache** | Redis |
| **Infrastructure** | AWS / DigitalOcean / Vercel |

---

## Project Structure

```
sentinel-nigeria/
├── apps/
│   ├── mobile/          # React Native mobile app (iOS + Android)
│   ├── web/             # Next.js admin dashboard + API routes
│   └── realtime/        # Socket.io WebSocket server
├── packages/
│   ├── database/        # PostgreSQL schema & migrations
│   ├── shared/          # Shared TypeScript types
│   └── ml-service/      # Python ML microservice
├── docs/                # Documentation
└── scripts/             # Setup & deployment scripts
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 15+ with PostGIS
- Python 3.11+ (for ML service)
- React Native CLI (for mobile development)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/CodeForChangeBH/Sentinel-Nigeria.git
cd Sentinel-Nigeria

# Install dependencies (monorepo)
npm install

# Set up environment variables
cp packages/database/.env.example packages/database/.env
cp apps/web/.env.example apps/web/.env
cp apps/realtime/.env.example apps/realtime/.env

# Set up PostgreSQL database
createdb sentinel_nigeria
psql sentinel_nigeria < packages/database/schema.sql

# Start all services
npm run dev
# This runs: web dashboard, realtime server, and more
```

### Mobile App Setup

```bash
cd apps/mobile
npm install

# iOS
npm run ios

# Android
npm run android
```

### ML Service Setup

```bash
cd packages/ml-service
pip install -r requirements.txt
python main.py
# API docs at: http://localhost:8000/docs
```

---

## 🧠 Example API Usage

Here are some basic examples showing how developers can interact with the Sentinel Nigeria API
for authentication, reporting incidents, and tracking journeys.

### Example 1: User Authentication (Login)

**JavaScript**
```javascript
import axios from "axios";

async function login(email, password) {
  const response = await axios.post("https://api.sentinelnigeria.org/auth/login", {
    email,
    password,
  });
  console.log(response.data); // { token: "abc123", user: { ... } }
}

login("test@example.com", "mypassword");
```

**Python**
```python
import requests

data = {"email": "test@example.com", "password": "mypassword"}
res = requests.post("https://api.sentinelnigeria.org/auth/login", json=data)
print(res.json())  # {'token': 'abc123', 'user': {...}}
```

### Example 2: Creating an Incident Report

**JavaScript**
```javascript
import axios from "axios";

async function createIncident(token) {
  const incident = {
    type: "kidnapping",
    description: "Suspicious vehicle reported near highway",
    latitude: 9.0765,
    longitude: 7.3986,
  };

  const response = await axios.post("https://api.sentinelnigeria.org/incidents", incident, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(response.data); // { id: 123, status: "reported" }
}
```

**Python**
```python
import requests

token = "abc123"
incident = {
    "type": "kidnapping",
    "description": "Suspicious vehicle reported near highway",
    "latitude": 9.0765,
    "longitude": 7.3986
}

res = requests.post(
    "https://api.sentinelnigeria.org/incidents",
    json=incident,
    headers={"Authorization": f"Bearer {token}"}
)
print(res.json())  # {'id': 123, 'status': 'reported'}
```

### Example 3: Fetching Nearby Incidents

**JavaScript**
```javascript
import axios from "axios";

async function getNearbyIncidents() {
  const response = await axios.get(
    "https://api.sentinelnigeria.org/incidents/nearby?lat=9.08&lng=7.40&radius=10"
  );
  console.log(response.data); // Array of nearby incidents
}

getNearbyIncidents();
```

**Python**
```python
import requests

res = requests.get("https://api.sentinelnigeria.org/incidents/nearby?lat=9.08&lng=7.40&radius=10")
print(res.json())  # [{'id': 123, 'type': 'kidnapping', ...}]
```

### 🛰️ Example 4: Starting a Journey Tracking Session

**JavaScript**
```javascript
import axios from "axios";

async function startJourney(token) {
  const journey = {
    startLocation: "Abuja",
    destination: "Kaduna",
    vehicle: "Toyota Corolla",
  };

  const response = await axios.post("https://api.sentinelnigeria.org/journeys/start", journey, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(response.data); // { journeyId: 45, status: "active" }
}
```

**Python**
```python
import requests

token = "abc123"
journey = {
    "startLocation": "Abuja",
    "destination": "Kaduna",
    "vehicle": "Toyota Corolla"
}

res = requests.post(
    "https://api.sentinelnigeria.org/journeys/start",
    json=journey,
    headers={"Authorization": f"Bearer {token}"}
)
print(res.json())  # {'journeyId': 45, 'status': 'active'}
```

## Project Roadmap

### **Phase 1: MVP (Months 1-3)** - Coming Q1 2026
- User authentication (email/phone)
- Incident reporting (text + location + photo)
- Interactive map with incident markers
- Community feed of recent reports
- Push notifications
- Web admin panel for moderation

**Goal:** 1,000 downloads, 100+ incident reports

### **Phase 2: Network Effects (Months 4-6)**
- Journey tracking & virtual escort
- Panic button with emergency alerts
- Community verification system
- SMS alerts (for basic phones)
- Multi-language support (English, Yoruba, Hausa, Igbo)
- Offline mode basics

**Goal:** 10,000 downloads, 50+ daily journeys tracked

### **Phase 3: Intelligence (Months 7-9)**
- ML-based pattern recognition
- Hotspot prediction mapping
- Route safety scoring algorithm
- Risk assessment for journeys
- Integration with local authorities
- Historical data analysis dashboard

**Goal:** 50,000 downloads, 70% prediction accuracy

### **Phase 4: Scale (Months 10-12)**
- Performance optimization
- Advanced offline functionality
- Cross-border support (Cameroon, Niger, Benin)
- API for third-party integrations
- White-label version for other organizations

**Goal:** 100,000+ downloads, expansion to 2+ countries

---

## How to Contribute

We welcome contributions from developers worldwide! Whether you're a beginner or an expert, there's a place for you here.

### Good First Issues (Beginner-Friendly)

Perfect for newcomers:
- Create app icon and splash screen (150 points, Design)
- Add code examples to README (75 points, Documentation)
- Implement dark mode toggle (100 points, Mobile/UI)
- Add input validation for incident reports (100 points, Backend)
- Add loading states to map component (75 points, Mobile/UX)
- Write unit tests for auth service (100 points, Testing)

### Advanced Challenges (Expert-Level)

For experienced developers:
- Build hotspot prediction model (500 points, Machine Learning)
- Implement end-to-end encryption (500 points, Security)
- Build offline-first architecture with sync (500 points, Architecture)

**See all issues:** [Browse Issues](https://github.com/CodeForChangeBH/Sentinel-Nigeria/issues)

### Contribution Process

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and commit (`git commit -m 'Add amazing feature'`)
4. **Push to your fork** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

Read our [Contributing Guide](CONTRIBUTING.md) for detailed instructions.

---

## Recognition & Rewards

### Points System
Every contribution earns points based on difficulty:
- Bug fixes: 50-150 points
- Features: 100-500 points
- Documentation: 50-100 points
- Tests: 75-150 points

### Quarterly Awards ($2,000 in prizes)
- **Top Contributor:** $500 + Bloodhound Pro license (1 year)
- **Most Impactful Feature:** $400 + exclusive swag
- **Best Newcomer:** $300 + Bloodhound Pro license (6 months)
- **Best Design/UX:** $300
- **Community Champion:** $250 + recognition
- **Rising Star:** $250

**Plus:** Badges, swag, certificate of contribution, and eternal gratitude!

[View Leaderboard](https://bloodhoundsecurity.ca/code-for-change/leaderboard)

---

## Documentation

- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Architecture Overview](docs/planning/sentinel-nigeria-project.md)
- API Documentation _(coming soon)_
- Mobile App Setup _(coming soon)_
- Deployment Guide _(coming soon)_

---

## Community

- **Discord:** [Join our community](https://discord.gg/bloodhound-cfc)
- **Twitter:** [@BloodhoundCFC](https://twitter.com/bloodhoundcfc)
- **Email:** codeforchange@bloodhoundsecurity.ca
- **Website:** [bloodhoundsecurity.ca/code-for-change](https://bloodhoundsecurity.ca/code-for-change)

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built by the global developer community
- Part of [Bloodhound Security's Code for Change](https://bloodhoundsecurity.ca/code-for-change) initiative
- Dedicated to protecting Nigerian communities

---

## This Is More Than an App

This is a **movement** to protect Nigerian communities through the power of **collective technology** and **global collaboration**.

**Lives Protected:** ∞
**Community-Powered:** 100%
**Open Source:** Free

### Let's build it together.

---

**[Start Contributing](https://github.com/CodeForChangeBH/Sentinel-Nigeria/issues)** • **[View Roadmap](#project-roadmap)** • **[Join Discord](https://discord.gg/bloodhound-cfc)**
