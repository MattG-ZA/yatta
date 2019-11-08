import React, { Component } from 'react';
import { GetTwitchGames, GetMixerGames } from '../../util/Api';
import { ConsolidateGameLists } from '../../util/ArrayHelpers';
import GameContainer from '../gameContainer/GameContainer';
import LoadingIndicator from '../loadingIndicator/LoadingIndicator';


class Home extends Component {
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
            return <GameContainer games={this.state.consolidatedGamesList} history={this.props.history} />;
        }
        else {
            return <LoadingIndicator />;
        }
    }
}

export default Home;
