import React from 'react';
import '../GameContainer.css';
import GameCard from '../../gameCard/GameCard';

const TopGamesContainer = (props) => {
    const { topGames } = props;

    return (
        <span className='top-games'>
            {
                topGames.map((game, index) => {
                    return <GameCard key={index} game={game} topGame={true} />
                })
            }
        </span>
    );
}

export default TopGamesContainer;