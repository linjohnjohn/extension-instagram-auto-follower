/* eslint-disable no-loop-func */
/* global chrome */
import * as chromeStorage from './chromeStorage';
import { doThenWait, fuzzNumber, repeatIfErrorLimited } from '../content/utils';
import * as selectors from '../content/selectors';
import K from '../constants';
import TaskAPI from './TaskAPI';

export class Task {
    constructor(type) {
        this.uid = chromeStorage.uuidv4();
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
    constructor(averageDelay = 180000, limit = 100) {
        super(K.taskType.FOLLOW_LOOP);
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
        for (let h = 0; h < fuzzNumber(limit, 20); h) {
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
                            oldDate = newDate;
                            console.log('batch', h, 'inner', i)
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
    constructor(averageDelay = 180000, limit = 100) {
        super(K.taskType.UNFOLLOW_LOOP);
        this.averageDelay = averageDelay;
        this.limit = limit;
    }

    run = async () => {
        if (selectors.selectProfileIconAsSpan()) {
            await doThenWait(() => {
                selectors.selectProfileIconAsSpan().click();
            }, 1000);
            await doThenWait(() => {
                selectors.selectProfileOnDropdown().click();
            }, 5000);
        } else {
            await doThenWait(() => {
                selectors.selectProfileIcon().click();
            }, 5000);
        }
            
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

export class FollowUnfollowAlternator extends Task {
    constructor(averageDelay = 180000, limit = 200, lowerSwitch = 500, upperSwitch = 4500) {
        super(K.taskType.FOLLOW_UNFOLLOW_ALTERNATOR);
        this.averageDelay = averageDelay;
        this.limit = limit;
        this.sources = [];
        this.lowerSwitch = lowerSwitch;
        this.upperSwitch = upperSwitch;
        this.mode = K.taskType.FOLLOW_LOOP;
    }

    run = async () => {
        if (selectors.selectProfileIconAsSpan()) {
            await doThenWait(() => {
                selectors.selectProfileIconAsSpan().click();
            }, 1000);
            await doThenWait(() => {
                selectors.selectProfileOnDropdown().click();
            }, 5000);
        } else {
            await doThenWait(() => {
                selectors.selectProfileIcon().click();
            }, 5000);
        }

        const followingCount = await doThenWait(() => {
            let countText = selectors.selectFollowingCount().textContent;
            if (countText.includes('k')) {
                countText = countText.replace('k', '');
                return parseInt(countText, 10) * 1000;
            } else if (countText.includes('m')) {
                countText = countText.replace('m', '');
                return parseInt(countText, 10) * 1000000;
            } else {
                countText = countText.replace(',', '');
                return parseInt(countText, 10);
            }
        }, 1000);

        if (this.mode === K.taskType.FOLLOW_LOOP && followingCount >= this.upperSwitch) {
            this.mode = K.taskType.UNFOLLOW_LOOP;
            await TaskAPI.updateTask(this.uid, this);
        } else if (this.mode === K.taskType.UNFOLLOW_LOOP && followingCount < this.lowerSwitch) {
            this.mode = K.taskType.FOLLOW_LOOP;
            await TaskAPI.updateTask(this.uid, this);
        }

        let task = {
            type: this.mode,
            averageDelay: this.averageDelay,
            limit: this.limit,
            sources: this.sources
        };

        chrome.runtime.sendMessage({ type: 'replaceWithAnotherTask', task });
    }
}

export class Login extends Task {
    constructor(username = '', password = '') {
        super(K.taskType.LOGIN);
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
    constructor() {
        super(K.taskType.LOGOUT);
    }

    run = async () => {
        // @todo hack for new interface
        if (selectors.selectProfileIconAsSpan()) {
            await doThenWait(() => {
                selectors.selectProfileIconAsSpan().click();
            }, 5000);

            await doThenWait(() => {
                selectors.selectLogoutOnDropdown().click();
            }, 2000);

            await doThenWait(() => {
                selectors.selectLogoutConfirm().click();
                this.done();
            }, 2000, () => this.done());
        } else {
            await doThenWait(() => {
                selectors.selectProfileIcon().click();
            }, 5000);

            await doThenWait(() => {
                selectors.selectProfileGear().click();
            }, 2000);

            await doThenWait(() => {
                selectors.selectLogoutButton().click();
                this.done();
            }, 2000, () => this.done());
        }
    }
}

export class LikeUserPosts extends Task {
    constructor(likeCount = 5) {
        super(K.taskType.LIKE_USER_POSTS);
        this.likeCount = likeCount;
    }

    run = async () => {
        const { likeCount } = this;
        try {
            await doThenWait(() => {
                selectors.selectLatestPostSquare().click();
            }, 3000, () => window.close());

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