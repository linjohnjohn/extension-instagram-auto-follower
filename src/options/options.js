import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import SessionOverview from './SessionOverview';
import SessionView from './SessionView';
import TaskView from './TaskView';

const App = () => {
    return <Router>
        <Switch>
            <Route exact={true} path='/options.html'>
                <SessionOverview />
            </Route>
            <Route exact={true} path='/session/:sessionId' component={SessionView} />
            <Route exact={true} path='/session/:sessionId/task/:taskId' component={TaskView} />
        </Switch>
    </Router>
}

ReactDOM.render(<App />, document.getElementById('root'));