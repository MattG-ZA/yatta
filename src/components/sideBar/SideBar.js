import React from 'react';
import './SideBar.css';
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
        const sideBarClass = this.state.expanded ? 'side-bar' : 'side-bar-collapsed';
        const headerClass = this.state.expanded ? 'side-bar-header' : 'side-bar-header-hidden';
        const collapseClass = this.state.expanded ? 'side-bar-collapse' : 'side-bar-collapse-hidden';

        return (
            <span className={sideBarClass}>
                <span className={headerClass}>y a t t a</span>
                <img className={collapseClass} src={LeftChevron} alt='LeftChevron' onClick={this.ToggleSideBar} />
                {!this.state.expanded && <img className='side-bar-expand' src={YattaLogo} alt='YattaLogo' onClick={this.ToggleSideBar} />}
            </span>
        );
    }
}

export default SideBar;