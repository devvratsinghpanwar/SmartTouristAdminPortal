"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

// Fix for default icon issue with Leaflet and React
const defaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const alertIcon = L.icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="#dc2626"/>
            <circle cx="12.5" cy="12.5" r="8" fill="white"/>
            <circle cx="12.5" cy="12.5" r="5" fill="#dc2626"/>
        </svg>
    `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Tourist {
  _id: string;
  digitalId: string;
  lastLocation?: { lat: number; lng: number };
  safetyStatus: "normal" | "alert" | "danger";
  kyc?: {
    name?: string;
    nationality?: string;
  };
}

interface GeoFence {
  _id: string;
  name: string;
  type: "safe_zone" | "restricted_zone" | "alert_zone" | "emergency_zone" | "danger_zone" | "restricted_area" | "tourist_zone";
  riskLevel?: "low" | "medium" | "high" | "critical";
  geometry: {
    type: "Polygon" | "Circle";
    coordinates: number[][] | number[];
    radius?: number;
  };
  isActive: boolean;
}

export default function DashboardMap() {
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [geoFences, setGeoFences] = useState<GeoFence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch tourists data
        const touristsResponse = await fetch('http://localhost:4000/api/dashboard/tourists');
        if (touristsResponse.ok) {
          const touristsData = await touristsResponse.json();
          // Filter out tourists without location data for the map
          const touristsWithLocation = touristsData.filter((tourist: any) =>
            tourist.lastLocation &&
            tourist.lastLocation.lat &&
            tourist.lastLocation.lng &&
            tourist.isActive
          );
          setTourists(touristsWithLocation);
        }

        // Fetch geo-fences data
        const geoFencesResponse = await fetch('http://localhost:4000/api/geofences', {
          credentials: 'include'
        });
        if (geoFencesResponse.ok) {
          const geoFencesResult = await geoFencesResponse.json();
          const geoFencesData = geoFencesResult.success ? geoFencesResult.data.geoFences : [];
          setGeoFences(geoFencesData.filter((gf: GeoFence) => gf.isActive));
        }
      } catch (error) {
        console.error("Failed to fetch map data", error);
        setTourists([]);
        setGeoFences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Fetch every 30 seconds to simulate real-time updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-card rounded-lg shadow-elegant">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading map data...</p>
        </div>
      </div>
    );
  }

  // Beautiful satellite map tile layer
  const tileLayerUrl =
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  const tileLayerAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  const getStatusColor = (status: string) => {
    switch (status) {
      case "danger":
        return "text-destructive";
      case "alert":
        return "text-warning";
      default:
        return "text-accent";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "danger":
        return "bg-destructive/10";
      case "alert":
        return "bg-warning/10";
      default:
        return "bg-accent/10";
    }
  };

  const getGeoFenceColor = (geoFence: GeoFence) => {
    // Use risk level if available, otherwise fall back to type-based colors
    if (geoFence.riskLevel) {
      switch (geoFence.riskLevel) {
        case "low":
          return { color: "#22c55e", fillColor: "#22c55e", fillOpacity: 0.2 }; // Green
        case "medium":
          return { color: "#fbbf24", fillColor: "#fbbf24", fillOpacity: 0.2 }; // Yellow/Orange
        case "high":
          return { color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.2 }; // Red
        case "critical":
          return { color: "#9333ea", fillColor: "#9333ea", fillOpacity: 0.2 }; // Purple
      }
    }

    // Fallback to type-based colors for backward compatibility
    switch (geoFence.type) {
      case "safe_zone":
      case "tourist_zone":
        return { color: "#22c55e", fillColor: "#22c55e", fillOpacity: 0.2 }; // Green
      case "alert_zone":
        return { color: "#fbbf24", fillColor: "#fbbf24", fillOpacity: 0.2 }; // Yellow/Orange
      case "restricted_zone":
      case "restricted_area":
      case "danger_zone":
        return { color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.2 }; // Red
      case "emergency_zone":
        return { color: "#9333ea", fillColor: "#9333ea", fillOpacity: 0.2 }; // Purple
      default:
        return { color: "#9ca3af", fillColor: "#9ca3af", fillOpacity: 0.2 }; // Gray
    }
  };

  return (
    <div className="h-full w-full bg-card rounded-lg shadow-elegant overflow-hidden border">
      <div className="h-12 bg-gradient-hero flex items-center px-4 border-b">
        <h3 className="text-primary-foreground font-semibold">
          Live Tourist Tracking & Risk Zones
        </h3>
        <div className="ml-auto flex items-center space-x-3">
          {/* Tourist Status Legend */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-primary-foreground text-xs">Normal</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-primary-foreground text-xs">Alert</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-destructive rounded-full"></div>
              <span className="text-primary-foreground text-xs">Danger</span>
            </div>
          </div>

          {/* Zone Risk Legend */}
          <div className="border-l border-primary-foreground/30 pl-3 flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22c55e" }}></div>
              <span className="text-primary-foreground text-xs">Low</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#fbbf24" }}></div>
              <span className="text-primary-foreground text-xs">Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ef4444" }}></div>
              <span className="text-primary-foreground text-xs">High</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#9333ea" }}></div>
              <span className="text-primary-foreground text-xs">Critical</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[calc(100%-3rem)]">
        <MapContainer
          center={[26.9124, 75.7873]}
          zoom={11}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer attribution={tileLayerAttribution} url={tileLayerUrl} />

          {/* Render geo-fences */}
          {geoFences.map((geoFence) => {
            const colors = getGeoFenceColor(geoFence);

            if (geoFence.geometry.type === "Circle") {
              // coordinates for circle is [longitude, latitude]
              const coords = geoFence.geometry.coordinates as number[];
              const longitude = coords[0];
              const latitude = coords[1];
              const center: [number, number] = [latitude, longitude];

              return (
                <Circle
                  key={geoFence._id}
                  center={center}
                  radius={geoFence.geometry.radius || 1000}
                  pathOptions={colors}
                  weight={2}
                >
                  <Popup>
                    <div className="p-2 space-y-2 min-w-[180px]">
                      <div className="border-b border-border pb-2">
                        <p className="font-semibold text-foreground">
                          {geoFence.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {geoFence.type.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        {geoFence.riskLevel && (
                          <p className="text-sm">
                            <span className="font-medium">Risk Level:</span>
                            <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium"
                                  style={{ backgroundColor: colors.fillColor + '40', color: colors.color }}>
                              {geoFence.riskLevel.toUpperCase()}
                            </span>
                          </p>
                        )}
                        <p className="text-sm">
                          <span className="font-medium">Radius:</span> {geoFence.geometry.radius}m
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Circle>
              );
            } else if (geoFence.geometry.type === "Polygon") {
              const coords = geoFence.geometry.coordinates as number[][];
              const positions: [number, number][] = coords.map((coord) => [coord[1], coord[0]]);

              return (
                <Polygon
                  key={geoFence._id}
                  positions={positions}
                  pathOptions={colors}
                  weight={2}
                >
                  <Popup>
                    <div className="p-2 space-y-2 min-w-[180px]">
                      <div className="border-b border-border pb-2">
                        <p className="font-semibold text-foreground">
                          {geoFence.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {geoFence.type.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        {geoFence.riskLevel && (
                          <p className="text-sm">
                            <span className="font-medium">Risk Level:</span>
                            <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium"
                                  style={{ backgroundColor: colors.fillColor + '40', color: colors.color }}>
                              {geoFence.riskLevel.toUpperCase()}
                            </span>
                          </p>
                        )}
                        <p className="text-sm">
                          <span className="font-medium">Area:</span> Polygon Zone
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              );
            }

            return null;
          })}

          {/* Render tourists */}
          {tourists.map(
            (tourist) =>
              tourist.lastLocation && (
                <Marker
                  key={tourist._id}
                  position={[
                    tourist.lastLocation.lat,
                    tourist.lastLocation.lng,
                  ]}
                  icon={
                    tourist.safetyStatus === "danger" ? alertIcon : defaultIcon
                  }
                >
                  <Popup className="custom-popup">
                    <div className="p-2 space-y-2 min-w-[200px]">
                      <div className="border-b border-border pb-2">
                        <p className="font-semibold text-foreground">
                          {tourist.kyc?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ID: {tourist.digitalId}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Status:</span>
                          <span
                            className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(
                              tourist.safetyStatus
                            )} ${getStatusColor(tourist.safetyStatus)}`}
                          >
                            {tourist.safetyStatus.toUpperCase()}
                          </span>
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Nationality:</span>{" "}
                          {tourist.kyc?.nationality}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Location:</span>
                          <span className="text-muted-foreground ml-1">
                            {tourist.lastLocation.lat.toFixed(4)},{" "}
                            {tourist.lastLocation.lng.toFixed(4)}
                          </span>
                        </p>
                        {/* Google Maps Link for tourists in danger */}
                        {tourist.safetyStatus === "danger" && (
                          <div className="mt-2 pt-2 border-t">
                            <a
                              href={`https://www.google.com/maps?q=${tourist.lastLocation.lat},${tourist.lastLocation.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs underline font-medium"
                            >
                              🚨 View Emergency Location on Google Maps
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>
    </div>
  );
}
