import React from 'react';
import './GameCard.css';
import TwitchIcon from '../../resources/Twitch.png';
import MixerIcon from '../../resources/Mixer.png';
import { NumberWithCommas } from '../../util/StringHelpers';
import { NavLink } from 'react-router-dom';

class GameCard extends React.Component {
    render() {
        const { game } = this.props;
        if (game) {
            const gameCardImageClass = game.usingTwitchImage ? 'card-image' : 'card-mixer-image';

            return (
                <div className='card'>
                    <NavLink to={{ pathname:'/streams', state: { gameprops: game} }}>
                        <span className='card-image-container'>
                            <img className={gameCardImageClass} src={game.image} alt='GameImage' />
                            {!game.usingTwitchImage && <img className='card-background' src={game.image} alt='ImageBackground' />}
                        </span>
                    </NavLink>
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

        return null;
    }
}

export default GameCard;