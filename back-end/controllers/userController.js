import Movie from '../models/Movie.js';
import Hall from '../models/Hall.js';
import Booking from '../models/Booking.js';
import { authUser } from '../middlewares/authUser.js';
import Seat from '../models/Seat.js';
import Showtime from '../models/Showtime.js';
import User from '../models/User.js';

// export const bookTicket = async (req, res) => {
//   try {
//     const { movieId, hallId, showtimes, seats } = req.body;

//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(400).json({ error: 'User does not exist' });
//     }

//     // Find the movie with the given id, hall id, and that has the given showtime in its showtimes array
//     const movie = await Movie.findOne({ _id: movieId, hall: hallId, showtimes: { $in: showtimes.map(st => st.time) } });
//     if (!movie) {
//       return res.status(400).json({ error: 'Movie does not exist' });
//     }

//     const hall = await Hall.findById(hallId);
//     if (!hall) {
//       return res.status(400).json({ error: 'Hall does not exist' });
//     }

//     const bookedAt = [];

//     for (const showtime of showtimes) {
//       // Find the specific showtime document that has the given showtime
//       const showtimeDoc = await Showtime.findOne({ movie: movieId, hall: hallId, time: showtime.time, date: new Date(showtime.date) });
//       if (!showtimeDoc) {
//         return res.status(400).json({ error: `Showtime does not exist for time ${showtime.time} on date ${showtime.date}` });
//       }

//       // Check if the seats are available
//       const availableSeats = showtimeDoc.seats.filter(seat => seats.includes(seat.seat.toString()) && !seat.isBooked);
//       if (availableSeats.length !== seats.length) {
//         return res.status(400).json({ error: 'One or more seats are not available' });
//       }

//       // Mark the seats as booked in the Showtime document
//       showtimeDoc.seats.forEach(seat => {
//         if (seats.includes(seat.seat.toString())) {
//           seat.isBooked = true;
//         }
//       });

//       // Mark the seats as booked in the Seat collection
//       const selectedSeats = await Seat.find({ _id: { $in: seats } });
//       selectedSeats.forEach(seat => {
//         seat.isBooked = true;
//       });

//       try {
//         await Promise.all([showtimeDoc.save(), ...selectedSeats.map(seat => seat.save())]);
//       } catch (saveError) {
//         console.error('Error saving seats:', saveError);
//         return res.status(500).json({ error: 'Error saving seats' });
//       }

//       bookedAt.push({ date: new Date(showtime.date), time: showtime.time });
//     }

//     // Create a unique booking number for the ticket includes random letters and numbers and must be exactly 6 characters long
//     const bookingNumber = Math.random().toString(36).substring(2, 8).toUpperCase();
//     const booking = new Booking({
//       user: req.user._id,
//       movie: movieId,
//       hall: hallId,
//       showtime: showtimes,
//       seats: seats,
//       bookingNumber,
//       bookedAt: bookedAt,
//     });

//     try {
//       const savedBooking = await booking.save();
//       user.bookings.push(savedBooking.bookingNumber);
//       await user.save();
//       res.status(200).json({ message: 'Ticket booked successfully', booking: savedBooking });
//     } catch (bookingError) {
//       console.error('Error saving booking:', bookingError);
//       return res.status(500).json({ error: 'Error saving booking' });
//     }
//   } catch (error) {
//     console.error('Error booking ticket:', error); // Log the error for debugging
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ error: 'Validation error', details: error.errors });
//     }
//     res.status(500).json({ error: 'Server error' });
//   }
// };

export const removeTicket = async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingNumber: req.params.bookingNumber });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    // Find the specific showtime document that has the given showtime
    const showtimeDoc = await Showtime.findOne({
      movie: booking.movie,
      hall: booking.hall,
      date: booking.bookedAt.map(ba => ba.date),
      time: booking.bookedAt.map(ba => ba.time)
    });
    if (!showtimeDoc) {
      return res.status(400).json({ error: 'Showtime does not exist' });
    }

    // Mark the seats as available in the Showtime document
    showtimeDoc.seats.forEach(seat => {
      if (booking.seats.includes(seat.seat.toString())) {
        seat.isBooked = false;
      }
    });

    // Mark the seats as available in the Seat collection
    const selectedSeats = await Seat.find({ _id: { $in: booking.seats } });
    selectedSeats.forEach(seat => {
      seat.isBooked = false;
    });

    try {
      await Promise.all([showtimeDoc.save(), ...selectedSeats.map(seat => seat.save())]);
    } catch (saveError) {
      console.error('Error saving seats:', saveError);
      return res.status(500).json({ error: 'Error saving seats' });
    }

    await Booking.deleteOne({ _id: booking._id });

    // Update user's bookings to remove the booking ID
    const user = await User.findById(req.user._id);
    if (user) {
      user.bookings = user.bookings.filter(b => b.toString() !== booking._id.toString());
      await user.save();
    }

    res.status(200).json({ message: 'Ticket removed successfully' });
  } catch (error) {
    console.error('Error removing ticket:', error); // Log the error for debugging
    res.status(500).json({ error: 'Server error' });
  }
}

  export const getTickets = async (req, res) => {
    try {
      const bookings = await Booking.find({ user: req.user._id }).populate('movie').populate('hall').exec();
      if (bookings.length === 0) {
        return res.status(404).json({ error: 'No tickets found' });
      }
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching tickets:', error); // Log the error for debugging
      res.status(500).json({ error: 'Server error' });
    }
  }

  export const userInfoByTicket = async (req, res) => {
    try {
      const booking = await Booking.findOne({ bookingNumber: req.params.bookingNumber }).populate('movie').populate('hall').exec();
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      res.status(200).json(booking);
    } catch (error) {
      console.error('Error fetching ticket:', error); // Log the error for debugging
      res.status(500).json({ error: 'Server error' });
    }
  }

export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("bookings").exec();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove the password field from the user object
    const { password, ...userWithoutPassword } = user.toObject();

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user info:', error); // Log the error for debugging
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;

    await user.save();

    const { password: _, ...updatedUser } = user.toObject();
    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
