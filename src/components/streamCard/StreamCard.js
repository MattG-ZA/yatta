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
    handleStreamSelection = (game) => {
        this.setState({
            viewingStream: true,
            selectedStream: game.url,
            streamType: game.Type,
        });
    }
    getDetailByType(game){
        if(game.type === 'mixer'){
            return (<div>
                        <img className='stream-icon' src={MixerIcon} alt='MixerIcon' />
                        <span className='stream-viewers'>{NumberWithCommas(game.viewers)} viewers</span>
                    </div>)
        }
        else{
            return  (<div>
                        <img className='stream-icon' src={TwitchIcon} alt='TwitchIcon' />
                        <span className='stream-viewers'>{NumberWithCommas(game.viewers)} viewers</span>
                    </div>)
        }
	}

    render() {
		const { game } = this.props;
		const gameCardImageClass = game.type === 'twitch' ? 'stream-card-image' : 'stream-card-image';
        const gameDetail = this.getDetailByType(game);
		const stringSplit = game.url.split("/");
		
		const url = stringSplit[stringSplit.length - 1]; 
        return (
			<NavLink to={{ pathname:'/stream', state: { game: game, url: url} }}>
			<div className='stream-card' onClick={ () => {this.handleStreamSelection(game)} }>
			<span className='stream-card-image-container'>
				<img className={gameCardImageClass} src={game.image} alt='GameImage' />
				{!game.type === 'twitch' && <img className='stream-card-background' src={game.image} alt='ImageBackground' />}
			</span>
			<div className='stream-card-title'>
			{game.name}
			</div>
				{gameDetail}
		</div>
		</NavLink>
        );
    }
}

export default StreamCard;