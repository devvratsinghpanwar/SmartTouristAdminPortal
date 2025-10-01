'use client';

import { useState, useEffect } from 'react';
import { withAuth } from '../contexts/AuthContext';
import { Send, MapPin, Clock, Users, AlertTriangle, Info, Shield, Cloud } from 'lucide-react';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'advisory' | 'warning' | 'emergency' | 'info';
  category: 'weather' | 'security' | 'health' | 'transport' | 'general';
  location: {
    city: string;
    coordinates: [number, number];
    radius: number;
  };
  recipientCount: number;
  deliveryStats: {
    sent: number;
    delivered: number;
    failed: number;
  };
  expiresAt: Date;
  createdAt: Date;
  createdBy: string;
}

function NotificationsPage() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'advisory' as 'advisory' | 'warning' | 'emergency' | 'info',
    category: 'general' as 'weather' | 'security' | 'health' | 'transport' | 'general',
    location: {
      city: '',
      coordinates: [0, 0] as [number, number],
      radius: 100
    },
    expiresIn: 24 // hours
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recipientCount, setRecipientCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/notifications', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:4000/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          expiresAt: new Date(Date.now() + formData.expiresIn * 60 * 60 * 1000)
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Notification sent successfully to ${data.recipientCount} tourists!`);
        setFormData({
          title: '',
          message: '',
          type: 'advisory',
          category: 'general',
          location: {
            city: '',
            coordinates: [0, 0],
            radius: 100
          },
          expiresIn: 24
        });
        setRecipientCount(0);
        fetchNotifications();
      } else {
        setError(data.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'location') {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            [child]: child === 'radius' ? parseInt(value) || 0 : value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'expiresIn' ? parseInt(value) || 24 : value
      }));
    }
  };

  // Mock function to get coordinates from city name (in real app, use geocoding API)
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const city = e.target.value;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        city,
        // Mock coordinates for common cities
        coordinates: city.toLowerCase() === 'jaipur' ? [26.9124, 75.7873] :
                    city.toLowerCase() === 'delhi' ? [28.6139, 77.2090] :
                    city.toLowerCase() === 'mumbai' ? [19.0760, 72.8777] :
                    city.toLowerCase() === 'bangalore' ? [12.9716, 77.5946] :
                    [0, 0]
      }
    }));

    // Mock recipient count calculation
    if (city) {
      setRecipientCount(Math.floor(Math.random() * 50) + 10);
    } else {
      setRecipientCount(0);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning': return <Shield className="h-5 w-5 text-orange-600" />;
      case 'advisory': return <Info className="h-5 w-5 text-blue-600" />;
      default: return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weather': return <Cloud className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'health': return <AlertTriangle className="h-4 w-4" />;
      case 'transport': return <MapPin className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
      case 'advisory': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Broadcasting</h1>
          <p className="text-gray-600">Send location-based notifications and advisories to tourists</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Send Notification Form */}
          <div className="xl:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Send className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Send New Notification</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {success}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Heavy Rain Alert"
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="info">Info</option>
                      <option value="advisory">Advisory</option>
                      <option value="warning">Warning</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="general">General</option>
                      <option value="weather">Weather</option>
                      <option value="security">Security</option>
                      <option value="health">Health</option>
                      <option value="transport">Transport</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="expiresIn" className="block text-sm font-medium text-gray-700 mb-2">
                      Expires In (hours) *
                    </label>
                    <input
                      type="number"
                      id="expiresIn"
                      name="expiresIn"
                      value={formData.expiresIn}
                      onChange={handleChange}
                      required
                      min="1"
                      max="168"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Heavy rainfall expected in Jaipur area. Please stay indoors and avoid unnecessary travel."
                  />
                </div>

                {/* Location Settings */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Location Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="location.city" className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="location.city"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleCityChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Jaipur, Delhi, Mumbai, Bangalore"
                      />
                    </div>

                    <div>
                      <label htmlFor="location.radius" className="block text-sm font-medium text-gray-700 mb-2">
                        Radius (km) *
                      </label>
                      <input
                        type="number"
                        id="location.radius"
                        name="location.radius"
                        value={formData.location.radius}
                        onChange={handleChange}
                        required
                        min="1"
                        max="500"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {formData.location.coordinates[0] !== 0 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm text-blue-800">
                        <MapPin className="h-4 w-4" />
                        <span>
                          Coordinates: {formData.location.coordinates[1]}, {formData.location.coordinates[0]}
                        </span>
                      </div>
                    </div>
                  )}

                  {recipientCount > 0 && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm text-green-800">
                        <Users className="h-4 w-4" />
                        <span>Estimated recipients: {recipientCount} tourists</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading || !formData.location.city}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    {isLoading ? 'Sending...' : 'Send Notification'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="xl:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
              
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Send className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Send your first notification to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.slice(0, 5).map((notification) => (
                    <div key={notification._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(notification.type)}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                            {notification.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          {getCategoryIcon(notification.category)}
                          <span>{notification.category}</span>
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-1">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{notification.message}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{notification.location.city}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{notification.recipientCount}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(notification.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(NotificationsPage, ['canSendNotifications']);
