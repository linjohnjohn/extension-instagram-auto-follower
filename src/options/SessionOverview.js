/* global chrome */
import React from 'react';
import { Link } from 'react-router-dom';

import K from '../constants';
import SessionAPI from '../models/SessionAPI';
import Dnd from './dnd';

export default class extends React.Component {
    state = {
        sessionMap: {},
        sessionIdOrder: [],
        isSessionManagerActive: false,
        newSessionName: ''
    }

    dnd = null;

    componentDidMount = async () => {
        const sessions = await SessionAPI.getAllSessions();
        const sessionIdOrder = sessions.map(s => s.uid);
        const sessionMap = sessions.reduce((map, s) => {
            map[s.uid] = s;
            return map;
        }, {});
        this.setState({ sessionMap, sessionIdOrder });
        console.log(sessionMap);
        const parent = document.querySelector('#sessionList');
        const children = parent.querySelectorAll('li')
        const dnd = new Dnd(parent, this.handleDisplayNewOrder, this.handleSaveNewOrder);
        dnd.reinitializeChildren(children, sessionIdOrder);
        this.dnd = dnd;

        chrome.runtime.sendMessage({ type: K.messageTypes.IS_SESSION_MANAGER_ACTIVE }, (response) => {
            const { isSessionManagerActive } = response;
            this.setState({ isSessionManagerActive });
        })
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.sessionIdOrder !== prevState.sessionIdOrder) {
            const parent = document.querySelector('#sessionList');
            const children = parent.querySelectorAll('li');
            this.dnd && this.dnd.reinitializeChildren(children, this.state.sessionIdOrder);
        }
    }

    handleDisplayNewOrder = (newOrder) => {
        this.setState({ sessionIdOrder: newOrder });
    }

    handleSaveNewOrder = (newOrder) => {
        SessionAPI.reorderSession(newOrder);
    }

    handleChangeSessionEnabled = async (sessionId, enabled) => {
        const { sessionMap } = this.state;
        const updatedSession  = { ...sessionMap[sessionId], isEnabled: enabled };
        await SessionAPI.updateSession(sessionId, updatedSession);
        const newSessionMap = { ...sessionMap, [sessionId]: updatedSession };
        this.setState({ sessionMap: newSessionMap });
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
        const { sessionMap, sessionIdOrder, newSessionName } = this.state;
        if (newSessionName) {
            const newSession = await SessionAPI.createSession(newSessionName);
            const newSessionMap = { ...sessionMap, [newSession.uid]: newSession };
            this.setState({ sessionMap: newSessionMap, sessionIdOrder: [...sessionIdOrder, newSession.uid] });
        }
    }

    handleDeleteSession = async (sessionId) => {
        const newSessions = await SessionAPI.deleteSession(sessionId);
        this.setState({ sessionIdOrder: newSessions.map(s => s.uid) });
    }

    render() {
        const { sessionIdOrder, sessionMap, isSessionManagerActive, newSessionName } = this.state;

        return <>
            <h1>Sessions</h1>
            {isSessionManagerActive ?
                <button class='btn btn-success btn-block' onClick={this.handleStopSessions}>End Sessions</button> :
                <button class='btn btn-success btn-block' onClick={this.handleRunSessions}>Run Sessions</button>
            }
            <form class="mb-3">
                <div className="form-group">
                    <label>New Session Name</label>
                    <input type="text" className="form-control" value={newSessionName} onChange={e => this.setState({ newSessionName: e.target.value })} />
                </div>
                <button
                    type="button"
                    class="btn btn-primary btn-block"
                    onClick={this.handleAddSession}>Add Session</button>
            </form>



            <div class="list-group" id="sessionList">
                {sessionIdOrder.map((sessionId) => {
                    return <li class='list-group-item list-group-item-action d-flex flex-row justify-content-between' key={sessionId} data-dnd-id={sessionId}>
                        <div>
                            <svg viewBox="0 0 100 100" height="16" width="16">
                                <rect width="100" height="20" rx="8"></rect>
                                <rect y="30" width="100" height="20" rx="8"></rect>
                                <rect y="60" width="100" height="20" rx="8"></rect>
                            </svg>&nbsp;
                                <Link to={`/session/${sessionId}`} class='text-dark'>
                                {sessionMap[sessionId].name || 'No Name'}
                            </Link>
                        </div>
                        <div className='d-flex flex-row'>
                            <div class="custom-control custom-switch">
                                <input 
                                id={`switch-${sessionId}`} 
                                type="checkbox" 
                                class="custom-control-input" 
                                checked={sessionMap[sessionId].isEnabled}
                                onChange={(e) => {
                                    this.handleChangeSessionEnabled(sessionId, e.target.checked);
                                }}
                                />
                                <label class="custom-control-label" for={`switch-${sessionId}`} />
                            </div>
                            <a href='# ' class='text-danger' onClick={() => this.handleDeleteSession(sessionId)}>Delete</a>
                        </div>
                    </li>
                })}
            </div>
        </>
    }
}