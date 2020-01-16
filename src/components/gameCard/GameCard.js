import React from 'react';
import './GameCard.css';
import GameCardDetails from './ui/GameCardDetails';
import { NavLink } from 'react-router-dom';

class GameCard extends React.Component {
    render() {
        const { game, topGame } = this.props;

        if (game) {
            const gameCardImageClass = game.usingTwitchImage ? 'card-image' : 'card-mixer-image';
            // The Top Games cards will resize dynamically with the screen, other cards will maintain their sizes
            const cardStyleOverride = topGame ? { maxWidth: '100%', maxHeight: '100%' } : { height: '250px', width: '179px' };

            return (
                <div className='card'>
                    <NavLink to={{ pathname: '/streams', state: { gameprops: game } }}>
                        <span className='card-image-container'>
                            <img className={gameCardImageClass} src={game.image} style={cardStyleOverride} alt='GameImage' />
                            {!game.usingTwitchImage &&
                                <img className='card-background' src={game.image} style={cardStyleOverride} alt='ImageBackground' />
                            }
                            {!topGame &&
                                <span className='card-overlay'>
                                    <GameCardDetails game={game} />
                                </span>
                            }
                        </span>
                    </NavLink>
                    {
                        topGame && <GameCardDetails game={game} />
                    }
                </div>
            );
        }

        return null;
    }
}

export default GameCard;