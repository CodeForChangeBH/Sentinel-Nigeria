// User types
export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  verificationStatus: 'pending' | 'verified' | 'trusted';
  reputationScore: number;
}

// Location types
export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
}

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

// Incident types
export interface Incident {
  id: string;
  reporterId: string;
  type: 'kidnapping' | 'suspicious_activity' | 'roadblock' | 'other';
  description: string;
  location: Location;
  geoPoint: GeoPoint;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'verified' | 'false_report' | 'resolved';
  verificationCount: number;
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Journey tracking types
export interface Journey {
  id: string;
  userId: string;
  startLocation: Location;
  endLocation: Location;
  currentLocation?: Location;
  status: 'planned' | 'in_progress' | 'completed' | 'emergency';
  estimatedArrival: Date;
  trustedContacts: string[]; // User IDs
  waypoints: Location[];
  createdAt: Date;
  updatedAt: Date;
}

// Emergency types
export interface EmergencyAlert {
  id: string;
  userId: string;
  location: Location;
  type: 'panic' | 'sos' | 'medical' | 'fire';
  status: 'active' | 'responding' | 'resolved' | 'false_alarm';
  responders?: string[]; // User IDs of people responding
  createdAt: Date;
  resolvedAt?: Date;
}

// Safety score types
export interface SafetyScore {
  overall: number; // 0-100
  timeOfDay: number;
  historicalIncidents: number;
  communityRating: number;
  lastUpdated: Date;
}

export interface RouteAssessment {
  routeId: string;
  safetyScore: SafetyScore;
  riskFactors: string[];
  alternateRoutes?: string[];
  estimatedRisk: 'low' | 'medium' | 'high' | 'very_high';
}

// Analytics types
export interface HotspotData {
  location: GeoPoint;
  radius: number; // meters
  incidentCount: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timeRange: {
    start: Date;
    end: Date;
  };
  predictedRisk?: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}
