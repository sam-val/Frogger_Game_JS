const GRID_W = 10;
const GRID_H = 10;
const FPS = 15;
const cars_clock_limit = FPS/2;
const logs_clock_limit = FPS/2;

// VARIABLES:
const grid = document.querySelector(".grid");
var frogPos = GRID_W*(GRID_H-1) - 1 + (GRID_W/2) ;
var newPos =  frogPos;
var cars = new Array(GRID_W*4);
var logs = new Array(GRID_W*3);
cars.fill(0);
logs.fill(0);
var cars_clock = 0;
var logs_clock = 0;
var on_log = false;

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
                    logs[y*GRID_W + x] = Math.random() < 0.25 ? 1 : 0;
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
                if (frogPos !== pos) {
                    addClass(pos, "log");
                    
                } 
            }
        }
    }

    // frog
    addClass(frogPos, "frog");
    // if (!grid.children[frogPos].classList.contains("log") && grid.children[frogPos].classList.contains("logBg")) {
    //     removeClass(frogPos, "frog");
        
    // }
}

// GAME LOOP 
setTimeout(gameloop, 1000/FPS);

function gameloop() {
    // check winning -- losing:

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
