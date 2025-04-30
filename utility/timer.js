const { getWebSettings } = require('./general')


let timerInterval;

export function setTimer(duration, countUp = false) {
    let time = countUp ? 0 : duration;
    
    timerInterval = setInterval(() => {
        console.log(time);
        
        if (countUp) {
            time++;
            if (time > duration) clearInterval(timerInterval);
        } else {
            time--;
            if (time < 0) clearInterval(timerInterval);
        }
    }, 1000);
} 

export function stopTimer() {
    clearInterval(timerInterval);
}
