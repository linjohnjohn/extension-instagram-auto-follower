/* global chrome */
import React from 'react';
import { Link } from 'react-router-dom';

import Session from '../models/Session';
import K from '../constants';

export default class extends React.Component {
    state = {
        sessions: [],
        isSessionManagerActive: false,
    }

    componentDidMount = async () => {
        const sessions = await Session.getAllSessions();
        console.log(sessions);
        this.setState({ sessions });

        chrome.runtime.sendMessage({ type: K.messageTypes.IS_SESSION_MANAGER_ACTIVE }, (response) => {
            const { isSessionManagerActive } = response;
            this.setState({ isSessionManagerActive });
        })
    }

    handleRunSessions = async () => {
        chrome.runtime.sendMessage({ type: K.messageTypes.START_SESSION_MANAGER });
        this.setState({ isSessionManagerActive: true });
    }

    handleStopSessions = async () => {
        chrome.runtime.sendMessage({ type: K.messageTypes.END_SESSION_MANAGER });
        this.setState({ isSessionManagerActive: false });
    }


    handleAddSession = async () => {
        const { sessions } = this.state;
        const newSession = await Session.createSession()
        this.setState({ sessions: [...sessions, newSession] });
    }

    handleDeleteSession = async (sessionId) => {
        const newSessions = await Session.deleteSession(sessionId);
        this.setState({ sessions: newSessions });
    }

    render() {
        const { sessions, isSessionManagerActive } = this.state;

        return <div className="container">
            <div class='row justify-content-center'>
                <div class='col-6'>
                    <h1>Sessions</h1>
                    {isSessionManagerActive ?
                        <button class='btn btn-success btn-block' onClick={this.handleStopSessions}>End Sessions</button> :
                        <button class='btn btn-success btn-block' onClick={this.handleRunSessions}>Run Sessions</button>
                    }
                    <form>
                        <button
                            type="button"
                            class="btn btn-primary btn-block"
                            onClick={this.handleAddSession}>Add Session</button>
                    </form>



                    <div class="list-group">
                        {sessions.map((session) => {
                            return <li class='list-group-item list-group-item-action d-flex flex-row justify-content-between'>
                                <Link to={`/session/${session.uid}`} class='text-dark'>
                                    {session.uid}
                                </Link>
                                <a href='# ' class='text-danger' onClick={() => this.handleDeleteSession(session.uid)}>Delete</a>
                            </li>
                        })}
                    </div>
                </div>
            </div>
        </div>
    }
}