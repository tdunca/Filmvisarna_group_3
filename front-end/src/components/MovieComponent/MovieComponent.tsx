import React from 'react';
import { Link } from 'react-router-dom';
import './MovieComponent.scss';

interface MovieButtonProps {
	_id: string;
	title: string;
	year: number;
	poster: string;
	genre: string[];
	ageRestriction: number;
}

const MovieComponent: React.FC<MovieButtonProps> = ({ _id, title, year, poster, genre, ageRestriction }) => {
	return (
		<Link to={`/movie-info/${_id}`}>
			<article className="movie-button">
				<img src={poster} alt={title} />
				<h2>{title}</h2>
				<p>{year}</p>
				<p>{genre.join(', ')}</p>
				<p>{ageRestriction}</p>
			</article>
		</Link>
	);
};

export default MovieComponent;
