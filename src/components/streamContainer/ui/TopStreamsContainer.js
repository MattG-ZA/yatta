import React from 'react';
import '../StreamContainer.css';
import StreamCard from '../../streamCard/StreamCard';

const TopStreamsContainer = (props) => {
    const { topStreams } = props;

    return (
        <span>
            <span className='top-streams-header'>Top Streams</span>
            <span className='top-streams'>
                {
                    topStreams.map((stream, index) => {
                        return <StreamCard key={index} stream={stream} topStream={true} />
                    })
                }
            </span>
        </span>
    );
}

export default TopStreamsContainer;