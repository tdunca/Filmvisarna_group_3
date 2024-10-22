import express from 'express';
import {
  createTicketType,
  getTicketTypes,
  updateTicketType,
  deleteTicketType
} from '../controllers/ticketController.js';

const ticketRouter = express.Router();

// Get all ticket types
ticketRouter.get('/', getTicketTypes);

// Create a new ticket type
ticketRouter.post('/', createTicketType);

// Update a ticket type
ticketRouter.put('/:id', updateTicketType);

// Delete a ticket type
ticketRouter.delete('/:id', deleteTicketType);

export default ticketRouter;