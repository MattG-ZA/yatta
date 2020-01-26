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
        console.log('this.props.location.state.streamProps',this.props.location.state);
        const height = window.innerHeight;
        new window.Twitch.Embed("twitch-embed", {
            width: "100%",
            height: height,
            channel: this.props.location.state.game.name
            });
    }

    render() {
        const { game, url} = this.props.location.state;
        const height = window.innerHeight;
       
        return (
        <div>
            {game.type === 'twitch' && <div className="stream-iframe-view">
                <div id="twitch-embed"></div>
                </div>
            }

            {game.type === 'mixer'  && <div className="stream-iframe-view">
                <iframe src={"https://mixer.com/embed/player/" + game.streamerName}
                    height={height}
                    width="80%"
                    frameborder="0"
                    scrolling="no"
                ></iframe>
                <iframe src={"https://mixer.com/embed/chat/" + game.streamerName}
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
