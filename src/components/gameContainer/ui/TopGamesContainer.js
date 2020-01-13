import React from 'react';
import '../GameContainer.css';
import GameCard from '../../gameCard/GameCard';

const TopGamesContainer = (props) => {
    const { topGames } = props;

    return (
        <span>
            <span className='top-games-header'>Top Games</span>
            <span className='top-games'>
                {
                    topGames.map((game, index) => {
                        return <GameCard key={index} game={game} topGame={true} />
                    })
                }
            </span>
        </span>
    );
}

export default TopGamesContainer;