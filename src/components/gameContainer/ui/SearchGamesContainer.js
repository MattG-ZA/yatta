import React from 'react';
import '../GameContainer.css';
import GameCard from '../../gameCard/GameCard';

const SearchGamesContainer = (props) => {
    const { searchGames, searchTerm } = props;
    const dummyCards = [];

    // Add a row of dummy cards to allow the last row to always be spaced correctly across the container
    for (let i = 0; i < 7; i++) {
        dummyCards.push(<span key={`dummy${i}`} className='dummy-card' />);
    }
    
    return (
        <span>
            <span className='more-games-header'>"{searchTerm}"</span>
            <span className='more-games'>
                {
                    searchGames.map((game, index) => {
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

export default SearchGamesContainer;