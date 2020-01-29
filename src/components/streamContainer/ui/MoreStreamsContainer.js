import React from 'react';
import '../StreamContainer.css';
import StreamCard from '../../streamCard/StreamCard';

const MoreStreamsContainer = (props) => {
    const { moreStreams } = props;
    const dummyCards = [];

    // Add a row of dummy cards to allow the last row to always be spaced correctly across the container
    for (let i = 0; i < 7; i++) {
        dummyCards.push(<span key={`dummy${i}`} className='stream-dummy-card' />);
    }

    return (
        <span className='more-streams-container'>
            <span className='more-streams-header'>Explore</span>
            <span className='more-streams'>
                {
                    moreStreams.map((stream, index) => {
                        return <StreamCard key={index} stream={stream} topStream={false} />
                    })
                }
                {
                    dummyCards
                }
            </span>
        </span>
    );
}

export default MoreStreamsContainer;