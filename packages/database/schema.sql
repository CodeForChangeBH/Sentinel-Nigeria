-- Sentinel Nigeria Database Schema
-- PostgreSQL 15+ with PostGIS extension

-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'trusted')),
  reputation_score INTEGER DEFAULT 0,
  profile_photo VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_seen_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Trusted contacts (guardian network)
CREATE TABLE trusted_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES users(id) ON DELETE CASCADE,
  relationship VARCHAR(50), -- 'family', 'friend', 'colleague'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, contact_id)
);

-- Incidents table
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL CHECK (type IN ('kidnapping', 'suspicious_activity', 'roadblock', 'other')),
  description TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL, -- PostGIS geography type
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(10, 2), -- in meters
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'false_report', 'resolved')),
  verification_count INTEGER DEFAULT 0,
  false_report_count INTEGER DEFAULT 0,
  photos TEXT[], -- Array of photo URLs
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Create spatial index for fast geospatial queries
CREATE INDEX incidents_location_idx ON incidents USING GIST(location);
CREATE INDEX incidents_created_at_idx ON incidents(created_at DESC);
CREATE INDEX incidents_status_idx ON incidents(status);

-- Incident verifications
CREATE TABLE incident_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  is_verified BOOLEAN NOT NULL, -- true = confirms incident, false = disputes it
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(incident_id, user_id)
);

-- Journeys (virtual escort tracking)
CREATE TABLE journeys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  start_location GEOGRAPHY(POINT, 4326) NOT NULL,
  start_lat DECIMAL(10, 8) NOT NULL,
  start_lng DECIMAL(11, 8) NOT NULL,
  end_location GEOGRAPHY(POINT, 4326) NOT NULL,
  end_lat DECIMAL(10, 8) NOT NULL,
  end_lng DECIMAL(11, 8) NOT NULL,
  current_location GEOGRAPHY(POINT, 4326),
  current_lat DECIMAL(10, 8),
  current_lng DECIMAL(11, 8),
  status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'emergency')),
  estimated_arrival TIMESTAMP NOT NULL,
  actual_arrival TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX journeys_user_id_idx ON journeys(user_id);
CREATE INDEX journeys_status_idx ON journeys(status);
CREATE INDEX journeys_created_at_idx ON journeys(created_at DESC);

-- Journey waypoints
CREATE TABLE journey_waypoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  reached_at TIMESTAMP,
  sequence_number INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Journey trusted contacts (who can track this journey)
CREATE TABLE journey_guardians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(journey_id, user_id)
);

-- Emergency alerts
CREATE TABLE emergency_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  journey_id UUID REFERENCES journeys(id), -- optional, if triggered during a journey
  type VARCHAR(20) NOT NULL CHECK (type IN ('panic', 'sos', 'medical', 'fire')),
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'responding', 'resolved', 'false_alarm')),
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

CREATE INDEX emergency_alerts_location_idx ON emergency_alerts USING GIST(location);
CREATE INDEX emergency_alerts_status_idx ON emergency_alerts(status);
CREATE INDEX emergency_alerts_created_at_idx ON emergency_alerts(created_at DESC);

-- Emergency responders (who responded to an alert)
CREATE TABLE emergency_responders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_id UUID REFERENCES emergency_alerts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  response_type VARCHAR(50), -- 'acknowledged', 'en_route', 'on_scene'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Safety ratings for locations/routes
CREATE TABLE safety_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 1 = very unsafe, 5 = very safe
  time_of_day VARCHAR(20), -- 'morning', 'afternoon', 'evening', 'night'
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX safety_ratings_location_idx ON safety_ratings USING GIST(location);

-- Hotspots (ML-generated risk areas)
CREATE TABLE hotspots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  center_location GEOGRAPHY(POINT, 4326) NOT NULL,
  center_lat DECIMAL(10, 8) NOT NULL,
  center_lng DECIMAL(11, 8) NOT NULL,
  radius DECIMAL(10, 2) NOT NULL, -- in meters
  incident_count INTEGER DEFAULT 0,
  severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  predicted_risk DECIMAL(5, 2), -- 0.00 to 100.00
  time_range_start TIMESTAMP NOT NULL,
  time_range_end TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX hotspots_location_idx ON hotspots USING GIST(center_location);
CREATE INDEX hotspots_severity_idx ON hotspots(severity);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'incident_nearby', 'journey_started', 'emergency_alert', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional data payload
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_created_at_idx ON notifications(created_at DESC);

-- Audit log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX audit_log_user_id_idx ON audit_log(user_id);
CREATE INDEX audit_log_created_at_idx ON audit_log(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journeys_updated_at BEFORE UPDATE ON journeys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_alerts_updated_at BEFORE UPDATE ON emergency_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotspots_updated_at BEFORE UPDATE ON hotspots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
