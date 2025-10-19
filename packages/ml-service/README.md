# Sentinel Nigeria - ML Service

Machine learning microservice for:
- Hotspot detection (DBSCAN clustering)
- Route risk assessment
- Incident pattern recognition
- Predictive analytics

## Tech Stack
- FastAPI (Python web framework)
- scikit-learn (ML algorithms)
- PostgreSQL + PostGIS (geospatial data)

## Running Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Run the service
python main.py
# or
uvicorn main:app --reload

# API docs available at: http://localhost:8000/docs
```

## API Endpoints

### POST /api/v1/hotspots/detect
Detect incident hotspots using clustering

### POST /api/v1/routes/assess-risk
Assess safety risk for a planned route

## Future Enhancements
- Time-series prediction models
- Deep learning for pattern recognition
- Real-time model retraining
- Integration with weather data
- Social media sentiment analysis
