/* global chrome */
import K from "../constants";
import './SessionManager';
console.log('background attached')
// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function (tab) {
    // Send a message to the active tab
    chrome.tabs.query({ active: true, currentWindow: true },
        function (tabs) {
            console.log('ping')
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id,
                { "message": "clicked_browser_action" }
            );
        }
    )
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.type === 'likeUserPosts') {
        chrome.tabs.create({ url: `https://www.instagram.com/${msg.username}/`, active: false }, tab => {
        const task = {
            type: K.taskType.LIKE_USER_POSTS,
            likeCount: 5
        }
        setTimeout(() => {
                //@todo fix later
                chrome.tabs.sendMessage(tab.id, { type: 'doTask', task: task });
            }, 5000);
        });
    } else if (msg.type === 'close') {
        chrome.tabs.remove(sender.tab.id);
    }
});
