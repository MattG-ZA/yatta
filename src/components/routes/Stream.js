import React, { Component } from 'react';
import StreamContainer from '../streamContainer/StreamContainer';
import { GetTwitchStreams, GetMixerStreams } from '../../util/Api';
import { ConsolidateStreamLists } from '../../util/ArrayHelpers';

class Stream extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            consolidatedStreamList: [],
        };
    }

    async componentDidMount() {
        console.log('this.props.location.state.streamProps', this.props.location.state);
        const height = window.innerHeight;
        new window.Twitch.Embed("twitch-embed", {
            width: "100%",
            height: height,
            channel: this.props.location.state.stream.name
        });
    }

    render() {
        const { stream, url } = this.props.location.state;
        const height = window.innerHeight;

        return (
            <div>
                {stream.type === 'twitch' && <div className="stream-iframe-view">
                    <div id="twitch-embed"></div>
                </div>
                }

                {stream.type === 'mixer' && <div className="stream-iframe-view">
                    <iframe src={"https://mixer.com/embed/player/" + stream.streamerName}
                        height={height}
                        width="80%"
                        frameborder="0"
                        scrolling="no"
                    ></iframe>
                    <iframe src={"https://mixer.com/embed/chat/" + stream.streamerName}
                        width="20%"
                        frameborder="0"
                        height={height}
                    >
                    </iframe>
                </div>}
            </div>
        );
    }
}

export default Stream;
