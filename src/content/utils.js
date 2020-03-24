/* global chrome */


const likePosts = async () => {
    try {
        await waitThenDo(() => {
            document.querySelector('.eLAPa').click()
        }, 3000);
        
        for (let i = 0; i < 5; i ++) {
            await waitThenDo(() => {
                const likeButton = document.querySelector('span.fr66n .wpO6b');
                likeButton.click();
            }, 1000)
            
            await waitThenDo(() => {
                const nextButton = document.querySelector('a._65Bje.coreSpriteRightPaginationArrow');
                nextButton.click();
            }, 2000)
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