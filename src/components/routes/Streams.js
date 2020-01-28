import React, { Component } from 'react';
import { GetTwitchStreams, GetMixerStreams } from '../../util/Api';
import { ConsolidateStreamLists } from '../../util/ArrayHelpers';
import StreamContainer from '../streamContainer/StreamContainer';
import LoadingIndicator from '../loadingIndicator/LoadingIndicator';
import SideBar from '../sideBar/SideBar';

class Streams extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            consolidatedStreamList: [],
            loadingStreams: false,
            gameDetails: {},
        };
    }

    async componentDidMount() {
        const selectedGameStream = this.props.location.state.gameprops;

        this.setState({ gameDetails: selectedGameStream });
        
        if (selectedGameStream) {
            this.setState({ loadingStreams: true });

            const twitchGameStreams = await GetTwitchStreams(selectedGameStream.name);
            const mixerGameStreams = await GetMixerStreams(selectedGameStream.mixerGameId);
            const consolidatedStreamList = await ConsolidateStreamLists(twitchGameStreams, mixerGameStreams);

            this.setState({
                consolidatedStreamList,
                loadingStreams: false,
            });
        }
    }

    render() {
        return (
            <span style={{ display: 'flex' }}>
                <SideBar searchGameFunction={this.SearchGame} />
                {!this.state.loadingStreams && <StreamContainer streams={this.state.consolidatedStreamList} gameDetails={this.state.gameDetails} />}
                {this.state.loadingStreams && <LoadingIndicator loadingBatch={false} />}
            </span>
        )
    }
}

export default Streams;