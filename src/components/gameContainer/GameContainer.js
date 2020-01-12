import React from 'react';
import './GameContainer.css';
import GameCard from '../gameCard/GameCard';

class GameContainer extends React.Component {
    render() {
        const { games } = this.props;
        
        const topGames = games.slice(0, 5);
        const moreGames = games.slice(5, games.length);

        return (
            <span className='container'>
                <div className='top-games'>
                    {topGames.map((game, index) => {
                        return <GameCard key={index} game={game} topGame={true} />
                    })
                    }
                </div>
                {
                    moreGames.map((game, index) => {
                        return <GameCard key={index} game={game} topGame={false} />
                    })
                }
            </span>
        );
    }
}

export default GameContainer;