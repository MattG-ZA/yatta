import React from 'react';
import { NumberWithCommas } from '../../../util/StringHelpers';
import TwitchIcon from '../../../resources/Twitch.png';
import MixerIcon from '../../../resources/Mixer.png';

const GameCardDetails = (props) => {
    const { game } = props;

    return (
        <span>
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
    );
}

export default GameCardDetails;