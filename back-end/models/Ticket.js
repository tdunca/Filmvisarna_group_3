import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;