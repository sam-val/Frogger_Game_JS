const GRID_W = 10;
const GRID_H = 10;
const FPS = 5;
const cars_clock_limit = Math.floor(FPS/1);

// VARIABLES:
const grid = document.querySelector(".grid");
var frogPos = GRID_W*(GRID_H-1) - 1 + (GRID_W/2 - 1);
var newPos =  frogPos;
var cars = new Array(GRID_W*4);
cars.fill(0);
var cars_clock = 0;

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

}

function draw() {
    addClass(frogPos, "frog");

    for (let x = 0; x < GRID_W; x++) {
        for (let y = 0; y < 4; y++) {
            if (cars[y*GRID_W + x]) {
                addClass(GRID_W*5 + y*GRID_W + x, "car");
            }
        }
    }
}

// GAME LOOP 
setTimeout(gameloop, 1000/FPS);

function gameloop() {
    // check winning -- losing:

    // undraw
    undraw();

    // update game:
    frogPos = newPos;
    cars_clock++;
    if (cars_clock > cars_clock_limit) {
        moveCars();
        cars_clock = 0;
    }

    // draw:
    draw();

    setTimeout(gameloop, 1000/FPS);
}


// BIND INPUTS: 
document.addEventListener("keydown", (e) => {
    newPos = frogPos;
    console.log("first")
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
