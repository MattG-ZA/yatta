import React from 'react';
import './GameContainer.css';
import GameCard from '../gameCard/GameCard';

class GameContainer extends React.Component {
    render() {
        const { games } = this.props;
        
        return (
            <span className='container'>
                {
                    games.map((game, index) => {
                        return <GameCard key={index} game={game} />
                    })
                }
            </span>
        );
    }
}

export default GameContainer;