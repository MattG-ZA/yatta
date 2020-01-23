import React from 'react';
import './GameContainer.css';
import TopGamesContainer from './ui/TopGamesContainer';
import MoreGamesContainer from './ui/MoreGamesContainer';
import SearchGamesContainer from './ui/SearchGamesContainer';

class GameContainer extends React.Component {
    render() {
        const { games, searchParams } = this.props;

        const topGames = games.slice(0, 5);
        const moreGames = games.slice(5, games.length);

        return (
            <span className='game-container'>
                {!searchParams.searched && <TopGamesContainer topGames={topGames} />}
                {!searchParams.searched && <MoreGamesContainer moreGames={moreGames} />}
                {searchParams.searched && <SearchGamesContainer searchGames={games} searchTerm={searchParams.term} />}
            </span>
        );
    }
}

export default GameContainer;