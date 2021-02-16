const GRID_W = 10;
const GRID_H = 10;
const FPS = 12;
const cars_clock_limit = FPS/2;
const logs_clock_limit = FPS/3;
const LIVES  = 3;
const ORIGINAL_POS = GRID_W*(GRID_H-1) - 1 + (GRID_W/2) ;
const START_DELAY = FPS * 3.5;
const ALLOWED_TIME = FPS * 10;
const grid = document.querySelector(".grid");
const title = document.querySelector(".title");
const time = document.querySelector(".time");

// VARIABLES:
var frogPos = ORIGINAL_POS; 
var newPos =  frogPos;
var cars = new Array(GRID_W*4);
var logs = new Array(GRID_W*3);
cars.fill(0);
logs.fill(0);
var cars_clock = 0;
var logs_clock = 0;
var on_log = false;
var current_lives = LIVES;
var delay = START_DELAY;
// GENREATE GRID: 
for(let i =0; i < GRID_H; i++) {
    for (let j = 0; j < GRID_W; j++) {
        let square = document.createElement("div");
        square.style.width = "50px";
        square.style.height = "50px";
        if (i == 0) {
            square.classList.add("finishLine");
        } else if (i > 0 && i < 4) {
            square.classList.add("logBg");
        } else if (i > 4 && i < 9) {
            square.classList.add("road");
        } else {
            square.classList.add("pond");
        }

        grid.appendChild(square);
   }
}


// GAME FUNCTIONS:
function removeClass(pos, className) {
    if (grid.children[pos].classList.contains(className)) {
        grid.children[pos].classList.remove(className);
    }

}
function addClass(pos, className) {
    if (!grid.children[pos].classList.contains(className)) {
        grid.children[pos].classList.add(className);
    }
    
}
function undraw() {
    removeClass(frogPos, "frog");

    // cars:
    for (let x = 0; x < GRID_W; x++) {
        for (let y = 0; y < 4; y++) {
            if (cars[y*GRID_W + x]) {
                removeClass(GRID_W*5 + y*GRID_W + x, "car");
            }
        }
    }

    // logs:
    for (let x = 0; x < GRID_W; x++) {
        for (let y = 0; y < 3; y++) {
            if (logs[y*GRID_W + x]) {
                removeClass(GRID_W*1 + y*GRID_W + x, "log");
            }
        }
    }
}

function moveCars() {
    for (let x = 0; x < GRID_W; x++) {
        for (let y = 0; y < 2; y++) {
            if (x === GRID_W-1) { // if right:
            // add random except  if:
                if (cars[y*GRID_W + x - 1] && cars[y*GRID_W + x -2] && cars[y*GRID_W + x -3]) {
                    cars[y*GRID_W + x] = 0;

                } else {
                    cars[y*GRID_W + x] = Math.random() < 0.3 ? 1 : 0;
                }
            } else {
                cars[y*GRID_W + x] = cars[y*GRID_W + x + 1]
            }
        }
    }
    
    for (let y = 2; y < 4; y++) {
        for (let x = GRID_W-1; x >= 0; x--) {
            if (x === 0) { // if left:
                // add random except  if:
                if (cars[y*GRID_W + x + 1] && cars[y*GRID_W + x + 2] && cars[y*GRID_W + x + 3]) {
                    cars[y*GRID_W + x] = 0;
                } else {
                    cars[y*GRID_W + x] = Math.random() < 0.3 ? 1 : 0;
                }
            } else {
                cars[y*GRID_W + x] = cars[y*GRID_W + x - 1]
            }
        }
    }


}

function moveLogs() {
    for (let y=0; y< 3; y++) {
        for (let x= GRID_W-1; x >= 0; x--) {
            if (logs[y*GRID_W + x]) {
                if (newPos === GRID_W*1 + y*GRID_W + x) {
                    if (newPos % GRID_W < (GRID_W - 1)) {
                        newPos++;
                    }
            }
                
            }
            if (x === 0) { // if left:
                // add random except  if:
                if (logs[y*GRID_W + x + 1] && logs[y*GRID_W + x + 2] && logs[y*GRID_W + x + 3]) {
                    logs[y*GRID_W + x] = 0;
                } else {
                    logs[y*GRID_W + x] = Math.random() < 0.4 ? 1 : 0;
                }
            } else {
                logs[y*GRID_W + x] = logs[y*GRID_W + x - 1]
            }

            
        }
    }

}

function draw() {

    // cars:
    for (let x = 0; x < GRID_W; x++) {
        for (let y = 0; y < 4; y++) {
            if (cars[y*GRID_W + x]) {
                addClass(GRID_W*5 + y*GRID_W + x, "car");
            }
        }
    }

    // logs:
    for (let x = 0; x < GRID_W; x++) {
        for (let y = 0; y < 3; y++) {
            if (logs[y*GRID_W + x]) {
                let pos = GRID_W*1 + y*GRID_W + x;
                    addClass(pos, "log");
            }
        }
    }

    // frog
    addClass(frogPos, "frog");
    if (!grid.children[frogPos].classList.contains("log") && grid.children[frogPos].classList.contains("logBg")) {
        removeClass(frogPos, "frog");
    }
}

function win() {
    alert("you won!");


    location.reload();
}

function lose() {
    alert("you lost!");
    location.reload();
    delay = START_DELAY;
    current_lives = LIVES;

}

function time_out() {
    alert("time out!");
    location.reload();

}

// GAME LOOP 
setTimeout(gameloop, 1000/FPS);

function gameloop() {

    // TITLE AND COUNTDOWN:
    delay--;
    title.innerHTML = "Lives: "  + current_lives;
    if (delay > 0) {
        time.innerHTML = " You can move in: " + Math.floor(delay / FPS);
        
    } else {
        time.innerHTML = "Time left: " + Math.floor((delay + ALLOWED_TIME + FPS*1)/FPS); 
    }

    // check winning -- losing:
    let frog_class = grid.children[frogPos].classList;
    if (frog_class.contains("car") || frog_class.contains("logBg")){
        if (!frog_class.contains("log")) {
            alert("you died...");
            current_lives--;
            newPos =  ORIGINAL_POS;
            title.innerHTML = "Lives: "  + current_lives;
            if (current_lives === 0) {
                lose();
            }
        }
    } else if (frog_class.contains("finishLine")) {
        win();
    } else if (delay + ALLOWED_TIME + FPS*0.5 < 0) {
        time_out();
        return;

    }


    // undraw
    undraw();

    // update game:
    // move frog:

    cars_clock++;
    logs_clock++;
    if (cars_clock > cars_clock_limit) {
        moveCars();
        cars_clock = 0;
    }

    if (logs_clock > logs_clock_limit) {
        moveLogs();
        logs_clock = 0;
        
    }
    if (delay > 0) {
        newPos = ORIGINAL_POS;
    }

    frogPos = newPos;

    // draw:
    draw();

    setTimeout(gameloop, 1000/FPS);
}


// BIND INPUTS: 
document.addEventListener("keydown", (e) => {
    newPos = frogPos;
    if (e.key === "ArrowUp") {
        if (frogPos - GRID_W >= 0) {
            newPos-= GRID_W;
        }
    } else if (e.key === "ArrowDown") {
        if (frogPos + GRID_W < (GRID_W*GRID_H)) {
            newPos+= GRID_W;
        }
        
    } else if (e.key === "ArrowLeft") {
        if (frogPos % GRID_W > 0) {
            newPos--; 
        }
        
    } else if (e.key === "ArrowRight") {
        if (frogPos % GRID_W < (GRID_W - 1))  {
            newPos++; 
        }
        
    }

})
