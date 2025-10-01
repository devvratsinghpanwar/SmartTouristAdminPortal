'use client';

import { useState, useEffect } from 'react';
import { withAuth } from '../contexts/AuthContext';
import { AlertTriangle, Clock, CheckCircle, XCircle, Eye, MapPin, User } from 'lucide-react';

interface Alert {
  _id: string;
  touristId: string;
  type: 'distress' | 'emergency' | 'safety_concern' | 'medical' | 'security';
  status: 'active' | 'acknowledged' | 'resolved' | 'false_alarm';
  priority: 'low' | 'medium' | 'high' | 'critical';
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  message?: string;
  timeline: {
    createdAt: Date;
    acknowledgedAt?: Date;
    resolvedAt?: Date;
    updatedAt: Date;
    createdBy?: string;
    acknowledgedBy?: string;
    resolvedBy?: string;
  };
  metadata?: {
    deviceInfo?: any;
    networkInfo?: any;
    batteryLevel?: number;
  };
}

function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/dashboard/alerts', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        // Handle the correct API response structure and ensure it's an array
        const alertsArray = Array.isArray(data.data?.alerts) ? data.data.alerts : 
                           Array.isArray(data.alerts) ? data.alerts :
                           Array.isArray(data) ? data : [];
        setAlerts(alertsArray);
      } else {
        console.error('API returned error:', data);
        setAlerts([]);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateAlertStatus = async (alertId: string, status: string, notes?: string) => {
    setUpdating(alertId);
    try {
      const response = await fetch(`http://localhost:4000/api/dashboard/alerts/${alertId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status, notes }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh alerts
        fetchAlerts();
        setSelectedAlert(null);
      } else {
        alert('Failed to update alert: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating alert:', error);
      alert('Error updating alert');
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Set up polling for real-time updates
    const interval = setInterval(fetchAlerts, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredAlerts = Array.isArray(alerts) ? alerts.filter(alert => {
    if (!alert || typeof alert !== 'object') return false;
    if (filter === 'all') return true;
    return (alert.status || 'active') === filter;
  }) : [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-100';
      case 'acknowledged': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'false_alarm': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alert Management</h1>
          <p className="text-gray-600">Monitor and manage tourist safety alerts</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Alerts', count: Array.isArray(alerts) ? alerts.length : 0 },
                { key: 'active', label: 'Active', count: Array.isArray(alerts) ? alerts.filter(a => (a?.status || 'active') === 'active').length : 0 },
                { key: 'acknowledged', label: 'Acknowledged', count: Array.isArray(alerts) ? alerts.filter(a => (a?.status || 'active') === 'acknowledged').length : 0 },
                { key: 'resolved', label: 'Resolved', count: Array.isArray(alerts) ? alerts.filter(a => (a?.status || 'active') === 'resolved').length : 0 },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Alerts List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' ? 'No alerts have been created yet.' : `No ${filter} alerts found.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {Array.isArray(filteredAlerts) && filteredAlerts.map((alert) => {
                // Safety check to ensure alert has required properties
                if (!alert || typeof alert !== 'object' || !alert._id) {
                  return null;
                }
                
                return (
                <div key={alert._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                                                <AlertTriangle className={`h-8 w-8 ${getPriorityColor(alert.priority || 'medium').split(' ')[0]}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(alert.priority || 'medium')}`}>
                            {(alert.priority || 'medium').toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.status || 'active')}`}>
                            {(alert.status || 'active').replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {(alert.type || 'general').replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>Tourist: {alert.touristId || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{alert.location?.address || (alert.location ? `${alert.location.latitude || 0}, ${alert.location.longitude || 0}` : 'Unknown location')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{alert.timeline?.createdAt ? new Date(alert.timeline.createdAt).toLocaleString() : 'Unknown time'}</span>
                          </div>
                        </div>
                        {alert.message && (
                          <p className="mt-2 text-sm text-gray-700">{alert.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                      {(alert.status || 'active') === 'active' && (
                        <button
                          onClick={() => updateAlertStatus(alert._id, 'acknowledged')}
                          disabled={updating === alert._id}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                        >
                          {updating === alert._id ? 'Updating...' : 'Acknowledge'}
                        </button>
                      )}
                      {((alert.status || 'active') === 'active' || (alert.status || 'active') === 'acknowledged') && (
                        <>
                          <button
                            onClick={() => updateAlertStatus(alert._id, 'resolved')}
                            disabled={updating === alert._id}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {updating === alert._id ? 'Updating...' : 'Resolve'}
                          </button>
                          <button
                            onClick={() => updateAlertStatus(alert._id, 'false_alarm')}
                            disabled={updating === alert._id}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            {updating === alert._id ? 'Updating...' : 'False Alarm'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Alert Detail Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Alert Details</h3>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tourist ID</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAlert.touristId || 'Unknown'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Alert Type</label>
                      <p className="mt-1 text-sm text-gray-900">{(selectedAlert.type || 'general').replace('_', ' ').toUpperCase()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Priority</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedAlert.priority || 'medium')}`}>
                        {(selectedAlert.priority || 'medium').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAlert.status || 'active')}`}>
                        {(selectedAlert.status || 'active').replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedAlert.location?.address || (selectedAlert.location ? `${selectedAlert.location.latitude || 0}, ${selectedAlert.location.longitude || 0}` : 'Unknown location')}
                    </p>
                  </div>

                  {selectedAlert.message && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Message</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAlert.message}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timeline</label>
                    <div className="mt-1 space-y-2">
                      <div className="text-sm text-gray-600">
                        <strong>Created:</strong> {selectedAlert.timeline?.createdAt ? new Date(selectedAlert.timeline.createdAt).toLocaleString() : 'Unknown time'}
                      </div>
                      {selectedAlert.timeline?.acknowledgedAt && (
                        <div className="text-sm text-gray-600">
                          <strong>Acknowledged:</strong> {new Date(selectedAlert.timeline.acknowledgedAt).toLocaleString()}
                        </div>
                      )}
                      {selectedAlert.timeline?.resolvedAt && (
                        <div className="text-sm text-gray-600">
                          <strong>Resolved:</strong> {new Date(selectedAlert.timeline.resolvedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    {(selectedAlert.status || 'active') === 'active' && (
                      <button
                        onClick={() => updateAlertStatus(selectedAlert._id, 'acknowledged')}
                        disabled={updating === selectedAlert._id}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
                      >
                        {updating === selectedAlert._id ? 'Updating...' : 'Acknowledge'}
                      </button>
                    )}
                    {((selectedAlert.status || 'active') === 'active' || (selectedAlert.status || 'active') === 'acknowledged') && (
                      <>
                        <button
                          onClick={() => updateAlertStatus(selectedAlert._id, 'resolved')}
                          disabled={updating === selectedAlert._id}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                          {updating === selectedAlert._id ? 'Updating...' : 'Resolve'}
                        </button>
                        <button
                          onClick={() => updateAlertStatus(selectedAlert._id, 'false_alarm')}
                          disabled={updating === selectedAlert._id}
                          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
                        >
                          {updating === selectedAlert._id ? 'Updating...' : 'False Alarm'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(AlertsPage, ['canViewAlerts']);
