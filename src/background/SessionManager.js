/* global chrome */

const messageHandler = (msg, sender, sendResponse) => {
    if (msg.type === 'likeUserPosts') {
        chrome.tabs.create({
            url: `https://www.instagram.com/${msg.username}/`,
            active: false
        }, tab => {
            chrome.tabs.executeScript(tab.id, {
                code: likeUserPostScript,
                runAt: 'document_end'
            });
        });
    } else if (msg.type === 'getMyTabId') {
        sendResponse({ tabId: sender.tab.id });
    } else if (msg.type === 'backspaceDelete') {
        const target = { tabId: sender.tab.id }
        chrome.debugger.attach(target, '1.2', function () {

            for (let i = 0; i < 1000; i++) {
                chrome.debugger.sendCommand(target, "Input.dispatchKeyEvent", { type: 'keyDown', windowsVirtualKeyCode: 0x08 });
            }

            chrome.debugger.detach(target);
        });
    } else if (msg.type === 'typeString') {
        const target = { tabId: sender.tab.id }
        chrome.debugger.attach(target, '1.2', function () {
            for (let i = 0; i < 1000; i++) {
                chrome.debugger.sendCommand(target, "Input.dispatchKeyEvent", { type: 'keyDown', windowsVirtualKeyCode: 0x08 });
            }

            for (const char of msg.string || '') {
                chrome.debugger.sendCommand(target, 'Input.dispatchKeyEvent', { type: 'keyDown', text: char });
            }

            chrome.debugger.detach(target);
        });
    }
}
class SessionManager {
    constructor() {

    }


    setup() {
        chrome.runtime.onMessage.addListener(messageHandler);
    }
}