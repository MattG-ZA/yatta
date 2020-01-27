import React, { Component } from 'react';
import { GetTwitchGames, GetMixerGames, GetSingleTwitchGame, GetSingleMixerGame } from '../../util/Api';
import { ConsolidateGameListsV2 } from '../../util/ArrayHelpers';
import { StringStripper } from '../../util/StringHelpers';
import GameContainer from '../gameContainer/GameContainer';
import LoadingIndicator from '../loadingIndicator/LoadingIndicator';
import SideBar from '../sideBar/SideBar';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            twitchStreams: [],
            mixerStreams: [],
            consolidatedGamesList: [],
            loadingGames: false,
            searchParams: { term: '', searched: false },
        };

        this.GetGameData = this.GetGameData.bind(this);
        this.RunOnScroll = this.RunOnScroll.bind(this);
        this.SearchGame = this.SearchGame.bind(this);
    }

    // Gets game data from Twitch and Mixer and returns consolidated list
    async GetGameData(limit, firstLoad) {
        // Only fetch more games if there isn't another load already running
        if (!this.state.loadingGames) {
            this.setState({ loadingGames: true });

            const twitchGameData = await GetTwitchGames(limit, this.state.page * limit, firstLoad);
            const mixerGameData = await GetMixerGames(limit, this.state.page);
            const consolidatedGamesList = await ConsolidateGameListsV2(twitchGameData, mixerGameData, limit);

            this.setState({
                loadingGames: false,
                page: this.state.page + 1,
            });

            return consolidatedGamesList;
        }
    }

    // Function attached to scroll event
    async RunOnScroll(event) {
        // Only run when not showing search results
        if (!this.state.searchParams.searched) {
            const scrollHeight = event.target.scrollingElement.scrollHeight;
            const clientHeight = event.target.scrollingElement.clientHeight;
            const scrollTop = event.target.scrollingElement.scrollTop;

            // Check if scroll is at bottom of screen
            if (scrollHeight - clientHeight === scrollTop) {
                // Fetch the next batch of 24 games and append them to the displayed list
                const nextGameBatch = await this.GetGameData(24, false);

                if (nextGameBatch) {
                    // Make sure we're only adding unique games to the list
                    const gamesToAdd = nextGameBatch.filter(x => {
                        return (
                            !this.state.consolidatedGamesList.find(y => y.name === x.name) &&
                            !this.state.consolidatedGamesList.find(y => StringStripper(y.name) === StringStripper(x.name))
                        );
                    });
                    const consolidatedGamesList = this.state.consolidatedGamesList.concat(gamesToAdd);

                    // Sort the new overall list of games
                    consolidatedGamesList.sort((a, b) => (a.totalViewers < b.totalViewers) ? 1 : -1);

                    this.setState({ consolidatedGamesList });
                }
            }
        }
    }

    // Function to fetch and consolidate games from search
    async SearchGame(e) {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value;

            const twitchGameData = await GetSingleTwitchGame(searchTerm);
            const mixerGameData = await GetSingleMixerGame(searchTerm);

            if (!this.state.loadingGames) {
                this.setState({ loadingGames: true });

                // twitchGameData.games is used due to different format returned by GetSingleTwitchGame
                const consolidatedGamesList = await ConsolidateGameListsV2(twitchGameData.games, mixerGameData);

                this.setState({
                    consolidatedGamesList,
                    loadingGames: false,
                    page: 0,
                    searchParams: { term: searchTerm, searched: true },
                });
            }
        }
    }

    async componentDidMount() {
        window.addEventListener('scroll', this.RunOnScroll);

        // Get initial list of top 24 games from both platforms
        const consolidatedGamesList = await this.GetGameData(24, true);
        this.setState({ consolidatedGamesList });
    }

    render() {
        const finishedLoad = (this.state.consolidatedGamesList.length > 0 || this.state.searchParams.searched) && !this.state.loadingGames;

        return (
            <span style={{ display: 'flex' }}>
                <SideBar searchGameFunction={this.SearchGame} />
                {
                    finishedLoad && <span>
                        {/* history={this.props.history} - look into this */}
                        <GameContainer
                            games={this.state.consolidatedGamesList}
                            searchParams={this.state.searchParams}
                            history={this.props.history}
                        />
                        {this.state.loadingGames && <LoadingIndicator loadingBatch={true} />}
                    </span>
                }
                {
                    !finishedLoad && <LoadingIndicator loadingBatch={false} />
                }
            </span>
        );
    }
}

export default Home;