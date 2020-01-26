import React from 'react';
import './GameContainer.css';
import TopGamesContainer from './ui/TopGamesContainer';
import MoreGamesContainer from './ui/MoreGamesContainer';
import SearchGamesContainer from './ui/SearchGamesContainer';

class GameContainer extends React.Component {
    render() {
        const { games, searchParams } = this.props;

        // Change what's shown depending on whether search results must be displayed or not
        if (!searchParams.searched) {
            const topGames = games.slice(0, 5);
            const moreGames = games.slice(5, games.length);

            return (
                <span className='game-container'>
                    <TopGamesContainer topGames={topGames} />
                    <MoreGamesContainer moreGames={moreGames} />
                </span>
            );
        }
        else {
            return (
                <span className='game-container'>
                    <SearchGamesContainer searchGames={games} searchTerm={searchParams.term} />
                </span>
            );
        }
    }
}

export default GameContainer;