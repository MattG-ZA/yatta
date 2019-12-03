import React, { Component } from 'react';
import StreamContainer from '../streamContainer/StreamContainer';
import {GetTwitchStreams, GetMixerStreams} from '../../util/Api';
import {ConsolidateStreamLists} from '../../util/ArrayHelpers';
class Streams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            consolidatedStreamList: [],
        };
    }

    async componentDidMount() {
        let selectedGameStream = this.props.location.state.gameprops;
        const twitchGameStreams = await GetTwitchStreams(selectedGameStream.name);
        const mixerGameStreams = await GetMixerStreams(selectedGameStream.mixerGameId);
        const consolidatedStreamList = await ConsolidateStreamLists(twitchGameStreams, mixerGameStreams);
        this.setState({
            consolidatedStreamList,
        });
    }

    render() {
        return (
            <div>{<StreamContainer games={this.state.consolidatedStreamList}/>}</div>
        )
    }
}

export default Streams;
