/* global delay */

const loop = () => {
    let followCount = 0
    const doFollow = () => {
        let buttons = null;
        buttons = Array.from(document.querySelectorAll('.sqdOP.L3NKy.y3zKF:not(._8A5w5)'));
        if (buttons.length !== 0) {
            const targetButton = buttons[0];
            targetButton.scrollIntoView();
            targetButton.click();
            console.log(Date.now(), ++followCount);
            // updateFollowCount && updateFollowCount(followCount);
            document.querySelector('#extension-count').textContent = followCount;
            setTimeout(doFollow, delay);        
        } else {
            const whiteButtons = Array.from(document.querySelectorAll('.sqdOP.L3NKy._8A5w5'));

            if (whiteButtons.length !== 0) {
                whiteButtons[whiteButtons.length - 1].scrollIntoView();
                // timeout of 1000 since we did not actually click follow here
                setTimeout(doFollow, 1000);
            }
        }    
    }

    doFollow();
};

loop();