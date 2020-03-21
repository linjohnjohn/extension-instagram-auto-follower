/* global chrome */

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

// chrome.runtime.onMessage.addListener(function (msg, sender) {
//     if (msg.type === 'autoFollow') {
//         console.log(typeof msg.delay)
//         chrome.tabs.executeScript({
//             code: `var delay = ${msg.delay}`
//         });
//         chrome.tabs.executeScript({ 
//             file: '/static/js/autoFollow.js'
//         });
//     } else if (msg.type === 'keepMeAwake') {
//         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//             const activeTab = tabs[0];
//             const activeTabId = activeTab.id; // or do whatever you need
//             chrome.tabs.update(sender.tab.id, { selected: true }, () => {
//                 chrome.tabs.update(activeTabId, { selected: true });
//             });    
//          });
//     }
// });