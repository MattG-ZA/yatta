import React from 'react';
import '../GameContainer.css';
import GameCard from '../../gameCard/GameCard';

const MoreGamesContainer = (props) => {
    const { moreGames } = props;

    return (
        <span className='more-games'>
            {
                moreGames.map((game, index) => {
                    return <GameCard key={index} game={game} topGame={false} />
                })
            }
        </span>
    );
}

export default MoreGamesContainer;