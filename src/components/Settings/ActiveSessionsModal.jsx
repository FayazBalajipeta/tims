import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { XMarkIcon, ComputerDesktopIcon, DevicePhoneMobileIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { userService } from '@/services/userService';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

const ActiveSessionsModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  
  const { data: sessions = [], isLoading } = useQuery(
    'activeSessions',
    userService.getActiveSessions,
    {
      enabled: isOpen,
      refetchInterval: 30000
    }
  );

  const terminateMutation = useMutation(userService.terminateSession, {
    onSuccess: () => {
      toast.success('Session terminated successfully');
      queryClient.invalidateQueries('activeSessions');
    },
    onError: () => {
      toast.error('Failed to terminate session');
    }
  });

  const terminateAllMutation = useMutation(userService.terminateAllSessions, {
    onSuccess: () => {
      toast.success('All sessions terminated successfully');
      queryClient.invalidateQueries('activeSessions');
    },
    onError: () => {
      toast.error('Failed to terminate all sessions');
    }
  });

  const mockSessions = [
    {
      id: 1,
      device: 'Windows PC',
      browser: 'Chrome 120.0',
      ip: '192.168.1.100',
      location: 'New York, NY, USA',
      lastActive: '2 minutes ago',
      current: true,
      icon: ComputerDesktopIcon
    },
    {
      id: 2,
      device: 'iPhone 15',
      browser: 'Safari 17.0',
      ip: '192.168.1.101',
      location: 'New York, NY, USA',
      lastActive: '1 hour ago',
      current: false,
      icon: DevicePhoneMobileIcon
    },
    {
      id: 3,
      device: 'MacBook Pro',
      browser: 'Chrome 120.0',
      ip: '10.0.0.50',
      location: 'Boston, MA, USA',
      lastActive: '2 days ago',
      current: false,
      icon: ComputerDesktopIcon
    }
  ];

  const displaySessions = sessions.length > 0 ? sessions : mockSessions;

  const handleTerminateSession = (sessionId) => {
    const confirmed = window.confirm('Are you sure you want to terminate this session?');
    if (confirmed) {
      terminateMutation.mutate(sessionId);
    }
  };

  const handleTerminateAll = () => {
    const confirmed = window.confirm('Are you sure you want to logout from all other sessions? This will not affect your current session.');
    if (confirmed) {
      terminateAllMutation.mutate();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          These are the devices that are currently signed in to your account.
        </p>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {displaySessions.map((session) => {
              const IconComponent = session.icon;
              return (
                <div key={session.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <IconComponent className="h-6 w-6 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            {session.device} - {session.browser}
                          </p>
                          {session.current && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-xs text-gray-500">
                            <GlobeAltIcon className="h-3 w-3 mr-1" />
                            <span>IP: {session.ip}</span>
                          </div>
                          <p className="text-xs text-gray-500">Location: {session.location}</p>
                          <p className="text-xs text-gray-500">Last active: {session.lastActive}</p>
                        </div>
                      </div>
                    </div>
                    {!session.current && (
                      <button
                        onClick={() => handleTerminateSession(session.id)}
                        disabled={terminateMutation.isLoading}
                        className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        {terminateMutation.isLoading ? 'Terminating...' : 'Logout'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-between">
          <button 
            onClick={handleTerminateAll}
            disabled={terminateAllMutation.isLoading}
            className="btn-danger"
          >
            {terminateAllMutation.isLoading ? 'Logging out...' : 'Logout All Other Sessions'}
          </button>
          <button onClick={onClose} className="btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveSessionsModal;