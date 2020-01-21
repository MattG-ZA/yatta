import React from 'react';
import '../SideBar.css';
import { GetSingleTwitchGame, GetSingleMixerGame } from '../../../util/Api';

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.SearchGame = this.SearchGame.bind(this);
    }

    async SearchGame(e) {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value;
            console.log('searchTerm ', searchTerm);
            const twitchGameData = await GetSingleTwitchGame(searchTerm);
            const mixerGameData = await GetSingleMixerGame(searchTerm);
            console.log('twitchGameData ', twitchGameData);
            console.log('mixerGameData ', mixerGameData);
        }
    }

    render() {
        const { expanded } = this.props;

        const searchClass = expanded ? 'search-container' : 'search-container-hidden';

        return (
            <span className={searchClass}>
                <input className='search' placeholder='Search' onKeyDown={this.SearchGame} />
            </span>
        );
    }
}

export default Search;