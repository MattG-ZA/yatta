import React from 'react';
import './StreamContainer.css';
import StreamCard from '../streamCard/StreamCard';

class StreamContainer extends React.Component {
    render() {
        const { games } = this.props;
        return (
            <span className='container'>
                {
                    games.map((game, index) => {
                        return <StreamCard key={index} game={game} />
                    })
                }
            </span>
        );
    }
}

export default StreamContainer;