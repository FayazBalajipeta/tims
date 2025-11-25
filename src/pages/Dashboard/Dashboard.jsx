import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  TicketIcon,
  UserGroupIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { analyticsService } from '@/services/analyticsService';
import { ticketService } from '@/services/ticketService';
import { useAuthStore } from '@/store/authStore';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import RecentTickets from '@/components/Dashboard/RecentTickets';
import TicketChart from '@/components/Dashboard/TicketChart';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: stats, isLoading: statsLoading } = useQuery(
    'dashboardStats',
    analyticsService.getDashboardStats,
    {
      initialData: {
        totalTickets: 0,
        openTickets: 0,
        inProgressTickets: 0,
        resolvedTickets: 0,
        avgResolutionTime: '0h',
        ticketsByCategory: [],
        recentActivity: [],
      },
    }
  );

  const { data: myTickets, isLoading: ticketsLoading } = useQuery(
    'myTickets',
    ticketService.getMyTickets,
    {
      initialData: { tickets: [] },
    }
  );

  if (statsLoading || ticketsLoading) {
    return <LoadingSpinner />;
  }

  const statCards = [
    {
      name: 'Total Tickets',
      value: stats.totalTickets,
      icon: TicketIcon,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'Open Tickets',
      value: stats.openTickets,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      change: '+4%',
      changeType: 'increase',
    },
    {
      name: 'In Progress',
      value: stats.inProgressTickets,
      icon: ChartBarIcon,
      color: 'bg-orange-500',
      change: '-8%',
      changeType: 'decrease',
    },
    {
      name: 'Resolved',
      value: stats.resolvedTickets,
      icon: UserGroupIcon,
      color: 'bg-green-500',
      change: '+23%',
      changeType: 'increase',
    },
  ];

  return (
    <div className="fade-in">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's what's happening with your tickets today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`${stat.color} h-12 w-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    <div
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Tickets Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Trends</h3>
          <TicketChart data={stats.ticketTrends} />
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tickets by Category</h3>
          <div className="space-y-4">
            {stats.ticketsByCategory?.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-500">{category.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Tickets</h3>
          <button
            onClick={() => navigate('/tickets')}
            className="text-sm text-primary-600 hover:text-primary-800 font-medium"
          >
            View all
          </button>
        </div>
        <RecentTickets tickets={myTickets?.tickets?.slice(0, 5) || []} />
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          onClick={() => navigate('/tickets/new')}
          className="card hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center">
            <TicketIcon className="h-6 w-6 text-primary-600" />
            <span className="ml-3 text-sm font-medium text-gray-900">Create New Ticket</span>
          </div>
        </button>
        <button
          onClick={() => navigate('/analytics')}
          className="card hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center">
            <UserGroupIcon className="h-6 w-6 text-primary-600" />
            <span className="ml-3 text-sm font-medium text-gray-900">View Analytics</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
