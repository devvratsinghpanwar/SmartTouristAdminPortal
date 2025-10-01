'use client';

import { useState } from 'react';
import { withAuth } from '../contexts/AuthContext';
import { UserPlus, Copy, Download, Eye, EyeOff } from 'lucide-react';

interface AgentCredentials {
  agentId: string;
  password: string;
  username: string;
  email: string;
}

function CreateAgentPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profile: {
      fullName: '',
      organization: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: 'India',
        zipCode: ''
      }
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [credentials, setCredentials] = useState<AgentCredentials | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:4000/api/auth/create-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setCredentials({
          agentId: data.agent.agentId,
          password: data.password,
          username: data.agent.username,
          email: data.agent.email
        });
        setSuccess('Agent created successfully!');
        // Reset form
        setFormData({
          username: '',
          email: '',
          profile: {
            fullName: '',
            organization: '',
            phone: '',
            address: {
              street: '',
              city: '',
              state: '',
              country: 'India',
              zipCode: ''
            }
          }
        });
      } else {
        setError(data.message || 'Failed to create agent');
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'profile' && child === 'address') {
        const [, , addressField] = name.split('.');
        setFormData(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            address: {
              ...prev.profile.address,
              [addressField]: value
            }
          }
        }));
      } else if (parent === 'profile') {
        setFormData(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const downloadCredentials = () => {
    if (!credentials) return;
    
    const credentialsText = `
Smart Tourist Portal - Agent Credentials
========================================

Agent ID: ${credentials.agentId}
Username: ${credentials.username}
Email: ${credentials.email}
Password: ${credentials.password}

IMPORTANT: Please save these credentials securely. 
The password cannot be retrieved later.

Login URL: ${window.location.origin}/login
    `;

    const blob = new Blob([credentialsText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-credentials-${credentials.agentId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Agent</h1>
          <p className="text-gray-600">Create a new agent account with limited access permissions</p>
        </div>

        {/* Credentials Display */}
        {credentials && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-green-800">Agent Created Successfully!</h2>
              <div className="flex space-x-2">
                <button
                  onClick={downloadCredentials}
                  className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-700">Agent ID</label>
                <div className="mt-1 flex items-center space-x-2">
                  <code className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-md text-sm">
                    {credentials.agentId}
                  </code>
                  <button
                    onClick={() => copyToClipboard(credentials.agentId)}
                    className="p-2 text-green-600 hover:text-green-800"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700">Username</label>
                <div className="mt-1 flex items-center space-x-2">
                  <code className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-md text-sm">
                    {credentials.username}
                  </code>
                  <button
                    onClick={() => copyToClipboard(credentials.username)}
                    className="p-2 text-green-600 hover:text-green-800"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700">Email</label>
                <div className="mt-1 flex items-center space-x-2">
                  <code className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-md text-sm">
                    {credentials.email}
                  </code>
                  <button
                    onClick={() => copyToClipboard(credentials.email)}
                    className="p-2 text-green-600 hover:text-green-800"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700">Password</label>
                <div className="mt-1 flex items-center space-x-2">
                  <code className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-md text-sm">
                    {showPassword ? credentials.password : '••••••••••••'}
                  </code>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 text-green-600 hover:text-green-800"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(credentials.password)}
                    className="p-2 text-green-600 hover:text-green-800"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Please save these credentials securely. The password cannot be retrieved later.
                The agent can use these credentials to login at: <code>{window.location.origin}/login</code>
              </p>
            </div>
          </div>
        )}

        {/* Create Agent Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Agent Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && !credentials && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Account Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="agent_username"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="agent@hotel.com"
                />
              </div>
            </div>

            {/* Profile Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="profile.fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="profile.fullName"
                    name="profile.fullName"
                    value={formData.profile.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="profile.organization" className="block text-sm font-medium text-gray-700 mb-2">
                    Organization *
                  </label>
                  <input
                    type="text"
                    id="profile.organization"
                    name="profile.organization"
                    value={formData.profile.organization}
                    onChange={handleChange}
                    required
                    placeholder="Hotel Name, Tour Company, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="profile.phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="profile.phone"
                    name="profile.phone"
                    value={formData.profile.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91-9876543210"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="profile.address.city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="profile.address.city"
                    name="profile.address.city"
                    value={formData.profile.address.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="profile.address.state" className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    id="profile.address.state"
                    name="profile.address.state"
                    value={formData.profile.address.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="profile.address.zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="profile.address.zipCode"
                    name="profile.address.zipCode"
                    value={formData.profile.address.zipCode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                {isLoading ? 'Creating Agent...' : 'Create Agent'}
              </button>
            </div>
          </form>
        </div>

        {/* Agent Permissions Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">Agent Permissions</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>✅ Can do:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Register new tourists</li>
              <li>View high-risk zones (read-only)</li>
              <li>View their own profile</li>
            </ul>
            <p className="mt-3"><strong>❌ Cannot do:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Manage alerts or change alert status</li>
              <li>Create, edit, or delete geo-fences/high-risk zones</li>
              <li>Send notifications or advisories</li>
              <li>Create other agents</li>
              <li>View analytics or system statistics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(CreateAgentPage, ['canCreateAgents']);
