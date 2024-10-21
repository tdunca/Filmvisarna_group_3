import Movie from '../models/Movie.js';
import Hall from '../models/Hall.js';
import Booking from '../models/Booking.js';
import Seat from '../models/Seat.js';
import Showtime from '../models/Showtime.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const TICKET_PRICES = {
  adult: 140,
  senior: 120,
  child: 80
};

export const createBooking = async (req, res) => {
  try {
    const { movieId, hallId, showtimeId, selectedSeats, email, tickets } = req.body;

    // Validate input
    if (!movieId || !hallId || !showtimeId || !selectedSeats || !email || !tickets) {
      return res.status(400).json({ error: 'Missing required booking information' });
    }

     // Validate tickets
    const totalSeatsFromTickets = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    if (totalSeatsFromTickets !== selectedSeats.length) {
      return res.status(400).json({ error: 'Number of tickets does not match number of selected seats' });
    }

    // Calculate total amount
    const totalAmount = tickets.reduce((sum, ticket) => {
      return sum + (TICKET_PRICES[ticket.type] * ticket.quantity);
    }, 0);

    // Process tickets with prices
    const processedTickets = tickets.map(ticket => ({
      type: ticket.type,
      quantity: ticket.quantity,
      price: TICKET_PRICES[ticket.type]
    }));

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      // Generate random password
      const tempPassword = crypto.randomBytes(4).toString('hex');
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      
      user = new User({
        email,
        password: hashedPassword,
        username: email.split('@')[0]
      });
      await user.save();

      // Send credentials email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Dina inloggningsuppgifter till MonsterBio!',
        html: `
        <h2>Välkommen till MonsterBio!</h2>
        <p>Du kan logga in på MonsterBio för att hantera dina biljettbokningar.</p>
        <p>Här är dina inloggninguppgifer:</p>
        <p>Anändarnamn: ${user.username} </p>
        <p>Lösenord: ${tempPassword}</p>`
      });
    }

    // Verify showtime and check seat availability
    const showtime = await Showtime.findById(showtimeId)
      .populate('movie')
      .populate('hall');

    if (!showtime) {
      return res.status(404).json({ error: 'Showtime not found' });
    }

    // Check if selected seats are available
    const unavailableSeats = showtime.seats.filter(
      seat => selectedSeats.includes(seat.seat.toString()) && seat.isBooked
    );

    if (unavailableSeats.length > 0) {
      return res.status(400).json({ 
        error: 'One or more selected seats are no longer available' 
      });
    }

    // Generate unique booking number
    const bookingNumber = `${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // Create booking
    const booking = new Booking({
      user: user._id,
      movie: movieId,
      hall: hallId,
      bookedAt: [{
        date: showtime.date,
        time: showtime.time
      }],
      seats: selectedSeats,
      tickets: processedTickets,
      totalAmount,
      bookingNumber
    });

    // Update seats in showtime
    showtime.seats.forEach(seat => {
      if (selectedSeats.includes(seat.seat.toString())) {
        seat.isBooked = true;
      }
    });

     // Add booking to user bookings
    user.bookings.push(booking._id);

    // Save everything
    await Promise.all([
      booking.save(),
      showtime.save(),
      user.save()
    ]);

    // Send booking confirmation email
    const emailContent = await generateBookingEmail(booking, showtime, user);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Din bokningsbekräftelse från MonsterBio',
      html: emailContent
    });

    res.status(200).json({
      message: 'Booking successful',
      booking: {
        ...booking.toObject(),
        showtime: showtime.toObject()
      }
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to process booking' });
  }
};

const generateBookingEmail = async (booking, showtime, user) => {
  const movie = await Movie.findById(booking.movie);
  const hall = await Hall.findById(booking.hall);
  const seats = await Seat.find({ _id: { $in: booking.seats } });

  const ticketDetails = booking.tickets.map(ticket => 
        `${ticket.quantity}x ${ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)} (${ticket.price} kr each)`
  ).join('<br>');
  
  return `
    <h2>Bokningsbekräftelse</h2>
    <p>Bokningsnummer: ${booking.bookingNumber}</p>
    <p>Film: ${movie.title}</p>
    <p>Datum: ${new Date(showtime.date).toLocaleDateString()}</p>
    <p>Tid: ${showtime.time}</p>
    <p>Salong: ${hall.hallName}</p>
    <p>Säten: ${seats.map(seat => `Rad ${seat.rowNumber} Säte ${seat.seatNumber}`).join(', ')}</p>
    <p>Antal säten: ${seats.length}</p>
    <hr>
    <h3>Biljetter:</h3>
    <p>${ticketDetails}</p>
    <p>Att betala: ${booking.totalAmount} kr</p>
    <hr>
    <p>Var vänlig och kom 15 minuter innan visningen börjar.</p>
    <p>Du kan logga in på MonsterBio för att se din bokningsinformation.</p>
  `;
};

export const getAvailableSeats = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    
    const showtime = await Showtime.findById(showtimeId)
      .populate({
        path: 'seats.seat',
        model: 'Seat'
      });

    if (!showtime) {
      return res.status(404).json({ error: 'Showtime not found' });
    }

    const seatAvailability = showtime.seats.map(seat => ({
      seatId: seat.seat._id,
      rowNumber: seat.seat.rowNumber,
      seatNumber: seat.seat.seatNumber,
      isAvailable: !seat.isBooked
    }));

    res.status(200).json(seatAvailability);

  } catch (error) {
    console.error('Error fetching available seats:', error);
    res.status(500).json({ error: 'Failed to fetch available seats' });
  }
};