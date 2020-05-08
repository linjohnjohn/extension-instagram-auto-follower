/* eslint-disable no-loop-func */
/* global chrome */

import React from 'react';
import ReactDOM from 'react-dom';
import './content.css';
import { repeatIfError, doThenWait } from './utils';
import * as selectors from './selectors';

import 'bootstrap/dist/css/bootstrap.min.css';
import TaskAPI from '../models/TaskAPI';

const ACTIVITY_TYPE = {
    NONE: 'NONE',
    FOLLOW: 'FOLLOW',
    UNFOLLOW: 'UNFOLLOW'
}

const ACTION_VERBS = {
    [ACTIVITY_TYPE.NONE]: '',
    [ACTIVITY_TYPE.FOLLOW]: 'followed',
    [ACTIVITY_TYPE.UNFOLLOW]: 'unfollowed'
}

class App extends React.Component {
    state = {
        activityCount: 0,
        activityType: ACTIVITY_TYPE.NONE,
        delay: 180,
    }

    componentDidMount() {
        chrome.runtime.onMessage.addListener((msg, sender) => {
            if (msg.type === 'doTask') {
                TaskAPI.fromObject(msg.task).run();
            }
        });
    }

    incrementActivityCount(val = 1) {
        this.setState({ activityCount: this.state.activityCount + val })
    }

    followLoop = (delay) => {
        let oldDate = 0;
        const doFollow = async () => {
            let buttons = null;
            const batch = 5
            while (true) {
                await doThenWait(async () => {
                    for (let i = 0; i < batch; i) {
                        buttons = Array.from(document.querySelectorAll('.sqdOP.L3NKy.y3zKF:not(._8A5w5)'));
                        if (buttons.length !== 0) {
                            await doThenWait(() => {
                                const newDate = Date.now()
                                console.log(newDate - oldDate, this.state.activityCount + 1);
                                const targetButton = buttons[0];
                                targetButton.scrollIntoView();
                                targetButton.click();
                                this.incrementActivityCount();
                                oldDate = newDate

                                const username = targetButton.parentElement.parentElement.querySelector('._7UhW9 a').textContent
                                chrome.runtime.sendMessage({ type: 'likeUserPosts', username: username });
                            }, 5000);
                            i++;
                        } else {
                            await doThenWait(() => {
                                const whiteButtons = Array.from(document.querySelectorAll('.sqdOP.L3NKy._8A5w5'));
                                if (whiteButtons.length !== 0) {
                                    whiteButtons[whiteButtons.length - 1].scrollIntoView();
                                }
                            }, 1000);
                        }
                    }
                }, delay * batch);
            }
        }

        doFollow();
    };

    unFollowLoop = (delay) => {
        const unfollow = async () => {
            let buttons = null;
            const batch = 5

            while (true) {
                await doThenWait(async () => {
                    for (let i = 0; i < batch; i) {
                        buttons = Array.from(document.querySelectorAll('.sqdOP.L3NKy._8A5w5:not(._4pI4F)'));
                        if (buttons.length !== 0) {
                            const targetButton = buttons[0];

                            await doThenWait(() => {
                                targetButton.scrollIntoView();
                                targetButton.click();
                            }, 0);

                            await doThenWait(async () => {
                                await repeatIfError(() => {
                                    const confirmButton = document.querySelector('.aOOlW.-Cab_');
                                    confirmButton.click();
                                    this.incrementActivityCount();
                                })
                            }, 5000);
                            i++;
                        }
                    }
                }, delay * batch);
            }
        }
        unfollow();
    }

    handleFollow = () => {
        if (this.state.activityType !== ACTIVITY_TYPE.NONE) {
            return;
        } else {
            this.followLoop(this.state.delay * 1000);
            this.setState({ activityType: ACTIVITY_TYPE.FOLLOW });
        }
    }

    handleUnfollow = () => {
        if (this.state.activityType !== ACTIVITY_TYPE.NONE) {
            return;
        } else {
            this.unFollowLoop(this.state.delay * 1000);
            this.setState({ activityType: ACTIVITY_TYPE.UNFOLLOW });
        }
    }

    handleStop = () => {
        window.location.reload();
    }

    render() {
        const { delay, activityType, activityCount } = this.state;
        return (
            <div style={{ padding: '20px', color: '#000' }}>
                <p className='mb-3'>Note: To use our COMPLETELY automated follow for follow strategy check out the options page of this extension.</p>
                <p className='mb-3'>The features on this panel can automate following and unfollowing but does so indefinitely. Learn more&nbsp;
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={chrome.runtime.getURL('/help/help.html')}>
                        here
                    </a>
                </p>
                <div className="form-group">
                    <label>Delay in Seconds</label>
                    <input
                        className="form-control"
                        type="number"
                        value={delay}
                        onChange={e => this.setState({ delay: parseInt(e.target.value, 10) })}
                    />
                </div>
                {activityType === ACTIVITY_TYPE.NONE ?
                    (<React.Fragment>
                        <button className="btn btn-success mb-3" onClick={this.handleFollow}>Start Following</button>
                        <button className="btn btn-success mb-3" onClick={this.handleUnfollow}>Start Unfollow</button>
                    </React.Fragment>) :
                    <React.Fragment>
                        <button className="btn btn-danger mb-3" onClick={this.handleStop}>Stop</button>
                        <label>You have {ACTION_VERBS[activityType]} <label id="extension-count">{activityCount}</label> people in this session.</label>
                    </React.Fragment>
                }
                <p>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={chrome.runtime.getURL('/help/help.html')}
                    >
                        Need help? Here are instructions
                    </a>
                </p>
            </div>
        );
    }
}

const app = document.createElement('div');
app.id = "my-extension-root";
document.body.appendChild(app);
ReactDOM.render(<App />, app);

app.style.display = "none";
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            console.log('ba')
            toggle();
        }
    }
);

function toggle() {
    if (app.style.display === "none") {
        app.style.display = "block";
    } else {
        app.style.display = "none";
    }
}