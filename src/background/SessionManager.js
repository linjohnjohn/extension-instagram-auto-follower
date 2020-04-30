import { doThenWait } from "../content/utils";
import SessionAPI from "../models/SessionAPI";
import K from "../constants";

/* global chrome */

let currentSessionManager;

const sessionManagerDaemon = async (msg, sender, sendResponse) => {
    if (msg.type === 'isSessionManagerActive') {
        sendResponse({ isSessionManagerActive: !!currentSessionManager });
    } else if (msg.type === 'startSessionManager') {
        currentSessionManager = new SessionManager();
        await currentSessionManager.setup();
        currentSessionManager.performNextTask();
    } else if (msg.type === 'endSessionManager') {
        currentSessionManager.teardown();
        currentSessionManager = null;
    }
}
chrome.runtime.onMessage.addListener(sessionManagerDaemon);


const asyncDebugger = async (target, event, details) => {
    return new Promise((resolve, rej) => {
        chrome.debugger.sendCommand(target, event, details, (result) => {
            resolve(result);
        });
    });
}

const messageHandler = (msg, sender, sendResponse) => {
    if (msg.type === 'likeUserPosts2') {

    } else if (msg.type === 'getMyTabId') {
        sendResponse({ tabId: sender.tab.id });
    } else if (msg.type === 'backspaceDelete') {
        const target = { tabId: sender.tab.id }
        chrome.debugger.attach(target, '1.2', async () => {

            for (let i = 0; i < 1000; i++) {
                await asyncDebugger(target, "Input.dispatchKeyEvent", { type: 'keyDown', windowsVirtualKeyCode: 0x08 });
            }

            chrome.debugger.detach(target);
        });
    } else if (msg.type === 'typeString') {
        const target = { tabId: sender.tab.id }
        chrome.debugger.attach(target, '1.2', async () => {
            for (let i = 0; i < 100; i++) {
                await asyncDebugger(target, "Input.dispatchKeyEvent", { type: 'keyDown', windowsVirtualKeyCode: 0x08 });
            }

            for (const char of msg.string || '') {
                await asyncDebugger(target, "Input.dispatchKeyEvent", { type: 'keyDown', text: char });
            }

            chrome.debugger.detach(target);
        });
    }
}
class SessionManager {
    constructor() {
        this.sessions = [];
        this.sessionIndex = 0;
        this.taskIndex = 0;
        this.activeTabs = [];
        this.lastCycleDate = -1;
    }
    
    specificMessageHandler = async (msg, sender, sendResponse) => {
        if (msg.type === 'finishedTasked') {
            await doThenWait(() => {
            }, 5000);
            chrome.tabs.remove(sender.tab.id, () => {
                this.activeTabs = this.activeTabs.filter(id => id !== sender.tab.id);
                this.performNextTask();
            });
        } else if (msg.type === 'replaceWithAnotherTask') {
            console.log('replaceWithAnotherTask', msg.task);
            chrome.tabs.remove(sender.tab.id, () => {
                this.activeTabs = this.activeTabs.filter(id => id !== sender.tab.id);
                this.startTask(msg.task)
            });
        }
    }

    performNextTask() {
        const { sessions, sessionIndex, taskIndex } = this;
        console.log('performNextTask > sessions', sessions)
        let tasks = sessions[sessionIndex].tasks;
        let nextSessionIndex = sessionIndex;
        let nextTaskIndex = taskIndex + 1;
        
        while (nextTaskIndex >= tasks.length) {
            nextSessionIndex += 1;

            if (nextSessionIndex >= sessions.length) {
                const currentDate = new Date();
                if (currentDate.getDate() !== this.lastCycleDate) {
                    nextSessionIndex = 0; 
                } else {
                    console.log('do again for tomorrow')
                    this.sessionIndex = 0;
                    this.nextTaskIndex = -1;
                    const tomorrow = new Date();
                    tomorrow.setDate(currentDate.getDate() + 1);
                    tomorrow.setHours(0);
                    chrome.alarms.onAlarm.addListener((alarm) => {
                        if (alarm.name === 'nextDay') {
                            this.performNextTask();
                            chrome.alarms.clear('nextDay');
                        }
                    });
                    chrome.alarms.create('nextDay', { when: tomorrow.getTime() });
                    return;
                }
            }

            tasks = sessions[nextSessionIndex].tasks
            nextTaskIndex = 0;
        }

        this.sessionIndex = nextSessionIndex;
        this.taskIndex = nextTaskIndex;

        console.log('performTask:', 'sessionIndex', nextSessionIndex, 'taskIndex', nextTaskIndex);
        const nextTask = sessions[nextSessionIndex].tasks[nextTaskIndex];
        this.startTask(nextTask);
    }

    startTask(task) {
        let url = 'https://instagram.com';
        if (task.type === K.taskType.FOLLOW_LOOP) {
            const { sources } = task;
            url = sources[Math.floor(Math.random() * sources.length)];
            // @todo error handling
            console.log('startTask >', sources, url)
        }
        // @todo handle WAIT here
        chrome.windows.create({ url: url, focused: false }, window => {
            const newTabId = window.tabs[0].id;
            this.activeTabs.push(newTabId);
            setTimeout(() => {
                //@todo fix later
                chrome.tabs.sendMessage(newTabId, { type: 'doTask', task: task });
            }, 5000);
        });
    }

    async setup() {
        chrome.runtime.onMessage.addListener(messageHandler);
        chrome.runtime.onMessage.addListener(this.specificMessageHandler);
        
        const sessions = await SessionAPI.getAllSessions(true);
        this.sessions = sessions

        if (sessions.length > 0){
            this.lastCycleDate = (new Date()).getDate()
            this.sessionIndex = 0;
            this.taskIndex = -1;
        }
    }

    teardown() {
        chrome.runtime.onMessage.removeListener(messageHandler);
        chrome.runtime.onMessage.removeListener(this.specificMessageHandler);
        chrome.tabs.remove(this.activeTabs);
    }
}