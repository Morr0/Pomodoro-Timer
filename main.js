// Constants
const POMO_STATE_POMODORO = "Pomodoro";
const POMO_STATE_SHORT = "Short";
const POMO_STATE_LONG = "Long";

const POMO_STATE_POMODORO_TIME = 25 * 60;
const POMO_STATE_SHORT_TIME = 5 * 60;
const POMO_STATE_LONG_TIME = 15 * 60;

const POMO_ROUNDS = 4;

currentPeriod = document.getElementById("currentPeriod");
timeRemaining = document.getElementById("timeRemaining");
primaryButton = document.getElementById("primaryButton");
secondaryButton = document.getElementById("secondaryButton");

// 

// States
let currentPomoState = POMO_STATE_POMODORO;
let currentTime = POMO_STATE_POMODORO_TIME;
let pomoRoundsRan = POMO_ROUNDS;
let running = false; 

let timerId = undefined;

// On primary button
primaryButton.onclick = function (){
    console.log(`Primary Button, running: ${running}`);
    running = !running;

    if (running){
        primaryButton.innerText = "Reset";
        secondaryButton.innerText = "Pause";
        secondaryButton.disabled = false;
        
        stepTime();
    } else {
        primaryButton.innerText = "Start";

        clearTimeout(timerId);

        // Reset to default
        secondaryButton.innerText = "Pause";
        secondaryButton.disabled = true;
        currentPomoState = POMO_STATE_POMODORO;
        currentTime = POMO_STATE_POMODORO_TIME;
        pomoRoundsRan = POMO_ROUNDS;
        intToMINSEC();
    }
}

secondaryButton.onclick = function (){
    console.log("Secondary Button");
    running = !running;
    if (running){
        secondaryButton.innerText = "Pause";
        stepTime();
    } else {
        secondaryButton.innerText = "Resume";
        clearTimeout(timerId);
    }
}

// Work methods
// Start running
// This method will keep calling itself until it is done
function stepTime(){
    intToMINSEC();

    if (currentTime > 0){
        currentTime--;
        timerId = setTimeout(stepTime, 1000);
    } else {
        notifyFinishedPeriod();
    }
}

// Called when the timer is done
function notifyFinishedPeriod(){
    pomoRoundsRan--;
    running = false;

    switch (currentPomoState){
        default: case POMO_STATE_POMODORO:
            if (pomoRoundsRan > 0){
                currentPeriod.innerText = "Short Break";
                currentPomoState = POMO_STATE_SHORT;
                currentTime = POMO_STATE_SHORT_TIME;
            } else {
                currentPeriod.innerText = "Long Break";
                currentPomoState = POMO_STATE_LONG;
                currentTime = POMO_STATE_LONG_TIME;
            }
            break;
        case POMO_STATE_SHORT: case POMO_STATE_LONG:
            currentPeriod.innerText = "Pomodoro";
            currentPomoState = POMO_STATE_POMODORO;
            currentTime = POMO_STATE_POMODORO_TIME;
            break; 
        // case POMO_STATE_LONG:
        //     currentPeriod.innerText = "Pomodoro";
        //     currentPomoState = POMO_STATE_POMODORO;
        //     currentTime = POMO_STATE_POMODORO_TIME;
        //     break;
    }
}

// UTIL
// Makes the style of minutes:seconds from seconds integer
function intToMINSEC (){
    timeRemaining.innerText = `${Math.floor(currentTime / 60).toPrecision(2)}:${(currentTime % 60).toPrecision(2)}`;

    // // To avoid e.g. 25:0.0 and make it 25:00
    // if ("." in timeRemaining.innerText)
    //     timeRemaining.innerText = `${Math.floor(currentTime / 60).toPrecision(2)}:00`;
}