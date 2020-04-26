import React from 'react';
import { Link } from 'react-router-dom';

import Session from '../models/Session';

export default class extends React.Component {
    state = {
        sessions: [],
        newSessionUsername: '',
        newSessionPassword: ''
    }

    componentDidMount = async () => {
        const sessions = await Session.getAllSessions();
        console.log(sessions);
        this.setState({ sessions });
    }

    handleAddSession = async () => {
        const { sessions } = this.state;
        const { newSessionUsername, newSessionPassword } = this.state;
        const newSession = await Session.createSession(newSessionUsername, newSessionPassword)
        this.setState({ sessions: [ ...sessions, newSession ]});
    }

    render() {
        const { sessions, newSessionUsername, newSessionPassword } = this.state;

        return <div className="container">
            <div class='row justify-content-center'>
                <div class='col-6'>
                    <h1>Sessions</h1>
                    <form>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newSessionUsername}
                                onChange={(e) => {
                                    this.setState({ newSessionUsername: e.target.value })
                                }} />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newSessionPassword}
                                onChange={(e) => {
                                    this.setState({ newSessionPassword: e.target.value })
                                }} />
                        </div>
                        <button
                            type="button"
                            class="btn btn-primary"
                            onClick={this.handleAddSession}>Add Session</button>
                    </form>



                    <div class="list-group">
                        {sessions.map(session => {
                            return <Link to={`/session/${session.uid}`} class="list-group-item list-group-item-action">
                                {session.uid}
                            </Link>
                        })}
                    </div>
                </div>
            </div>
        </div>
    }
}