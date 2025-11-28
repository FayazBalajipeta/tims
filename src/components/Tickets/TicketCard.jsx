import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { formatDate, getStatusBadgeClass, getPriorityBadgeClass } from '@/utils/helpers';
import { ticketService } from '@/services/ticketService';
import { useAuthStore } from '@/store/authStore';

const TicketCard = ({ ticket, onTicketDeleted }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();



  return (
    <div
      onClick={() => navigate(`/tickets/${ticket._id}`)}
      className="card hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-mono text-gray-500">#{ticket.ticketNumber}</span>
            <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
              {ticket.status}
            </span>
            <span className={`badge ${getPriorityBadgeClass(ticket.priority)}`}>
              {ticket.priority}
            </span>
            <span className="badge badge-secondary capitalize">{ticket.category}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 truncate mb-2">
            {ticket.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {ticket.description}
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              <span>{ticket.createdBy?.name || 'Unknown'}</span>
            </div>
            {ticket.assignedTo && (
              <div className="flex items-center">
                <span className="mr-1">Assigned to:</span>
                <span className="font-medium text-gray-700">{ticket.assignedTo.name}</span>
              </div>
            )}
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{formatDate(ticket.createdAt)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TicketCard;
