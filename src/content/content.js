/* global chrome */ 

import React from 'react';
import ReactDOM from 'react-dom';
import './content.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// const silenceURL = chrome.runtime.getURL('/silent.mp3');
// const sirenURL = chrome.runtime.getURL('/siren.mp3');

class App extends React.Component {
    state = {
        followCount: 0,
        active: false, 
        delay: 5,
    }

    // silentAudio = new Audio(sirenURL);

    incrementFollowCount(val = 1) {
        this.setState({ followCount: this.state.followCount + val})
    }

    loop = (delay) => {
        let oldDate = 0;
        const doFollow = () => {
            let buttons = null;
    
            buttons = Array.from(document.querySelectorAll('.sqdOP.L3NKy.y3zKF:not(._8A5w5)'));
            if (buttons.length !== 0) {
                const targetButton = buttons[0];
                targetButton.scrollIntoView();
                targetButton.click();
                this.incrementFollowCount();
                const newDate = Date.now()
                console.log(newDate - oldDate, this.state.followCount + 1);
                oldDate = newDate
                // chrome.runtime.sendMessage({ type: 'keepMeAwake' });
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

    // componentDidMount() {
    //     this.silentAudio.onended = () => {
    //         this.silentAudio.currentTime = 0;
    //         this.silentAudio.play();
    //     };
    // }
    
    handleFollow = () => {
        if (this.state.active) {
            return;
        } else {
            // this.silentAudio.play();
            this.loop(this.state.delay * 1000);
            // chrome.runtime.sendMessage({ type: 'autoFollow', delay: this.state.delay * 1000 });
            this.setState({ active: true });
        }
        // this.loop(this.state.delay * 1000);
    }

    handleStop = () => {
        window.location.reload();
    }

    render() {
        const { delay, active, followCount } = this.state;
        return (
            <div style={{ padding: '20px', color: '#000' }}>
                {/* <audio src={silence} type='audio/mp3'></audio> */}
                <div className="form-group">
                    <label>Delay in Seconds</label>
                    <input 
                        className="form-control"
                        type="number" 
                        value={delay} 
                        onChange={e => this.setState({ delay: parseInt(e.target.value, 10) })}
                    />
                </div>
                { active ? 
                    <button className="btn btn-danger" onClick={this.handleStop}>Stop</button> : 
                    <button className="btn btn-success" onClick={this.handleFollow}>Start Following</button>
                }
                <label className="mt-3">You have followed <label id="extension-count">{followCount}</label> people in this session.</label>
            </div>
        );
    }
}

const app = document.createElement('div');
app.id = "my-extension-root";
document.body.appendChild(app);
ReactDOM.render(<App />, app);

app.style.display = "none";
chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action") {
        toggle();
      }
   }
);

function toggle(){
   if(app.style.display === "none"){
     app.style.display = "block";
   }else{
     app.style.display = "none";
   }
}