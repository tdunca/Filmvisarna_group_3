import React from 'react';
import './Home.css';
import MovieCollectionSection  from '../../..//components/MovieCollectionSection/MovieCollectionSection';
import ScheduleSection from '../../../components/ScheduleSection/ScheduleSection';

const Home: React.FC = () => {
  return (
    <div>
        <h1>Welcome to the Cinema Website - Home</h1>
        <p>This is the home page</p>
				<section>
					<h2>På bio idag</h2>
				</section>
				<section>
					<h2>Våra filmer</h2>
					<MovieCollectionSection />
			</section>
			<section>
				<h2>Program</h2>
				<ScheduleSection date={new Date()} />
				</section>
    </div>
  );
};

export default Home;