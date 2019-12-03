import React from 'react';
import './GameContainer.css';
import GameCard from '../gameCard/GameCard';

class GameContainer extends React.Component {
    render() {
        const { games } = this.props;

        return (
            <span className='container'>
                <div className='top-games'>
                    {games.splice(0, 4).map((game, index) => {
                        return <GameCard key={index} game={game} topGame={true} />
                    })
                    }
                </div>
                {
                    games.map((game, index) => {
                        return <GameCard key={index} game={game} topGame={false} />
                    })
                }
            </span>
        );
    }
}

export default GameContainer;