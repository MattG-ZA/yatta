import React from 'react';
import './GameCard.css';
import TwitchIcon from '../../resources/Twitch.png';
import MixerIcon from '../../resources/Mixer.png';
import { NumberWithCommas } from '../../util/StringHelpers';
import { NavLink } from 'react-router-dom';

class GameCard extends React.Component {
    render() {
        const { game, topGame } = this.props;
 
        if (game) {
            const gameCardImageClass = game.usingTwitchImage ? 'card-image' : 'card-mixer-image';
            const cardHeight = topGame ? '380px' : '250px';
            const cardWidth = topGame ? '272px' : '179px';

            return (
                <div className='card'>
                    <NavLink to={{ pathname: '/streams', state: { gameprops: game } }}>
                        <span className='card-image-container'>
                            <img className={gameCardImageClass} src={game.image} style={{ height: cardHeight, width: cardWidth }} alt='GameImage' />
                            {!game.usingTwitchImage &&
                                <img className='card-background' src={game.image} style={{ height: cardHeight, width: cardWidth }} alt='ImageBackground' />
                            }
                        </span>
                    </NavLink>
                    {
                        topGame && <span>
                            <div className='card-title'>{game.name}</div>
                            <div>
                                <img className='icon' src={TwitchIcon} alt='TwitchIcon' />
                                <span className='viewers'>{NumberWithCommas(game.twitchViewers)} viewers</span>
                            </div>
                            <div>
                                <img className='icon' src={MixerIcon} alt='MixerIcon' />
                                <span className='viewers'>{NumberWithCommas(game.mixerViewers)} viewers</span>
                            </div>
                        </span>
                    }
                </div>
            );
        }

        return null;
    }
}

export default GameCard;