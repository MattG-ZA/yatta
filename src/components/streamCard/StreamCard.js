import React from 'react';
import '../streamCard/StreamCard.css';
import TwitchIcon from '../../resources/Twitch.png';
import MixerIcon from '../../resources/Mixer.png';
import { NumberWithCommas } from '../../util/StringHelpers';
import { NavLink } from 'react-router-dom';

class StreamCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewingStream: false,
            selectedStream: '',
            streamType: '',
        };
    }

    HandleStreamSelection = (stream) => {
        this.setState({
            viewingStream: true,
            selectedStream: stream.url,
            streamType: stream.Type,
        });
    }

    GetDetailByType(stream) {
        const icon = stream.type === 'twitch' ? TwitchIcon : MixerIcon;

        return (
            <div>
                <img className='stream-icon' src={icon} alt={`${stream.type}Icon`} />
                <span className='stream-viewers'>{NumberWithCommas(stream.viewers)} viewers</span>
            </div>
        )
    }

    render() {
        const { stream, topStream } = this.props;

        const streamCardImageStyle = topStream ? 'stream-card-image-top' : 'stream-card-image';
        const streamCardContainerStyle = topStream ? 'stream-card-container-top' : 'stream-card-container';
        const streamCardTitleContainerStyle = topStream ? 'stream-card-title-container-top' : 'stream-card-title-container';

        const streamDetail = this.GetDetailByType(stream);
        const stringSplit = stream.url.split("/");
        const url = stringSplit[stringSplit.length - 1];

        return (
            <div className={streamCardContainerStyle}>
                <NavLink to={{ pathname: '/stream', state: { stream: stream, url: url } }}>
                    <div className='stream-card' onClick={() => { this.HandleStreamSelection(stream) }}>
                        <span className='stream-card-image-container'>
                            <img className={streamCardImageStyle} src={stream.image} alt='StreamImage' />
                        </span>
                    </div>
                </NavLink>
                <div className={streamCardTitleContainerStyle}>
                    <img className='stream-card-logo' src={stream.logo} alt='StreamLogo' />
                    <span className='stream-card-title'>{stream.name}</span>
                </div>
                {topStream && streamDetail}
            </div>
        );
    }
}

export default StreamCard;