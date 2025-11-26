import React, { useState } from 'react';
import ChangePasswordModal from '@/components/Settings/ChangePasswordModal';

const Settings = () => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  return (
    <div className="fade-in max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your application preferences and configurations
        </p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select className="input-field max-w-xs">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select className="input-field max-w-xs">
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
                <option value="GMT">GMT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Format
              </label>
              <select className="input-field max-w-xs">
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">New Ticket Assigned</p>
                <p className="text-xs text-gray-500">Get notified when a ticket is assigned to you</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Ticket Updates</p>
                <p className="text-xs text-gray-500">Receive updates on your tickets</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Comments</p>
                <p className="text-xs text-gray-500">Get notified about new comments</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Daily Summary</p>
                <p className="text-xs text-gray-500">Receive a daily summary of your tickets</p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div>
              <button
                onClick={() => setShowChangePasswordModal(true)}
                className="btn-secondary"
              >
                Change Password
              </button>
            </div>
            <div>
              <button className="btn-secondary">
                Enable Two-Factor Authentication
              </button>
            </div>
            <div>
              <button className="btn-secondary">
                View Active Sessions
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="btn-primary">
            Save Settings
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
};

export default Settings;
