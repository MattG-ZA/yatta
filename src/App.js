import React, { Component } from 'react';
import { GetTwitchStreams, GetMixerStreams, GetTwitchGames, GetMixerGames } from './util/Api';
import { ConsolidateGameLists } from './util/ArrayHelpers';
import GameContainer from './components/gameContainer/GameContainer';
import LoadingIndicator from './components/loadingIndicator/LoadingIndicator';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            twitchStreams: [],
            mixerStreams: [],
            consolidatedGamesList: [],
        };
    }

    async componentDidMount() {
        // const twitchStreamData = await GetTwitchStreams();
        // const mixerStreamData = await GetMixerStreams();

        const twitchGameData = await GetTwitchGames();
        const mixerGameData = await GetMixerGames();

        const consolidatedGamesList = await ConsolidateGameLists(twitchGameData, mixerGameData);

        this.setState({
            // twitchStreams: twitchStreamData,
            // mixerStreams: mixerStreamData,
            consolidatedGamesList,
        });
    }

    render() {
        if (this.state.consolidatedGamesList.length > 0) {
            return <GameContainer games={this.state.consolidatedGamesList} />;
        }
        else {
            return <LoadingIndicator />;
        }
    }
}

export default App;