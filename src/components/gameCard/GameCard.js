import React from 'react';
import './GameCard.css';
import TwitchIcon from '../../resources/Twitch.png';
import MixerIcon from '../../resources/Mixer.png';
import { NumberWithCommas } from '../../util/StringHelpers';

class GameCard extends React.Component {
    render() {
        const { game } = this.props;

        const gameCardImageClass = game.usingTwitchImage ? 'card-image' : 'card-mixer-image';

        return (
            <div className='card'>
                <span className='card-image-container'>
                    <img className={gameCardImageClass} src={game.image} alt='GameImage' />
                    {!game.usingTwitchImage && <img className='card-background' src={game.image} alt='ImageBackground' />}
                </span>
                <div className='card-title'>{game.name}</div>
                <div>
                    <img className='icon' src={TwitchIcon} alt='TwitchIcon' />
                    <span className='viewers'>{NumberWithCommas(game.twitchViewers)} viewers</span>
                </div>
                <div>
                    <img className='icon' src={MixerIcon} alt='MixerIcon' />
                    <span className='viewers'>{NumberWithCommas(game.mixerViewers)} viewers</span>
                </div>
            </div>
        );
    }
}

export default GameCard;