// Constants
const POMO_STATE_POMODORO = "Pomodoro";
const POMO_STATE_SHORT = "Short";
const POMO_STATE_LONG = "Long";

// const POMO_STATE_POMODORO_TIME = 25 * 60;
const POMO_STATE_POMODORO_TIME = 3;
// const POMO_STATE_SHORT_TIME = 5 * 60;
const POMO_STATE_SHORT_TIME = 2;
// const POMO_STATE_LONG_TIME = 15 * 60;
const POMO_STATE_LONG_TIME = 4;

const POMO_ROUNDS = 4;

currentPeriod = document.getElementById("currentPeriod");
timeRemaining = document.getElementById("timeRemaining");
primaryButton = document.getElementById("primaryButton");
secondaryButton = document.getElementById("secondaryButton");

// States
let currentPomoState = POMO_STATE_POMODORO;
let currentTime = POMO_STATE_POMODORO_TIME;
let pomoRoundsRan = POMO_ROUNDS;
let running = false; 

let timerId = undefined;

// Start point
setDefaults();

// On primary button
primaryButton.onclick = function (){
    console.log(`Primary Button, running: ${running}`);
    running = !running;
    console.log(pomoRoundsRan);

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

function setDefaults(){
    primaryButton.innerText = "Start";

    if (timerId !== undefined) clearTimeout(timerId);

    secondaryButton.innerText = "Pause";
    secondaryButton.disabled = true;

    currentPomoState = POMO_STATE_POMODORO;
    currentTime = POMO_STATE_POMODORO_TIME;
    pomoRoundsRan = POMO_ROUNDS;
    intToMINSEC();
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
    running = false;

    switch (currentPomoState){
        case POMO_STATE_POMODORO:
            setBreak(pomoRoundsRan > 1);
            break;
        case POMO_STATE_SHORT: case POMO_STATE_LONG:
            // Decrement rounds left only on short breaks
            if (currentPomoState === POMO_STATE_SHORT) pomoRoundsRan--;
            // Reset rounds left only long breaks
            else pomoRoundsRan = POMO_ROUNDS;

            currentPeriod.innerText = "Pomodoro";
            currentPomoState = POMO_STATE_POMODORO;
            currentTime = POMO_STATE_POMODORO_TIME;
            intToMINSEC();
            primaryButton.innerText = "Continue";
            break; 
    }
}

function setBreak(short){
    currentPeriod.innerText = short? "Short Break": "Long Break";
    currentPomoState = short? POMO_STATE_SHORT: POMO_STATE_LONG;
    currentTime = short? POMO_STATE_SHORT_TIME: POMO_STATE_LONG_TIME;
    intToMINSEC();
    primaryButton.innerText = "Break";
}

// UTIL
// Makes the style of minutes:seconds from seconds integer
function intToMINSEC (){
    let minuteString = `${Math.floor(currentTime / 60).toPrecision(2)}`;
    if (minuteString.includes("."))
        minuteString = `0${Math.floor(currentTime / 60)}`;

    let secondString = `${(currentTime % 60).toPrecision(2)}`;
    if (secondString.includes("."))
        secondString = `0${currentTime % 60}`;


    // timeRemaining.innerText = `${Math.floor(currentTime / 60).toPrecision(2)}:${(currentTime % 60).toPrecision(2)}`;
    timeRemaining.innerText = `${minuteString}:${secondString}`;

    // // To avoid e.g. 25:0.0 and make it 25:00
    // if (timeRemaining.innerText.includes("."))
    //     timeRemaining.innerText = `${Math.floor(currentTime / 60).toPrecision(2)}:00`;
}