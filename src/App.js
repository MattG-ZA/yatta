import React, { Component } from 'react';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Home from '../src/components/routes/Home';
import Streams from '../src/components/routes/Streams';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Route path={process.env.PUBLIC_URL + '/'} component={Home} exact={true} />
                <Route path={process.env.PUBLIC_URL + '/streams'} component={Streams} exact={true} />
            </BrowserRouter>
        )
    }
}

export default App;