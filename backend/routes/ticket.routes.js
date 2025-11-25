import express from 'express';
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  assignTicket,
  updateStatus,
  updatePriority,
  addComment,
  getComments,
  getMyTickets,
  getAssignedTickets,
} from '../controllers/ticket.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected routes
router.use(protect);

router.get('/', getTickets);
router.post('/', createTicket);
router.get('/my-tickets', getMyTickets);
router.get('/assigned', authorize('agent', 'manager', 'admin'), getAssignedTickets);

router.get('/:id', getTicketById);
router.put('/:id', updateTicket);
router.delete('/:id', authorize('admin', 'agent', 'manager'), deleteTicket);

router.post('/:id/assign', authorize('agent', 'manager', 'admin'), assignTicket);
router.patch('/:id/status', updateStatus);
router.patch('/:id/priority', authorize('agent', 'manager', 'admin'), updatePriority);

router.get('/:id/comments', getComments);
router.post('/:id/comments', addComment);

export default router;
