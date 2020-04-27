/* eslint-disable no-loop-func */
/* global chrome */
import { doThenWait, fuzzNumber, repeatIfErrorLimited } from '../../content/utils';
import * as selectors from '../../content/selectors';
import K from '../../constants';

export class Task {
    static fromObject(obj) {
        let task;
        switch (obj.type) {
            case K.taskType.FOLLOW_LOOP: 
                task = new FollowLoop();
                return Object.assign(task, obj);;
            case K.taskType.UNFOLLOW_LOOP:
                task = new UnfollowLoop();
                return Object.assign(task, obj);;
            case K.taskType.LIKE_USER_POSTS:
                task = new LikeUserPosts();
                return Object.assign(task, obj);;
            case K.taskType.LOGIN:
                task = new Login();
                return Object.assign(task, obj);;
            case K.taskType.LOGOUT:
                task = new Logout();
                return Object.assign(task, obj);;
            default:
                throw new Error(`${obj.type} is not a defined Task`)
        }
    }

    constructor(uid, type) {
        this.uid = uid;
        this.type = type;
    }

    
    run() {
        this.done();
    }

    done() {
        console.log('finishedTask')
        chrome.runtime.sendMessage({ type: 'finishedTasked' });
    }
}

export class FollowLoop extends Task {
    constructor(uid, type, averageDelay = 180000, limit = 100) {
        super(uid, type);
        this.averageDelay = averageDelay;
        this.limit = limit;
        this.sources = [];
    }

    setup = async () => {
        // @todo
    }

    run = async () => {
        //@todo
        await doThenWait(() => {
            selectors.selectLikersOpener().click();
        }, 5000);

        const { averageDelay: delay, limit } = this;
        let oldDate = 0;
        let buttons = null;
        for (let h = 0; h < limit; h) {
            let batch = fuzzNumber(5, 40);
            await doThenWait(async () => {
                for (let i = 0; i < batch; i++) {
                    buttons = selectors.selectAllFollowButtons();
                    if (buttons.length !== 0) {
                        await doThenWait(() => {
                            const newDate = Date.now()
                            const targetButton = buttons[0];
                            targetButton.scrollIntoView();
                            targetButton.click();
                            this.incrementActivityCount();
                            oldDate = newDate;

                            const username = targetButton.parentElement.parentElement.querySelector('._7UhW9 a').textContent
                            chrome.runtime.sendMessage({ type: 'likeUserPosts', username: username });
                        }, 5000);
                    } else {
                        await doThenWait(() => {
                            const whiteButtons = Array.from(document.querySelectorAll('.sqdOP.L3NKy._8A5w5'));
                            if (whiteButtons.length !== 0) {
                                whiteButtons[whiteButtons.length - 1].scrollIntoView();
                            }
                        }, 2000);
                    }
                }
            }, fuzzNumber(delay * batch, 20));
            h += batch;
        }

        this.done();
    };

    done() {
        chrome.runtime.sendMessage({ type: 'finishedTasked' });
    }
}

export class UnfollowLoop extends Task {
    constructor(uid, type, averageDelay = 180000, limit = 100) {
        super(uid, type);
        this.averageDelay = averageDelay;
        this.limit = limit;
    }

    run = async () => {
        await doThenWait(() => {
            selectors.selectProfileIcon().click();
        }, 5000);

        await doThenWait(() => {
            selectors.selectFollowingOpener().click();
        }, 5000);

        const { averageDelay: delay, limit } = this;
        let buttons = null;
        for (let h = 0; h < limit; h) {
            let batch = fuzzNumber(5, 40);
            await doThenWait(async () => {
                for (let i = 0; i < batch; i) {
                    buttons = selectors.selectAllUnfollowButtons();
                    if (buttons.length !== 0) {
                        const targetButton = buttons[0];

                        await doThenWait(() => {
                            targetButton.scrollIntoView();
                            targetButton.click();
                        }, 0);

                        await doThenWait(async () => {
                            await repeatIfErrorLimited(() => {
                                const confirmButton = document.querySelector('.aOOlW.-Cab_');
                                confirmButton.click();
                            });
                        }, 5000);
                        i++;
                        console.log(i, batch, delay)
                    }
                }
            }, fuzzNumber(delay * batch, 20));
            h += batch
        }

        this.done();
    }
}

export class Login extends Task {
    constructor(uid, type, username = '', password = '') {
        super(uid, type);
        this.username = username;
        this.password = password;
    }

    run = async () => {
        await doThenWait(() => {
            const switchAccountButton = selectors.selectSwitchAccountButton();
            if (switchAccountButton) {
                switchAccountButton.click();
            }
        }, 2000);

        await doThenWait(() => {
            selectors.selectUsernameInput().focus();
            chrome.runtime.sendMessage({ type: "typeString", string: this.username });
        }, 2000);

        await doThenWait(() => {
            selectors.selectPasswordInput().focus();
            chrome.runtime.sendMessage({ type: "typeString", string: this.password });
        }, 2000);

        selectors.selectLoginButton().click();
        this.done();

    }
}

export class Logout extends Task {
    run = async () => {
        await doThenWait(() => {
            selectors.selectProfileIcon().click();
        }, 5000);

        await doThenWait(() => {
            selectors.selectProfileGear().click();
        }, 2000);

        await doThenWait(() => {
            selectors.selectLogoutButton().click();
            this.done();
        }, 2000);
    }
}

export class LikeUserPosts extends Task {
    constructor(uid, type, likeCount = 5) {
        if (type !== K.taskType.LIKE_USER_POSTS) {
            throw Error('Wrong Task Type');
        }
        super(uid, type);
        this.likeCount = likeCount;
    }
 
    run = async () => {
        const { likeCount } = this;
        try {
            await doThenWait(() => {
                selectors.selectLatestPostSquare();
            }, 3000);

            for (let i = 0; i < likeCount; i++) {
                await doThenWait(() => {
                    selectors.selectLikeButton().click();
                }, 1000)

                await doThenWait(() => {
                    selectors.selectNextPostArrow().click()
                }, 2000)
            }
        } catch (err) {
            console.log(err);
        }

        this.done();
    }

    done = () => {
        chrome.runtime.sendMessage({ type: 'close' })
    }
}