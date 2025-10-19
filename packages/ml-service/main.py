from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import numpy as np
from sklearn.cluster import DBSCAN

app = FastAPI(
    title="Sentinel Nigeria - ML Service",
    description="Machine learning microservice for hotspot prediction and risk analysis",
    version="0.1.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class IncidentLocation(BaseModel):
    latitude: float
    longitude: float
    timestamp: datetime
    severity: str

class HotspotRequest(BaseModel):
    incidents: List[IncidentLocation]
    radius_km: float = 1.0
    min_samples: int = 3

class Hotspot(BaseModel):
    center_lat: float
    center_lng: float
    radius_meters: float
    incident_count: int
    severity: str
    risk_score: float

class RoutePoint(BaseModel):
    latitude: float
    longitude: float

class RouteRiskRequest(BaseModel):
    route_points: List[RoutePoint]
    time_of_day: str = "day"

class RouteRiskResponse(BaseModel):
    overall_risk: float
    risk_level: str
    dangerous_segments: List[dict]
    recommendations: List[str]

@app.get("/")
def root():
    return {
        "service": "Sentinel Nigeria ML Service",
        "version": "0.1.0",
        "status": "operational"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.post("/api/v1/hotspots/detect", response_model=List[Hotspot])
async def detect_hotspots(request: HotspotRequest):
    """
    Detect incident hotspots using DBSCAN clustering algorithm.
    Returns clusters of incidents that represent high-risk areas.
    """
    if len(request.incidents) < request.min_samples:
        return []

    # Convert incidents to coordinate array
    coords = np.array([
        [inc.latitude, inc.longitude]
        for inc in request.incidents
    ])

    # Apply DBSCAN clustering
    # epsilon is in radians, convert km to radians (approximate)
    epsilon = request.radius_km / 6371.0  # Earth radius in km

    clustering = DBSCAN(
        eps=epsilon,
        min_samples=request.min_samples,
        metric='haversine'
    ).fit(np.radians(coords))

    labels = clustering.labels_

    # Calculate hotspots from clusters
    hotspots = []
    unique_labels = set(labels)

    for label in unique_labels:
        if label == -1:  # Skip noise points
            continue

        # Get all points in this cluster
        cluster_mask = labels == label
        cluster_coords = coords[cluster_mask]
        cluster_incidents = [inc for i, inc in enumerate(request.incidents) if cluster_mask[i]]

        # Calculate center and statistics
        center_lat = float(np.mean(cluster_coords[:, 0]))
        center_lng = float(np.mean(cluster_coords[:, 1]))

        # Calculate radius (max distance from center)
        from sklearn.metrics.pairwise import haversine_distances
        center_rad = np.radians([[center_lat, center_lng]])
        cluster_rad = np.radians(cluster_coords)
        distances = haversine_distances(center_rad, cluster_rad)[0] * 6371000  # in meters
        radius = float(np.max(distances))

        # Determine severity
        severity_scores = {
            'low': 1,
            'medium': 2,
            'high': 3,
            'critical': 4
        }
        avg_severity_score = np.mean([
            severity_scores.get(inc.severity, 2)
            for inc in cluster_incidents
        ])

        if avg_severity_score >= 3.5:
            severity = 'critical'
        elif avg_severity_score >= 2.5:
            severity = 'high'
        elif avg_severity_score >= 1.5:
            severity = 'medium'
        else:
            severity = 'low'

        # Calculate risk score (0-100)
        incident_count = len(cluster_incidents)
        risk_score = min(100, (incident_count * 10) + (avg_severity_score * 15))

        hotspots.append(Hotspot(
            center_lat=center_lat,
            center_lng=center_lng,
            radius_meters=radius,
            incident_count=incident_count,
            severity=severity,
            risk_score=float(risk_score)
        ))

    # Sort by risk score descending
    hotspots.sort(key=lambda x: x.risk_score, reverse=True)

    return hotspots

@app.post("/api/v1/routes/assess-risk", response_model=RouteRiskResponse)
async def assess_route_risk(request: RouteRiskRequest):
    """
    Assess the safety risk of a planned route.
    In production, this would query the database for nearby incidents.
    """
    # Simplified risk assessment (placeholder for real ML model)
    # In production, this would:
    # 1. Query incidents near each route segment
    # 2. Check hotspot intersections
    # 3. Consider time-of-day patterns
    # 4. Apply trained risk prediction model

    num_points = len(request.route_points)

    # Placeholder risk calculation
    base_risk = 20.0  # Base risk percentage

    # Time of day adjustment
    time_adjustments = {
        'morning': 0.8,
        'day': 0.7,
        'evening': 1.2,
        'night': 1.5
    }
    time_multiplier = time_adjustments.get(request.time_of_day, 1.0)

    overall_risk = min(100, base_risk * time_multiplier)

    # Determine risk level
    if overall_risk >= 70:
        risk_level = 'very_high'
    elif overall_risk >= 50:
        risk_level = 'high'
    elif overall_risk >= 30:
        risk_level = 'medium'
    else:
        risk_level = 'low'

    recommendations = []
    if overall_risk >= 50:
        recommendations.append("Consider traveling during daylight hours")
        recommendations.append("Share your journey with trusted contacts")
        recommendations.append("Keep emergency contacts ready")

    if request.time_of_day == 'night':
        recommendations.append("Avoid traveling alone at night if possible")

    return RouteRiskResponse(
        overall_risk=round(overall_risk, 2),
        risk_level=risk_level,
        dangerous_segments=[],
        recommendations=recommendations
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
