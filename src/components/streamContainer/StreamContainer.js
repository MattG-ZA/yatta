import React from 'react';
import './StreamContainer.css';
import StreamCard from '../streamCard/StreamCard';

class StreamContainer extends React.Component {
    render() {
        const { streams, gameDetails } = this.props;
        
        return (
            <span>
                <span className='stream-container-header'>{gameDetails.name}</span>
                <span className='stream-container'>
                    {
                        streams.map((stream, index) => {
                            return <StreamCard key={index} stream={stream} />
                        })
                    }
                </span>
            </span>
        );
    }
}

export default StreamContainer;