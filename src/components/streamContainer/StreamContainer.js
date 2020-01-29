import React from 'react';
import './StreamContainer.css';
import TopStreamsContainer from './ui/TopStreamsContainer';
import MoreStreamsContainer from './ui/MoreStreamsContainer';

class StreamContainer extends React.Component {
    render() {
        const { streams } = this.props;

        const topStreams = streams.slice(0, 3);
        const moreStreams = streams.slice(3, streams.length);
        
        return (
            <span className='stream-container'>
                <TopStreamsContainer topStreams={topStreams} />
                <MoreStreamsContainer moreStreams={moreStreams} />
            </span>
        );
    }
}

export default StreamContainer;