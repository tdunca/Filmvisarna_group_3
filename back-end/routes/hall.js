import Hall from "../models/Hall.js";
import express from "express";
import Seat from "../models/Seat.js";
import Showtime from "../models/Showtime.js";
import Movie from "../models/Movie.js";
import { createHall, deleteHalls, getHallById, getHalls, getSeatInfo, getSeatsOfHallAtShowtime, getShowtimesOfMovieInHall, patchSeats } from "../controllers/hallController.js";
const hallrouter = express.Router();

// Create a new hall
hallrouter.post("/", createHall);

// Get all halls
// /api/hall
hallrouter.get("/", getHalls);

// Get a hall by id and populate the seats
// /api/hall/:id
hallrouter.get("/:id", getHallById);

// get all showtimes of a movie in a hall
// /api/hall/:hallId/showtimes/:movieId
// hallrouter.get("/:hallId/showtimes/:movieId", getShowtimesOfMovieInHall); //NOT IN USE

// delete all halls and their seats and showtimes
// /api/hall
hallrouter.delete("/", deleteHalls);

// get all seats of a hall at a specific showtime
// /api/hall/:hallId/showtime/:showtime
// hallrouter.get("/:hallId/showtime/:showtime", getSeatsOfHallAtShowtime); // NOT IN USE -- MAYBE LATER

// get a seat info
hallrouter.get("/seat/:id", getSeatInfo)

//pathc seats
// hallrouter.patch('/patch-seats', patchSeats); // NOT IN USE

export default hallrouter;