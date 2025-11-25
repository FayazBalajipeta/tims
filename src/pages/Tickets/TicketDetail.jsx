import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { toast } from 'react-toastify';
import {
  ArrowLeftIcon,
  PaperClipIcon,
  UserIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { ticketService } from '@/services/ticketService';
import { useAuthStore } from '@/store/authStore';
import { formatDate, getStatusBadgeClass, getPriorityBadgeClass } from '@/utils/helpers';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import StatusUpdateModal from '@/components/Tickets/StatusUpdateModal';
import CommentSection from '@/components/Tickets/CommentSection';

const TicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showStatusModal, setShowStatusModal] = useState(false);

  const { data: ticket, isLoading, refetch } = useQuery(
    ['ticket', ticketId],
    () => ticketService.getTicketById(ticketId)
  );

  const updateMutation = useMutation(
    ({ ticketId, updates }) => ticketService.updateTicket(ticketId, updates),
    {
      onSuccess: () => {
        toast.success('Ticket updated successfully');
        refetch();
      },
      onError: () => {
        toast.error('Failed to update ticket');
      },
    }
  );

  const deleteMutation = useMutation(
    () => ticketService.deleteTicket(ticketId),
    {
      onSuccess: () => {
        toast.success('Ticket deleted successfully');
        navigate('/tickets');
      },
      onError: () => {
        toast.error('Failed to delete ticket');
      },
    }
  );

  const handleDeleteTicket = () => {
    const confirmed = window.confirm('Are you really want to delete this ticket?');
    if (confirmed) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Ticket not found</p>
      </div>
    );
  }

  const canEdit = user?.role === 'admin' || user?.role === 'agent' || ticket.createdBy?.id === user?.id;

  return (
    <div className="fade-in">
      <div className="mb-6">
        <button
          onClick={() => navigate('/tickets')}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to tickets
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Header */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-mono text-gray-500">#{ticket.ticketNumber}</span>
                  <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <span className={`badge ${getPriorityBadgeClass(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
              </div>
              {canEdit && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowStatusModal(true)}
                    className="btn-secondary text-sm"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={handleDeleteTicket}
                    disabled={deleteMutation.isLoading}
                    className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>

            {/* Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Attachments</h3>
                <ul className="space-y-2">
                  {ticket.attachments.map((attachment, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <PaperClipIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-800"
                      >
                        {attachment.name}
                      </a>
                      <span className="ml-2 text-gray-500">({attachment.size})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <CommentSection ticket={ticket} onCommentAdded={refetch} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <div className="card">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Details</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Category</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{ticket.category}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Created By</dt>
                <dd className="mt-1 flex items-center text-sm">
                  <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-gray-900">{ticket.createdBy?.name || 'Unknown'}</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Assigned To</dt>
                <dd className="mt-1 flex items-center text-sm">
                  {ticket.assignedTo ? (
                    <>
                      <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-900">{ticket.assignedTo.name}</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Unassigned</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Created</dt>
                <dd className="mt-1 flex items-center text-sm">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-gray-900">{formatDate(ticket.createdAt)}</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Last Updated</dt>
                <dd className="mt-1 flex items-center text-sm">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-gray-900">{formatDate(ticket.updatedAt)}</span>
                </dd>
              </div>
              {ticket.resolvedAt && (
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Resolved</dt>
                  <dd className="mt-1 flex items-center text-sm">
                    <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-gray-900">{formatDate(ticket.resolvedAt)}</span>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Activity Timeline */}
          <div className="card">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Activity</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {ticket.history?.map((event, eventIdx) => (
                  <li key={event.id}>
                    <div className="relative pb-8">
                      {eventIdx !== ticket.history.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                            <ChatBubbleLeftIcon className="h-4 w-4 text-gray-500" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              {event.description}
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-xs text-gray-500">
                            {formatDate(event.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <StatusUpdateModal
          ticket={ticket}
          onClose={() => setShowStatusModal(false)}
          onUpdate={(updates) => {
            updateMutation.mutate({ ticketId: ticket._id, updates });
            setShowStatusModal(false);
          }}
        />
      )}
    </div>
  );
};

export default TicketDetail;
