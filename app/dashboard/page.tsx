"use client";

import { Suspense, lazy, useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Bell,
  Users,
  MapPin,
  AlertTriangle,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Lazy load the map component to avoid SSR issues with Leaflet
const DashboardMap = lazy(
  () => import("@/app/components/DashboardMapComponent")
);

export default function Dashboard() {
  const [stats, setStats] = useState([
    {
      name: "Active Tourists",
      stat: "Loading...",
      icon: Users,
      change: "Loading...",
      changeType: "neutral",
    },
    {
      name: "Active Alerts",
      stat: "Loading...",
      icon: ShieldAlert,
      change: "Loading...",
      changeType: "neutral",
    },
    {
      name: "High-Risk Zones",
      stat: "Loading...",
      icon: MapPin,
      change: "Loading...",
      changeType: "neutral",
    },
  ]);

  type Alert = {
    id: string;
    type: string;
    severity: string;
    message: string;
    time: string;
    location: string;
    icon: React.ComponentType<{ className?: string }>;
    isResolved: boolean;
    touristId?: string;
  };

  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const statsResponse = await fetch('http://localhost:4000/api/dashboard/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats([
            {
              name: "Active Tourists",
              stat: statsData.activeTourists.count.toString(),
              icon: Users,
              change: statsData.activeTourists.change,
              changeType: statsData.activeTourists.changeType,
            },
            {
              name: "Active Alerts",
              stat: statsData.activeAlerts.count.toString(),
              icon: ShieldAlert,
              change: statsData.activeAlerts.change,
              changeType: statsData.activeAlerts.changeType,
            },
            {
              name: "High-Risk Zones",
              stat: statsData.highRiskZones.count.toString(),
              icon: MapPin,
              change: statsData.highRiskZones.change,
              changeType: statsData.highRiskZones.changeType,
            },
          ]);
        }

        // Fetch alerts
        const alertsResponse = await fetch('http://localhost:4000/api/dashboard/alerts?limit=10', {
          credentials: 'include'
        });
        if (alertsResponse.ok) {
          const alertsData = await alertsResponse.json();

          // Handle the new API response structure
          const alerts = alertsData.success ? alertsData.data.alerts : (Array.isArray(alertsData) ? alertsData : []);
          const transformedAlerts = alerts.map((alert: any) => ({
            id: alert._id || alert.id,
            type: alert.type || 'Unknown',
            severity: alert.priority || alert.severity || 'medium',
            message: alert.message || 'No message',
            time: alert.timeline?.createdAt ? new Date(alert.timeline.createdAt).toLocaleString() : 'Unknown time',
            location: alert.location?.address || `${alert.location?.latitude || 0}, ${alert.location?.longitude || 0}`,
            icon: getAlertIcon(alert.type || 'distress'),
            isResolved: alert.status === 'resolved',
            touristId: alert.touristId
          }));
          setRecentAlerts(transformedAlerts);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Helper function to get appropriate icon for alert type
  const getAlertIcon = (type: string) => {
    if (type.includes('Emergency') || type.includes('Panic')) return AlertTriangle;
    if (type.includes('Geo-Fence')) return MapPin;
    if (type.includes('Medical')) return ShieldAlert;
    return Clock;
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "danger":
        return "border-l-destructive bg-destructive/5";
      case "warning":
        return "border-l-warning bg-warning/5";
      default:
        return "border-l-primary bg-primary/5";
    }
  };

  const getSeverityTextStyles = (severity: string) => {
    switch (severity) {
      case "danger":
        return "text-destructive";
      case "warning":
        return "text-warning";
      default:
        return "text-primary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero border-b">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">
                Authorities Dashboard
              </h1>
              <p className="mt-2 text-primary-foreground/80">
                Real-time tourist monitoring, cluster visualization, and alert
                management
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant="secondary"
                className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20"
              >
                <Bell className="w-4 h-4 mr-2" />3 Active Alerts
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          {stats.map((item) => {
            const isClickable = item.name === "Active Alerts" || item.name === "High-Risk Zones";
            const href = item.name === "Active Alerts" ? "/alerts" :
                        item.name === "High-Risk Zones" ? "/high-risk-zones" : "";

            if (isClickable) {
              return (
                <Link key={item.name} href={href}>
                  <Card className="shadow-card hover:shadow-elegant transition-shadow cursor-pointer hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {item.name}
                          </p>
                          <p className="text-2xl font-bold">{item.stat}</p>
                          <p className={`text-xs ${item.changeType === "positive" ? "text-green-600" : item.changeType === "negative" ? "text-red-600" : "text-gray-600"}`}>
                            {item.change}
                          </p>
                        </div>
                        <item.icon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            }

            return (
              <div key={item.name}>
                <Card
                  className={`shadow-card hover:shadow-elegant transition-shadow ${
                    (item.name === "Active Alerts" || item.name === "High-Risk Zones") ? "cursor-pointer hover:scale-105" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {item.name}
                        </p>
                        <p className="text-3xl font-bold text-foreground mt-2">
                          {item.stat}
                        </p>
                        <p
                          className={`text-xs mt-2 ${
                            item.changeType === "positive"
                              ? "text-accent"
                              : item.changeType === "negative"
                              ? "text-destructive"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.change}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-feature rounded-lg flex items-center justify-center">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 h-[70vh]">
          {/* Map Section - Takes up more space and fixed on left */}
          <div className="xl:col-span-3 h-full">
            <Suspense
              fallback={
                <Card className="h-full">
                  <CardContent className="h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-muted-foreground">Loading Map...</p>
                    </div>
                  </CardContent>
                </Card>
              }
            >
              <DashboardMap />
            </Suspense>
          </div>

          {/* Alerts & Incidents Section - Scrollable on right */}
          <div className="xl:col-span-2 h-full">
            <Card className="h-full flex flex-col shadow-elegant">
              <CardHeader className="border-b bg-gradient-feature">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-foreground">Alerts & Incidents</span>
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Real-time safety alerts and incident reports
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden p-0">
                <div className="h-full overflow-y-auto p-4 space-y-3">
                  {recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 border-l-4 rounded-r-lg ${getSeverityStyles(
                        alert.severity
                      )} hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <alert.icon
                            className={`w-4 h-4 ${getSeverityTextStyles(
                              alert.severity
                            )}`}
                          />
                          <h4
                            className={`font-semibold ${getSeverityTextStyles(
                              alert.severity
                            )}`}
                          >
                            {alert.type}
                          </h4>
                        </div>
                        <Badge
                          variant={
                            alert.severity === "danger"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {alert.severity}
                        </Badge>
                      </div>

                      <p className="text-sm text-foreground mb-2">
                        {alert.message}
                      </p>

                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {alert.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {alert.time}
                        </span>
                      </div>

                      {/* Emergency Google Maps Link for critical alerts */}
                      {((alert as any).severity === "critical" || (alert as any).severity === "danger") && (alert as any).location && (
                        <div className="mt-2 pt-2 border-t">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((alert as any).location)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-800 text-xs underline font-medium flex items-center gap-1"
                          >
                            🚨 Emergency Location - View on Google Maps
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
