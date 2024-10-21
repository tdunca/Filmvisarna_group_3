import Hall from "../models/Hall.js";
import express from "express";
import Seat from "../models/Seat.js";
import Showtime from "../models/Showtime.js";

export const createHall = async (req, res) => {
  try {
    const { hallName, hallNumber, seatsPerRow } = req.body;

    // Check if the hall already exists
    const hallExists = await Hall.findOne({ hallName, hallNumber }).exec();
    if (hallExists) {
      return res.status(400).json({ error: "Hall already exists" });
    }

    // Create a new hall
    const hall = new Hall({ hallName, hallNumber, seatsPerRow });
    await hall.save();

    // Create seats for the hall
    const seats = [];
    let seatCounter = 1;
    for (let i = 0; i < seatsPerRow.length; i++) {
      for (let j = 0; j < seatsPerRow[i]; j++) {
        const seat = new Seat({
          seatNumber: seatCounter++, 
          rowNumber: i + 1,
          hall: hall._id
        });
        seats.push(seat);
      }
    }

    // Insert all seats into the Seat collection
    await Seat.insertMany(seats);

    res.status(200).json({ message: "Hall created successfully", hall });
  } catch (error) {
    console.error('Error creating hall:', error); // Log the error for debugging
    res.status(500).json({ error: "Server error" });
  }
};
export const getHalls = async (req, res) => {
    try {
      const halls = await Hall.find();
      res.status(200).json(halls);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

export const getHallById = async (req, res) => {
    try {
      const hall = await Hall.findById(req.params.id);
      if (!hall) {
        return res.status(404).json({ error: "Hall not found" });
      }
      res.status(200).json(hall);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

  export const getShowtimesOfMovieInHall = async (req, res) => {
    try {
      const { hallId, movieId } = req.params;
      const showtimes = await Showtime.find({ hall: hallId, movie: movieId }).exec();
      res.status(200).json(showtimes);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

export const deleteHalls = async (req, res) => {
    try {
      Promise.all([
        Hall.deleteMany(),
        Seat.deleteMany(),
      ]);
      res.status(200).json({ message: "All halls deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

export const getSeatsOfHallAtShowtime = async (req, res) => {
    try {
      const { hallId, showtime } = req.params;
      console.log(hallId, showtime);
      const showtimeDocSeats = await Showtime.findOne({ hall: hallId, time: showtime }).select("seats").exec();
  
      if (!showtimeDocSeats) {
        return res.status(404).json({ error: "Showtime not found" });
      }
  
  
      res.status(200).json(showtimeDocSeats);
    } catch (error) {
      console.error('Error fetching seats:', error); // Log the error for debugging
      res.status(500).json({ error: "Server error" });
    }
  }

  export const getSeatInfo = async (req, res) => {
    try {
      const seat = await Seat.findById(req.params.id).exec();
      if (!seat) {
        return res.status(404).json({ error: "Seat not found" });
      }
      res.status(200).json(seat);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
}
  
// Patcher för att uppdatera seatNumber och göra det kontinuerligt
export const patchSeats = async (req, res) => {
  try {
    const hallId = '67078199c8a54ccb5e7e6e21'; // Hall-ID som ska patchas

    // Hämta alla säten för hallen och sortera efter rowNumber och sedan seatNumber
    const seats = await Seat.find({ hall: hallId }).sort({ rowNumber: 1, seatNumber: 1 });

    // Steg 1: Konvertera seatNumber till Number
    await Seat.updateMany(
      { hall: hallId },
      [
        {
          $set: {
            seatNumber: { $toInt: "$seatNumber" }  // Konvertera seatNumber till int
          }
        }
      ]
    );

    // Steg 2: Uppdatera seatNumber till kontinuerligt nummer
    let seatCounter = 1; // Starta från 1 för kontinuerlig numrering
    const bulkOperations = seats.map(seat => ({
      updateOne: {
        filter: { _id: seat._id },
        update: { $set: { seatNumber: seatCounter++ } }
      }
    }));

    await Seat.bulkWrite(bulkOperations);

    res.status(200).json({ message: "Seats successfully updated with continuous seatNumber." });
  } catch (error) {
    console.error('Error updating seats:', error);
    res.status(500).json({ error: "Server error" });
  }
};