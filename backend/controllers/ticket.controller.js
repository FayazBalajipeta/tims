import Ticket from '../models/Ticket.model.js';

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private
export const getTickets = async (req, res, next) => {
  try {
    const { status, priority, category, assignedTo, search } = req.query;

    let query = {};

    // Build query based on filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (assignedTo) query.assignedTo = assignedTo;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket by ID
// @route   GET /api/tickets/:id
// @access  Private
export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('comments.author', 'name email')
      .populate('history.user', 'name email');

    if (!ticket) {
      return res.status(404).json({
        status: 'error',
        message: 'Ticket not found',
      });
    }

    res.status(200).json({
      status: 'success',
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
export const createTicket = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    const ticket = await Ticket.create(req.body);

    await ticket.populate('createdBy', 'name email');

    res.status(201).json({
      status: 'success',
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
export const updateTicket = async (req, res, next) => {
  try {
    let ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        status: 'error',
        message: 'Ticket not found',
      });
    }

    // Add to history
    if (req.body.status && req.body.status !== ticket.status) {
      ticket.history.push({
        description: `Status changed from ${ticket.status} to ${req.body.status}`,
        user: req.user.id,
      });

      if (req.body.status === 'resolved') {
        ticket.resolvedAt = Date.now();
      } else if (req.body.status === 'closed') {
        ticket.closedAt = Date.now();
      }
    }

    if (req.body.priority && req.body.priority !== ticket.priority) {
      ticket.history.push({
        description: `Priority changed from ${ticket.priority} to ${req.body.priority}`,
        user: req.user.id,
      });
    }

    // Update ticket
    Object.assign(ticket, req.body);
    await ticket.save();

    await ticket.populate('createdBy assignedTo', 'name email');

    res.status(200).json({
      status: 'success',
      ticket,
    });
  } catch (error) {
    next(error);
  }
};



// @desc    Assign ticket to agent
// @route   POST /api/tickets/:id/assign
// @access  Private (Agent/Manager/Admin)
export const assignTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        status: 'error',
        message: 'Ticket not found',
      });
    }

    ticket.assignedTo = req.body.userId;
    ticket.history.push({
      description: `Ticket assigned`,
      user: req.user.id,
    });

    await ticket.save();
    await ticket.populate('assignedTo', 'name email');

    res.status(200).json({
      status: 'success',
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket status
// @route   PATCH /api/tickets/:id/status
// @access  Private
export const updateStatus = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        status: 'error',
        message: 'Ticket not found',
      });
    }

    const oldStatus = ticket.status;
    ticket.status = req.body.status;

    ticket.history.push({
      description: `Status changed from ${oldStatus} to ${req.body.status}`,
      user: req.user.id,
    });

    if (req.body.status === 'resolved') {
      ticket.resolvedAt = Date.now();
    } else if (req.body.status === 'closed') {
      ticket.closedAt = Date.now();
    }

    await ticket.save();

    res.status(200).json({
      status: 'success',
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket priority
// @route   PATCH /api/tickets/:id/priority
// @access  Private (Agent/Manager/Admin)
export const updatePriority = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        status: 'error',
        message: 'Ticket not found',
      });
    }

    const oldPriority = ticket.priority;
    ticket.priority = req.body.priority;

    ticket.history.push({
      description: `Priority changed from ${oldPriority} to ${req.body.priority}`,
      user: req.user.id,
    });

    await ticket.save();

    res.status(200).json({
      status: 'success',
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to ticket
// @route   POST /api/tickets/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        status: 'error',
        message: 'Ticket not found',
      });
    }

    ticket.comments.push({
      content: req.body.content,
      author: req.user.id,
    });

    ticket.history.push({
      description: 'Comment added',
      user: req.user.id,
    });

    await ticket.save();
    await ticket.populate('comments.author', 'name email');

    const newComment = ticket.comments[ticket.comments.length - 1];

    res.status(201).json({
      status: 'success',
      comment: newComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket comments
// @route   GET /api/tickets/:id/comments
// @access  Private
export const getComments = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('comments.author', 'name email');

    if (!ticket) {
      return res.status(404).json({
        status: 'error',
        message: 'Ticket not found',
      });
    }

    res.status(200).json({
      status: 'success',
      comments: ticket.comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's tickets
// @route   GET /api/tickets/my-tickets
// @access  Private
export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user.id })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assigned tickets
// @route   GET /api/tickets/assigned
// @access  Private (Agent/Manager/Admin)
export const getAssignedTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ assignedTo: req.user.id })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    next(error);
  }
};
