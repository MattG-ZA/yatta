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
        let selectedGameStream = this.props.location.state.streamProps;
    }

    render() {
        const { game, url} = this.props.location.state;
        return (<div>
            {game.type === 'twitch' && <div className="stream-iframe-view">
                <iframe
                    src={"https://player.twitch.tv/?channel=" + url + "&autoplay=true"}
                    height="720"
                    width="1280"
                    frameborder="0"
                    scrolling="no"
                    allowfullscreen="true">
                </iframe></div>
                
            }

            {game.type === 'mixer'  && <div className="stream-iframe-view">
                <iframe src={"https://mixer.com/embed/player/" + game.streamerName}
                    height="720"
                    width="1280"
                    frameborder="0"
                    scrolling="no"
                ></iframe>
                <iframe src={"https://mixer.com/embed/chat/" + game.streamerName}>

                </iframe>
            </div>}
            </div>
        );
    }
}

export default Stream;
