import React from 'react';
import './GameContainer.css';
import TopGamesContainer from './ui/TopGamesContainer';
import MoreGamesContainer from './ui/MoreGamesContainer';

class GameContainer extends React.Component {
    render() {
        const { games } = this.props;

        const topGames = games.slice(0, 5);
        const moreGames = games.slice(5, games.length);

        return (
            <span className='game-container'>
                <TopGamesContainer topGames={topGames} />
                <MoreGamesContainer moreGames={moreGames} />
            </span>
        );
    }
}

export default GameContainer;