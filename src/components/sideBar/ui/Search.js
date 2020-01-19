import React from 'react';
import '../SideBar.css';

class Search extends React.Component {
    render() {
        const { expanded } = this.props;

        const searchClass = expanded ? 'search-container' : 'search-container-hidden';

        return (
            <span className={searchClass}>
                <input className='search' placeholder='Search' />
            </span>
        );
    }
}

export default Search;