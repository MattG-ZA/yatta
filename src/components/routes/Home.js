import React, { Component } from 'react';
import { GetTwitchGames, GetMixerGames } from '../../util/Api';
import { ConsolidateGameLists } from '../../util/ArrayHelpers';
import GameContainer from '../gameContainer/GameContainer';
import LoadingIndicator from '../loadingIndicator/LoadingIndicator';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            twitchStreams: [],
            mixerStreams: [],
            consolidatedGamesList: [],
            loadingGames: false,
        };

        this.GetGameData = this.GetGameData.bind(this);
        this.RunOnScroll = this.RunOnScroll.bind(this);
    }

    // Gets game data from Twitch and Mixer and returns consolidated list
    async GetGameData(limit) {
        // Only fetch more games if there isn't another load already running
        if (!this.state.loadingGames) {
            this.setState({
                page: this.state.page + 1,
                loadingGames: true,
            });

            const twitchGameData = await GetTwitchGames(limit, this.state.page * limit);
            const mixerGameData = await GetMixerGames(limit, this.state.page);
            const consolidatedGamesList = await ConsolidateGameLists(twitchGameData, mixerGameData);

            this.setState({ loadingGames: false });

            return consolidatedGamesList;
        }
    }

    // Function attached to scroll event
    async RunOnScroll(event) {
        const scrollHeight = event.target.scrollingElement.scrollHeight;
        const clientHeight = event.target.scrollingElement.clientHeight;
        const scrollTop = event.target.scrollingElement.scrollTop;

        // Check if scroll is at bottom of screen
        if (scrollHeight - clientHeight === scrollTop) {
            // Fetch the next batch of 12 games and append them to the displayed list
            const nextGameBatch = await this.GetGameData(12);

            if (nextGameBatch) {
                this.setState({ consolidatedGamesList: this.state.consolidatedGamesList.concat(nextGameBatch) });
            }
        }
    }

    async componentDidMount() {
        window.addEventListener('scroll', this.RunOnScroll);

        // Get initial list of top 24 games from both platforms
        const consolidatedGamesList = await this.GetGameData(24);
        this.setState({ consolidatedGamesList });
    }

    render() {
        if (this.state.consolidatedGamesList.length > 0) {
            return (
                <span>
                    <GameContainer games={this.state.consolidatedGamesList} history={this.props.history} />
                    {this.state.loadingGames && <LoadingIndicator loadingBatch={true} />}
                </span>
            );
        }
        else {
            return <LoadingIndicator loadingBatch={false} />;
        }
    }
}

export default Home;