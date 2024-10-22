import Ticket from '../models/Ticket.js';

// Create a new ticket type
export const createTicketType = async (req, res) => {
  try {
    const { type, price } = req.body;
    const newTicket = new Ticket({ type, price });
    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all ticket types
export const getTicketTypes = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a ticket type
export const updateTicketType = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, price } = req.body;
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { type, price },
      { new: true }
    );
    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket type not found' });
    }
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a ticket type
export const deleteTicketType = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTicket = await Ticket.findByIdAndDelete(id);
    if (!deletedTicket) {
      return res.status(404).json({ message: 'Ticket type not found' });
    }
    res.status(200).json({ message: 'Ticket type deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};