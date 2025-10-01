'use client';

import { useState, useEffect } from 'react';
import { withAuth } from '../contexts/AuthContext';
import { MapPin, Plus, Edit, Trash2, AlertTriangle, Shield, Eye, EyeOff } from 'lucide-react';

interface GeoFence {
  _id: string;
  name: string;
  geometry: {
    type: 'Circle' | 'Polygon';
    coordinates: number[] | number[][];
    radius?: number;
  };
  type: 'safe_zone' | 'danger_zone' | 'restricted_area' | 'tourist_zone';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  category: 'crime' | 'natural_disaster' | 'health' | 'construction' | 'political' | 'general';
  description?: string;
  isActive: boolean;
  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

function HighRiskZonesPage() {
  const [zones, setZones] = useState<GeoFence[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingZone, setEditingZone] = useState<GeoFence | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'danger_zone' as 'safe_zone' | 'danger_zone' | 'restricted_area' | 'tourist_zone',
    riskLevel: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    category: 'general' as 'crime' | 'natural_disaster' | 'health' | 'construction' | 'political' | 'general',
    description: '',
    coordinates: {
      latitude: 26.9124,
      longitude: 75.7873
    },
    radius: 1000
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchZones = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/geofences', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        // Handle the correct API response structure and ensure it's an array
        const zonesArray = Array.isArray(data.data?.geoFences) ? data.data.geoFences : 
                          Array.isArray(data.geoFences) ? data.geoFences :
                          Array.isArray(data) ? data : [];
        setZones(zonesArray);
      } else {
        console.error('API returned error:', data);
        setZones([]);
      }
    } catch (error) {
      console.error('Error fetching zones:', error);
      setZones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const payload = {
      name: formData.name,
      geometry: {
        type: 'Circle',
        coordinates: [formData.coordinates.longitude, formData.coordinates.latitude],
        radius: formData.radius
      },
      type: formData.type,
      riskLevel: formData.riskLevel,
      category: formData.category,
      description: formData.description,
      isActive: true
    };

    try {
      const url = editingZone 
        ? `http://localhost:4000/api/geofences/${editingZone._id}`
        : 'http://localhost:4000/api/geofences';
      
      const response = await fetch(url, {
        method: editingZone ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(editingZone ? 'Zone updated successfully!' : 'Zone created successfully!');
        setShowCreateForm(false);
        setEditingZone(null);
        setFormData({
          name: '',
          type: 'danger_zone',
          riskLevel: 'medium',
          category: 'general',
          description: '',
          coordinates: {
            latitude: 26.9124,
            longitude: 75.7873
          },
          radius: 1000
        });
        fetchZones();
      } else {
        setError(data.message || 'Failed to save zone');
      }
    } catch (error) {
      console.error('Error saving zone:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (zone: GeoFence) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      type: zone.type,
      riskLevel: zone.riskLevel,
      category: zone.category,
      description: zone.description || '',
      coordinates: {
        latitude: zone.geometry?.coordinates && Array.isArray(zone.geometry.coordinates[0]) 
          ? (zone.geometry.coordinates as number[][])[0][1] 
          : zone.geometry?.coordinates
          ? (zone.geometry.coordinates as number[])[1] || 0
          : 26.9124,
        longitude: zone.geometry?.coordinates && Array.isArray(zone.geometry.coordinates[0]) 
          ? (zone.geometry.coordinates as number[][])[0][0] 
          : zone.geometry?.coordinates
          ? (zone.geometry.coordinates as number[])[0] || 0
          : 75.7873
      },
      radius: zone.geometry?.radius || 1000
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (zoneId: string) => {
    if (!confirm('Are you sure you want to delete this zone?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/geofences/${zoneId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Zone deleted successfully!');
        fetchZones();
      } else {
        setError(data.message || 'Failed to delete zone');
      }
    } catch (error) {
      console.error('Error deleting zone:', error);
      setError('Network error. Please try again.');
    }
  };

  const toggleZoneStatus = async (zoneId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:4000/api/geofences/${zoneId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Zone ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
        fetchZones();
      } else {
        setError(data.message || 'Failed to update zone status');
      }
    } catch (error) {
      console.error('Error updating zone status:', error);
      setError('Network error. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'coordinates') {
        setFormData(prev => ({
          ...prev,
          coordinates: {
            ...prev.coordinates,
            [child]: parseFloat(value) || 0
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'radius' ? parseInt(value) || 0 : value
      }));
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'danger_zone': return 'bg-red-100 text-red-800';
      case 'restricted_area': return 'bg-orange-100 text-orange-800';
      case 'safe_zone': return 'bg-green-100 text-green-800';
      case 'tourist_zone': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">High-Risk Zone Management</h1>
              <p className="text-gray-600">Create, edit, and manage geo-fenced zones for tourist safety</p>
            </div>
            <button
              onClick={() => {
                setShowCreateForm(true);
                setEditingZone(null);
                setFormData({
                  name: '',
                  type: 'danger_zone',
                  riskLevel: 'medium',
                  category: 'general',
                  description: '',
                  coordinates: {
                    latitude: 26.9124,
                    longitude: 75.7873
                  },
                  radius: 1000
                });
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Zone
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Zones List */}
          <div className="xl:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Existing Zones ({zones.length})</h2>
              </div>

              {zones.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No zones found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Create your first high-risk zone to get started.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {Array.isArray(zones) && zones.map((zone) => {
                    // Safety check to ensure zone has required properties
                    if (!zone || typeof zone !== 'object' || !zone._id) {
                      return null;
                    }
                    
                    return (
                    <div key={zone._id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{zone.name || 'Unnamed Zone'}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(zone.type || 'general')}`}>
                              {(zone.type || 'general').replace('_', ' ').toUpperCase()}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(zone.riskLevel || 'medium')}`}>
                              {(zone.riskLevel || 'medium').toUpperCase()}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(zone.isActive ?? true) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {(zone.isActive ?? true) ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </div>
                          
                          {zone.description && (
                            <p className="text-sm text-gray-600 mb-2">{zone.description}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {zone.geometry?.coordinates && Array.isArray(zone.geometry.coordinates[0]) 
                                  ? `${(zone.geometry.coordinates as number[][])[0][1]}, ${(zone.geometry.coordinates as number[][])[0][0]}`
                                  : zone.geometry?.coordinates
                                  ? `${(zone.geometry.coordinates as number[])[1] || 0}, ${(zone.geometry.coordinates as number[])[0] || 0}`
                                  : 'No coordinates'
                                }
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Shield className="h-4 w-4" />
                              <span>{zone.geometry?.radius || 1000}m radius</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="h-4 w-4" />
                              <span>{zone.category || 'general'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleZoneStatus(zone._id, zone.isActive ?? true)}
                            className={`p-2 rounded-md ${(zone.isActive ?? true) ? 'text-gray-600 hover:text-gray-800' : 'text-green-600 hover:text-green-800'}`}
                            title={(zone.isActive ?? true) ? 'Deactivate zone' : 'Activate zone'}
                          >
                            {(zone.isActive ?? true) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleEdit(zone)}
                            className="p-2 text-blue-600 hover:text-blue-800 rounded-md"
                            title="Edit zone"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(zone._id)}
                            className="p-2 text-red-600 hover:text-red-800 rounded-md"
                            title="Delete zone"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="xl:col-span-1">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingZone ? 'Edit Zone' : 'Create New Zone'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingZone(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Zone Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="High Crime Area - City Center"
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Zone Type *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="danger_zone">Danger Zone</option>
                      <option value="restricted_area">Restricted Area</option>
                      <option value="safe_zone">Safe Zone</option>
                      <option value="tourist_zone">Tourist Zone</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="riskLevel" className="block text-sm font-medium text-gray-700 mb-1">
                      Risk Level *
                    </label>
                    <select
                      id="riskLevel"
                      name="riskLevel"
                      value={formData.riskLevel}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="general">General</option>
                      <option value="crime">Crime</option>
                      <option value="natural_disaster">Natural Disaster</option>
                      <option value="health">Health</option>
                      <option value="construction">Construction</option>
                      <option value="political">Political</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="coordinates.latitude" className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude *
                      </label>
                      <input
                        type="number"
                        id="coordinates.latitude"
                        name="coordinates.latitude"
                        value={formData.coordinates.latitude}
                        onChange={handleChange}
                        required
                        step="0.000001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="coordinates.longitude" className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude *
                      </label>
                      <input
                        type="number"
                        id="coordinates.longitude"
                        name="coordinates.longitude"
                        value={formData.coordinates.longitude}
                        onChange={handleChange}
                        required
                        step="0.000001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
                      Radius (meters) *
                    </label>
                    <input
                      type="number"
                      id="radius"
                      name="radius"
                      value={formData.radius}
                      onChange={handleChange}
                      required
                      min="100"
                      max="50000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Additional details about this zone..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : editingZone ? 'Update Zone' : 'Create Zone'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(HighRiskZonesPage, ['canManageGeoFences']);
