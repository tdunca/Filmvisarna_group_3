import Movie from "../models/Movie.js";

export const createMovie = async (req, res) => {
    try {
    const { title, year, length, description, genre, distributor, language, subtitles, productionCountries, director, actors, poster, trailer, ageRestriction, imdbRating } = req.body;

    const movie = new Movie({
      title,
      year,
      length,
      description,
      genre,
      distributor,
      language,
      subtitles,
      productionCountries,
      director,
      actors,
      poster,
      trailer,
      ageRestriction,
      imdbRating
    });

    await movie.save();
    res.status(200).json({ message: "Movie created successfully", movie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().exec();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).exec();
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteMovies = async (req, res) => {
  try {
    await Movie.deleteMany();
    res.status(200).json({ message: "All movies deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
