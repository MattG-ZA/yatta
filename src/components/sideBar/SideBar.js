import React from 'react';
import './SideBar.css';
import Search from './ui/Search';
import LeftChevron from '../../resources/LeftChevron.png';
import YattaLogo from '../../resources/YattaLogo.png';

class SideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = { expanded: true };
    }

    ToggleSideBar = () => {
        this.setState({ expanded: !this.state.expanded });
    }

    render() {
        const { searchGameFunction } = this.props;

        // Swapping classes for animation purposes
        const sideBarClass = this.state.expanded ? 'side-bar' : 'side-bar-collapsed',
            headerClass = this.state.expanded ? 'side-bar-header' : 'side-bar-header-hidden',
            collapseClass = this.state.expanded ? 'side-bar-collapse' : 'side-bar-collapse-hidden',
            expandClass = this.state.expanded ? 'side-bar-expand-hidden' : 'side-bar-expand';

        return (
            <span className={sideBarClass}>
                <span className={headerClass}>y a t t a</span>
                <img className={collapseClass} src={LeftChevron} alt='LeftChevron' onClick={this.ToggleSideBar} />
                <img className={expandClass} src={YattaLogo} alt='YattaLogo' onClick={this.ToggleSideBar} />
                <Search expanded={this.state.expanded} searchGameFunction={searchGameFunction} />
            </span>
        );
    }
}

export default SideBar;