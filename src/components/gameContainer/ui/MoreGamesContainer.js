import React from 'react';
import '../GameContainer.css';
import GameCard from '../../gameCard/GameCard';

const MoreGamesContainer = (props) => {
    const { moreGames } = props;
    const dummyCards = [];

    // Add a row of dummy cards to allow the last row to always be spaced correctly across the container
    for (let i = 0; i < 7; i++) {
        dummyCards.push(<span key={`dummy${i}`} className='dummy-card' />);
    }

    return (
        <span className='more-games-container'>
            <span className='more-games-header'>Explore</span>
            <span className='more-games'>
                {
                    moreGames.map((game, index) => {
                        return <GameCard key={index} game={game} topGame={false} />
                    })
                }
                {
                    dummyCards
                }
            </span>
        </span>
    );
}

export default MoreGamesContainer;