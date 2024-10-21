import Showtime from '../models/Showtime.js';
import Movie from '../models/Movie.js';
import Hall from '../models/Hall.js';
import Seat from '../models/Seat.js';

// Hjälpfunktion för att kontrollera tidskonflikter
const checkTimeConflict = async (hallId, date, time, duration, excludeShowtimeId = null) => {
  const targetDate = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  const startTime = new Date(targetDate);
  startTime.setHours(hours, minutes, 0, 0);
  
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + duration + 30); // Lägg till 30 min för städning

  const conflictingShowtime = await Showtime.findOne({
    hall: hallId,
    date: targetDate,
    _id: { $ne: excludeShowtimeId },
    $or: [
      {
        $and: [
          { time: { $lte: time } },
          {
            $expr: {
              $gt: [
                {
                  $add: [
                    { $multiply: [{ $toInt: { $substr: ['$time', 0, 2] } }, 60] },
                    { $toInt: { $substr: ['$time', 3, 2] } },
                    '$movie.length'
                  ]
                },
                { $add: [30] } // Lägg till städtid
              ]
            }
          }
        ]
      },
      {
        time: {
          $gte: time,
          $lt: endTime.toTimeString().substring(0, 5)
        }
      }
    ]
  }).populate('movie');

  return conflictingShowtime;
};


export const createShowtime = async (req, res) => {
  try {
    const { movieId, hallId, date, time } = req.body;

    // Validera indata
    if (!movieId || !hallId || !date || !time) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Hämta film och salong
    const [movie, hall] = await Promise.all([
      Movie.findById(movieId),
      Hall.findById(hallId)
    ]);

    if (!movie || !hall) {
      return res.status(404).json({ error: 'Movie or hall not found' });
    }

    // Kontrollera tidskonflikter
    const conflict = await checkTimeConflict(hallId, date, time, movie.length);
    if (conflict) {
      return res.status(400).json({ 
        error: 'Time conflict with existing showtime',
        conflictingShowtime: conflict 
      });
    }

    // Hämta alla säten för salongen
    const seats = await Seat.find({ hall: hallId });
    
    // Skapa showtime med alla säten markerade som lediga
    const showtime = new Showtime({
      movie: movieId,
      hall: hallId,
      date: new Date(date),
      time,
      seats: seats.map(seat => ({
        seat: seat._id,
        isBooked: false
      }))
    });

    await showtime.save();

    // Populate response med film- och salongsinfo
    const populatedShowtime = await Showtime.findById(showtime._id)
      .populate('movie')
      .populate('hall')
      .populate('seats.seat');

    res.status(201).json({
      message: 'Showtime created successfully',
      showtime: populatedShowtime
    });

  } catch (error) {
    console.error('Error creating showtime:', error);
    res.status(500).json({ error: 'Failed to create showtime' });
  }
};

export const getShowtimes = async (req, res) => {
  try {
    const { 
      movieId, 
      hallId, 
      startDate, 
      endDate,
      includeExpired = false 
    } = req.query;

    const query = {};
    
    // Filtrera på film om specificerad
    if (movieId) {
      query.movie = movieId;
    }

    // Filtrera på salong om specificerad
    if (hallId) {
      query.hall = hallId;
    }

    // Filtrera på datumintervall
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Exkludera utgångna visningar om inte specifikt efterfrågade
    if (!includeExpired) {
      const now = new Date();
      if (!query.date) query.date = {};
      query.date.$gte = now;
    }

    const showtimes = await Showtime.find(query)
      .populate('movie')
      .populate('hall')
      .sort({ date: 1, time: 1 });

    res.status(200).json(showtimes);

  } catch (error) {
    console.error('Error fetching showtimes:', error);
    res.status(500).json({ error: 'Failed to fetch showtimes' });
  }
};

export const getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate('movie')
      .populate('hall')
      .populate('seats.seat');

    if (!showtime) {
      return res.status(404).json({ error: 'Showtime not found' });
    }

    res.status(200).json(showtime);

  } catch (error) {
    console.error('Error fetching showtime:', error);
    res.status(500).json({ error: 'Failed to fetch showtime' });
  }
};

export const getShowtimeSeats = async (req, res) => {
  try {
    const showtimeId = req.params.id;
    const showtime = await Showtime.findById(showtimeId).populate('seats.seat');
    
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Ensure we're sending JSON
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ seats: showtime.seats });
  } catch (error) {
    console.error('Error fetching seats:', error);
    return res.status(500).json({ message: 'Error fetching seats', error: error.message });
  }
};

export const updateShowtime = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    const showtime = await Showtime.findById(id).populate('movie');
    if (!showtime) {
      return res.status(404).json({ error: 'Showtime not found' });
    }

    // Kontrollera tidskonflikter om tid eller datum ändras
    if (date !== showtime.date || time !== showtime.time) {
      const conflict = await checkTimeConflict(
        showtime.hall,
        date || showtime.date,
        time || showtime.time,
        showtime.movie.length,
        id
      );

      if (conflict) {
        return res.status(400).json({ 
          error: 'Time conflict with existing showtime',
          conflictingShowtime: conflict 
        });
      }
    }

    // Uppdatera endast tillåtna fält
    if (date) showtime.date = new Date(date);
    if (time) showtime.time = time;

    await showtime.save();

    const updatedShowtime = await Showtime.findById(id)
      .populate('movie')
      .populate('hall')
      .populate('seats.seat');

    res.status(200).json({
      message: 'Showtime updated successfully',
      showtime: updatedShowtime
    });

  } catch (error) {
    console.error('Error updating showtime:', error);
    res.status(500).json({ error: 'Failed to update showtime' });
  }
};

export const deleteShowtime = async (req, res) => {
  try {
    const { id } = req.params;

    // Kontrollera om det finns bokningar för visningen
    const showtime = await Showtime.findById(id);
    if (!showtime) {
      return res.status(404).json({ error: 'Showtime not found' });
    }

    const hasBookings = showtime.seats.some(seat => seat.isBooked);
    if (hasBookings) {
      return res.status(400).json({ 
        error: 'Cannot delete showtime with existing bookings' 
      });
    }

    await Showtime.findByIdAndDelete(id);

    res.status(200).json({ 
      message: 'Showtime deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting showtime:', error);
    res.status(500).json({ error: 'Failed to delete showtime' });
  }
};

export const getShowtimesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Both startDate and endDate are required' 
      });
    }

    const showtimes = await Showtime.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
    .populate('movie')
    .populate('hall')
    .sort({ date: 1, time: 1 });

    // Gruppera visningar efter datum
    const groupedShowtimes = showtimes.reduce((acc, showtime) => {
      const dateStr = showtime.date.toISOString().split('T')[0];
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(showtime);
      return acc;
    }, {});

    res.status(200).json(groupedShowtimes);

  } catch (error) {
    console.error('Error fetching showtimes by date range:', error);
    res.status(500).json({ error: 'Failed to fetch showtimes' });
  }
};