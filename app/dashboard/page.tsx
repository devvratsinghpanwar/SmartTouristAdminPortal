import { Suspense, lazy } from "react";
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
  // Mock data for stats
  const stats = [
    {
      name: "Active Tourists",
      stat: "71,897",
      icon: Users,
      change: "+12.5%",
      changeType: "positive",
    },
    {
      name: "Active Alerts",
      stat: "3",
      icon: ShieldAlert,
      change: "-2 from yesterday",
      changeType: "negative",
    },
    {
      name: "High-Risk Zones",
      stat: "5",
      icon: MapPin,
      change: "No change",
      changeType: "neutral",
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: "Panic Button",
      severity: "danger",
      message: "SOS signal from TID-9c8e1... near Amer Fort area",
      time: "5 min ago",
      location: "Amer Fort, Jaipur",
      icon: AlertTriangle,
    },
    {
      id: 2,
      type: "Geo-Fence Breach",
      severity: "warning",
      message: "Tourist TID-f4a2b... entered restricted wildlife zone",
      time: "12 min ago",
      location: "Ranthambore National Park",
      icon: MapPin,
    },
    {
      id: 3,
      type: "Itinerary Deviation",
      severity: "info",
      message: "TID-a1b2c... is 15km off planned trekking route",
      time: "28 min ago",
      location: "Udaipur Hills",
      icon: Clock,
    },
    {
      id: 4,
      type: "Medical Alert",
      severity: "warning",
      message: "Tourist requested medical assistance via app",
      time: "45 min ago",
      location: "City Palace, Udaipur",
      icon: ShieldAlert,
    },
    {
      id: 5,
      type: "Weather Advisory",
      severity: "info",
      message: "Heavy rain warning issued for current tourist locations",
      time: "1 hr ago",
      location: "Jaisalmer Region",
      icon: TrendingUp,
    },
  ];

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
          {stats.map((item) => (
            <Card
              key={item.name}
              className="shadow-card hover:shadow-elegant transition-shadow"
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
          ))}
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
