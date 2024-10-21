import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: {
        type: String, // "The Matrix"
        required: true,
    },
    year: {
        type: Number, // 2021
        required: true,
    },
    length: {
        type: Number, // 120
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    genre: {
        type: [String],
        required: true,
        default: [],
    },
    distributor: {
        type: String,
        required: true,
    },
    productionCountries: {
        type: [String],
        required: true,
        default: [],
    },
    language: {
        type: String,
        required: true,
    },
    subtitles: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    actors: {
        type: [String],
        required: true,
        default: [],
    },
    poster: {
        type: String,
        required: true,
        default: "https://res.cloudinary.com/dkccaruot/image/upload/v1722965887/oyswfgmlb5olqisiazsg.png",
    },
    trailer: {
        type: String,
        required: true,
        default: "dQw4w9WgXcQ",
    },
    ageRestriction: {
        type: Number,
        required: true,
    },
    imdbRating: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;