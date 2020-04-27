import Session from "../models/Session";
import { doThenWait } from "../content/utils";

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
    }
    
    specificMessageHandler = async (msg, sender, sendResponse) => {
        if (msg.type === 'finishedTasked') {
            await doThenWait(() => {
            }, 5000);
            chrome.tabs.remove(sender.tab.id, () => {
                this.activeTabs = this.activeTabs.filter(id => id !== sender.tab.id);
                this.performNextTask();
            });
        }
    }

    performNextTask() {
        const { sessions, sessionIndex, taskIndex } = this;
        console.log('perf', sessions)
        let tasks = sessions[sessionIndex].tasks;
        let nextSessionIndex = sessionIndex;
        let nextTaskIndex = taskIndex + 1;
        
        while (nextTaskIndex >= tasks.length) {
            nextSessionIndex += 1;

            if (nextSessionIndex >= sessions.length) {
                nextSessionIndex = 0;
            }

            tasks = sessions[nextSessionIndex].tasks
            nextTaskIndex = 0;
        }

        this.sessionIndex = nextSessionIndex;
        this.taskIndex = nextTaskIndex;

        const nextTask = sessions[nextSessionIndex].tasks[nextTaskIndex];
        chrome.windows.create({ url: 'https://instagram.com', focused: false }, window => {
            const newTabId = window.tabs[0].id;
            this.activeTabs.push(newTabId);
            setTimeout(() => {
                //@todo fix later
                chrome.tabs.sendMessage(newTabId, { type: 'doTask', task: nextTask });
            }, 5000);
        });
    }

    async setup() {
        chrome.runtime.onMessage.addListener(messageHandler);
        chrome.runtime.onMessage.addListener(this.specificMessageHandler);
        
        const sessions = await Session.getAllSessions();
        this.sessions = sessions
        console.log('setup', sessions)

        if (sessions.length > 0){
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