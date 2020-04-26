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

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
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
        chrome.debugger.attach(target, '1.2', function() {
            
            for (let i = 0; i < 1000; i++) {
                chrome.debugger.sendCommand(target, "Input.dispatchKeyEvent", { type: 'keyDown', windowsVirtualKeyCode:0x08 });
            }

            chrome.debugger.detach(target);
        });
    } else if (msg.type === 'typeString') {
        const target = { tabId: sender.tab.id }
        chrome.debugger.attach(target, '1.2', function() {
            for (let i = 0; i < 1000; i++) {
                chrome.debugger.sendCommand(target, "Input.dispatchKeyEvent", { type: 'keyDown', windowsVirtualKeyCode:0x08 });
            }
            
            for (const char of msg.string || '') {
                chrome.debugger.sendCommand(target, 'Input.dispatchKeyEvent', { type: 'keyDown', text: char });
            }

            chrome.debugger.detach(target);
        });
    } else if (msg.type === 'close') {
        chrome.tabs.remove(sender.tab.id);
    }
});


const likeUserPostScript = `

const likePosts = async () => {
    try {
        await waitThenDo(() => {
            document.querySelector('.eLAPa').click()
        }, 3000);
        
        for (let i = 0; i < 5; i ++) {
            await waitThenDo(() => {
                const likeButton = document.querySelector('span.fr66n .wpO6b');
                likeButton.click();
            }, 2000)
            
            await waitThenDo(() => {
                const nextButton = document.querySelector('a._65Bje.coreSpriteRightPaginationArrow');
                nextButton.click();
            }, 1000)
        }
        chrome.runtime.sendMessage({ type: 'close' })
    } catch (err) {
        chrome.runtime.sendMessage({ type: 'close' })
    }
}

const waitThenDo = (fn, delay) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            try {
                resolve(fn())
            } catch (err) {
                chrome.runtime.sendMessage({ type: 'close' })
            }
        }, delay)
    })
}

likePosts();


`