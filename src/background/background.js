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

chrome.runtime.onMessage.addListener(function (msg, sender) {
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