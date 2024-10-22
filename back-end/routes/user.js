import express from 'express';
import Movie from '../models/Movie.js';
import Hall from '../models/Hall.js';
import Booking from '../models/Booking.js';
import { authUser } from '../middlewares/authUser.js';
import Seat from '../models/Seat.js';
import Showtime from '../models/Showtime.js';
import { getTickets, getUserInfo, removeTicket, userInfoByTicket, updateProfile } from '../controllers/userController.js';
import { createBooking, getAvailableSeats } from '../controllers/bookingController.js';
const userRouter = express.Router();

//Authenticated routes----------------
// book a ticket -- NOT IN USE
// userRouter.post('/book-ticket', authUser, bookTicket); // NOT IN USE

// remove a ticket by booking number
userRouter.delete('/remove-ticket/:bookingNumber', authUser, removeTicket);

// get all tickets of a user
// /api/user/tickets
userRouter.get('/tickets', authUser, getTickets); // SORT ROUTES - /api/ticket should view ticket types, and booking for bookings

// get user info by ticket booking number 
// /api/user/ticket/:bookingNumber
userRouter.get('/ticket/:bookingNumber', authUser, userInfoByTicket);

userRouter.get("/info", authUser, getUserInfo);

//update profile
userRouter.post("/update-profile", authUser, updateProfile)

// userRouter.post('/bookings', createBooking);
// userRouter.get('/booking/:showtimeId', authUser, getAvailableSeats);
// userRouter.post('/booking/:showtimeId', authUser, createBooking);

// Non-authenticated routes-------------
userRouter.get('/booking/:showtimeId/seats', getAvailableSeats);
// Create a booking
userRouter.post('/bookings', createBooking); //No token needed

// userRouter.get('/showtime/:showtimeId/seats', getAvailableSeats);
export default userRouter;