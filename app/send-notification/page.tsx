"use client";

import { useState } from 'react';
import { useAuth, withAuth } from '../contexts/AuthContext';
import { Bell, Send, AlertTriangle, Info, Shield, Zap } from 'lucide-react';

interface NotificationForm {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'emergency' | 'advisory';
  category: 'weather' | 'security' | 'health' | 'transport' | 'general';
  targetLocation: {
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    radius: number;
  };
  expiresIn: number; // hours
}

function SendNotificationPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<NotificationForm>({
    title: '',
    message: '',
    type: 'info',
    category: 'general',
    targetLocation: {
      city: 'Jaipur',
      coordinates: {
        latitude: 26.9124,
        longitude: 75.7873
      },
      radius: 5
    },
    expiresIn: 24
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const cities = [
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Kota', lat: 25.2138, lng: 75.8648 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
    { name: 'Surat', lat: 21.1702, lng: 72.8311 },
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
    { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
    { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
    { name: 'Indore', lat: 22.7196, lng: 75.8577 },
    { name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
    { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
    { name: 'Patna', lat: 25.5941, lng: 85.1376 },
    { name: 'Vadodara', lat: 22.3072, lng: 73.1812 },
    { name: 'Ghaziabad', lat: 28.6692, lng: 77.4538 },
    { name: 'Ludhiana', lat: 30.9010, lng: 75.8573 },
    { name: 'Agra', lat: 27.1767, lng: 78.0081 },
    { name: 'Nashik', lat: 19.9975, lng: 73.7898 },
    { name: 'Faridabad', lat: 28.4089, lng: 77.3178 },
    { name: 'Meerut', lat: 28.9845, lng: 77.7064 },
    { name: 'Rajkot', lat: 22.3039, lng: 70.8022 },
    { name: 'Kalyan-Dombivali', lat: 19.2403, lng: 73.1305 },
    { name: 'Vasai-Virar', lat: 19.4914, lng: 72.8054 },
    { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
    { name: 'Srinagar', lat: 34.0837, lng: 74.7973 },
    { name: 'Aurangabad', lat: 19.8762, lng: 75.3433 },
    { name: 'Dhanbad', lat: 23.7957, lng: 86.4304 },
    { name: 'Amritsar', lat: 31.6340, lng: 74.8723 },
    { name: 'Navi Mumbai', lat: 19.0330, lng: 73.0297 },
    { name: 'Allahabad', lat: 25.4358, lng: 81.8463 },
    { name: 'Ranchi', lat: 23.3441, lng: 85.3096 },
    { name: 'Howrah', lat: 22.5958, lng: 88.2636 },
    { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
    { name: 'Jabalpur', lat: 23.1815, lng: 79.9864 },
    { name: 'Gwalior', lat: 26.2183, lng: 78.1828 },
    { name: 'Vijayawada', lat: 16.5062, lng: 80.6480 },
    { name: 'Jodhpur', lat: 26.2389, lng: 73.0243 },
    { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
    { name: 'Raipur', lat: 21.2514, lng: 81.6296 },
    { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
    { name: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
    { name: 'Gurgaon', lat: 28.4595, lng: 77.0266 },
    { name: 'Solapur', lat: 17.6599, lng: 75.9064 },
    { name: 'Hubli-Dharwad', lat: 15.3647, lng: 75.1240 },
    { name: 'Bareilly', lat: 28.3670, lng: 79.4304 },
    { name: 'Moradabad', lat: 28.8386, lng: 78.7733 },
    { name: 'Mysore', lat: 12.2958, lng: 76.6394 },
    { name: 'Gurgaon', lat: 28.4595, lng: 77.0266 },
    { name: 'Aligarh', lat: 27.8974, lng: 78.0880 },
    { name: 'Jalandhar', lat: 31.3260, lng: 75.5762 },
    { name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047 },
    { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
    { name: 'Salem', lat: 11.6643, lng: 78.1460 },
    { name: 'Warangal', lat: 17.9689, lng: 79.5941 },
    { name: 'Mira-Bhayandar', lat: 19.2952, lng: 72.8544 },
    { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
    { name: 'Bhiwandi', lat: 19.3002, lng: 73.0635 },
    { name: 'Saharanpur', lat: 29.9680, lng: 77.5552 },
    { name: 'Guntur', lat: 16.3067, lng: 80.4365 },
    { name: 'Bikaner', lat: 28.0229, lng: 73.3119 },
    { name: 'Amravati', lat: 20.9374, lng: 77.7796 },
    { name: 'Noida', lat: 28.5355, lng: 77.3910 },
    { name: 'Jamshedpur', lat: 22.8046, lng: 86.2029 },
    { name: 'Bhilai Nagar', lat: 21.1938, lng: 81.3509 },
    { name: 'Cuttack', lat: 20.4625, lng: 85.8828 },
    { name: 'Firozabad', lat: 27.1592, lng: 78.3957 },
    { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
    { name: 'Bhavnagar', lat: 21.7645, lng: 72.1519 },
    { name: 'Dehradun', lat: 30.3165, lng: 78.0322 },
    { name: 'Durgapur', lat: 23.4800, lng: 87.3119 },
    { name: 'Asansol', lat: 23.6739, lng: 86.9524 },
    { name: 'Nanded-Waghala', lat: 19.1383, lng: 77.2975 },
    { name: 'Kolhapur', lat: 16.7050, lng: 74.2433 },
    { name: 'Ajmer', lat: 26.4499, lng: 74.6399 },
    { name: 'Gulbarga', lat: 17.3297, lng: 76.8343 },
    { name: 'Jamnagar', lat: 22.4707, lng: 70.0577 },
    { name: 'Ujjain', lat: 23.1765, lng: 75.7885 },
    { name: 'Loni', lat: 28.7333, lng: 77.2833 },
    { name: 'Siliguri', lat: 26.7271, lng: 88.3953 },
    { name: 'Jhansi', lat: 25.4484, lng: 78.5685 },
    { name: 'Ulhasnagar', lat: 19.2215, lng: 73.1645 },
    { name: 'Nellore', lat: 14.4426, lng: 79.9865 },
    { name: 'Jammu', lat: 32.7266, lng: 74.8570 },
    { name: 'Sangli-Miraj & Kupwad', lat: 16.8524, lng: 74.5815 },
    { name: 'Belgaum', lat: 15.8497, lng: 74.4977 },
    { name: 'Mangalore', lat: 12.9141, lng: 74.8560 },
    { name: 'Ambattur', lat: 13.1143, lng: 80.1548 },
    { name: 'Tirunelveli', lat: 8.7139, lng: 77.7567 },
    { name: 'Malegaon', lat: 20.5579, lng: 74.5287 },
    { name: 'Gaya', lat: 24.7914, lng: 85.0002 },
    { name: 'Jalgaon', lat: 21.0077, lng: 75.5626 },
    { name: 'Udaipur', lat: 24.5854, lng: 73.7125 },
    { name: 'Maheshtala', lat: 22.5093, lng: 88.2482 }
  ];

  const handleCityChange = (cityName: string) => {
    const city = cities.find(c => c.name === cityName);
    if (city) {
      setFormData(prev => ({
        ...prev,
        targetLocation: {
          ...prev.targetLocation,
          city: cityName,
          coordinates: {
            latitude: city.lat,
            longitude: city.lng
          }
        }
      }));
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
        setSuccess(`Notification sent successfully! Delivered to ${data.recipientCount || 0} users.`);
        // Reset form
        setFormData({
          title: '',
          message: '',
          type: 'info',
          category: 'general',
          targetLocation: {
            city: 'Jaipur',
            coordinates: {
              latitude: 26.9124,
              longitude: 75.7873
            },
            radius: 5
          },
          expiresIn: 24
        });
      } else {
        setError(data.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setError('Failed to send notification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning': return <Shield className="h-5 w-5 text-yellow-600" />;
      case 'advisory': return <Info className="h-5 w-5 text-blue-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'advisory': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Send Notification
            </h1>
            <p className="text-gray-600 mt-1">
              Send location-based notifications to tourists in specific areas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Success/Error Messages */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-green-800">{success}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter notification title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter notification message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Type *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['info', 'advisory', 'warning', 'emergency'].map((type) => (
                      <label key={type} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer ${
                        formData.type === type ? getTypeColor(type) : 'border-gray-200 bg-white'
                      }`}>
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={formData.type === type}
                          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-2">
                          {getTypeIcon(type)}
                          <span className="text-sm font-medium capitalize">{type}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General</option>
                    <option value="weather">Weather</option>
                    <option value="security">Security</option>
                    <option value="health">Health</option>
                    <option value="transport">Transport</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target City *
                  </label>
                  <select
                    value={formData.targetLocation.city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Radius (km) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.targetLocation.radius}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      targetLocation: { ...prev.targetLocation, radius: parseInt(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expires In (hours)
                  </label>
                  <select
                    value={formData.expiresIn}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiresIn: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1 hour</option>
                    <option value={6}>6 hours</option>
                    <option value={12}>12 hours</option>
                    <option value={24}>24 hours</option>
                    <option value={48}>48 hours</option>
                    <option value={168}>1 week</option>
                  </select>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                  <div className={`p-3 rounded-lg border-l-4 ${getTypeColor(formData.type)}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeIcon(formData.type)}
                      <span className="font-medium text-sm">{formData.title || 'Notification Title'}</span>
                    </div>
                    <p className="text-sm text-gray-600">{formData.message || 'Notification message will appear here...'}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      📍 {formData.targetLocation.city} ({formData.targetLocation.radius}km radius)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isLoading ? 'Sending...' : 'Send Notification'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withAuth(SendNotificationPage, ['canSendNotifications']);
