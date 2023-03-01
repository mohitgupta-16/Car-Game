const carGame = document.querySelector(".carGame");
const score = document.querySelector(".score");
let startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");

// console.log(startScreen);

startScreen.addEventListener("click", start);

let player = {
    start: false,
    speed: 5,
    score: 0,
};

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
    W: false,
    A: false,
    S: false,
    D: false,
};

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(e) {
    e.preventDefault();
    keys[e.key] = true;
    // console.log(e.key);
    // console.log(keys);
}
function keyUp(e) {
    e.preventDefault();
    keys[e.key] = false;
    // console.log(e.key);
    // console.log(keys);
}

// function for collision detection
function isCollision(a, b) {
    let car = a.getBoundingClientRect();
    let enemyCar = b.getBoundingClientRect();

    return !(
        car.top > enemyCar.bottom ||
        car.bottom < enemyCar.top ||
        car.right < enemyCar.left ||
        car.left > enemyCar.right
    );
}

// function to end game
function endGame() {
    player.start = false;
    startScreen.classList.remove("hide");
    startScreen.innerHTML =
        "Game Over <br> Your final score is <b>" +
        player.score +
        "</b> <br> Press here to Start Again";
}

// animation function for moving lines
function moveLines() {
    let lines = document.querySelectorAll(".lines");

    lines.forEach((item) => {
        if (item.y >= 700) {
            item.y -= 750;
        }

        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

// animation function for moving cars
function moveCars(car) {
    let enemy = document.querySelectorAll(".enemy");

    enemy.forEach((item) => {
        // using closure we are accessing car
        if (isCollision(car, item)) {
            console.log("collision");
            endGame();
        }

        if (item.y >= 750) {
            item.y = -350;
            item.style.left = Math.floor(Math.random() * 350) + "px";
        }

        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function gamePlay() {
    // console.log('Hey I am clicked');

    let car = document.querySelector(".car");

    // Return the size of an element and its position relative to the viewport
    let road = gameArea.getBoundingClientRect();
    // console.log(road);

    // for movement of car
    if (player.start) {
        moveLines();
        moveCars(car);

        // to move up we have to decrease offsetTop
        if ((keys.ArrowUp || keys.w || keys.W) && player.y > road.top + 85) {
            player.y -= player.speed;
        }
        // to move down we have to increase offsetTop
        if (
            (keys.ArrowDown || keys.s || keys.S) &&
            player.y < road.bottom - 100
        ) {
            player.y += player.speed;
        }
        // to move left we have to decrease offsetleft
        if ((keys.ArrowLeft || keys.a || keys.A) && player.x > 0) {
            player.x -= player.speed;
        }
        // to move right we have to increase offsetLeft
        if (
            (keys.ArrowRight || keys.d || keys.D) &&
            player.x < road.width - 50
        ) {
            player.x += player.speed;
        }

        // changing top and left postion of car accordng to keys pressed
        car.style.top = player.y + "px";
        car.style.left = player.x + "px";

        window.requestAnimationFrame(gamePlay);
        // console.log(player.score++);

        player.score++;
        let playerScore = player.score - 1;
        if (playerScore > 1500) {
            player.speed = 6;
        }
        if (playerScore > 2500) {
            player.speed = 7;
        }
        if (playerScore > 3000) {
            player.speed = 8;
        }
        score.innerText = "Score " + playerScore;
    }
}

function start() {
    player.start = true;
    player.score = 0;
    player.speed = 5;

    // hiding pop up box and unhide game area
    // gameArea.classList.remove("hide");
    startScreen.classList.add("hide");
    // deleting gameArea beacuase we are implementing gameArea using js functions only
    gameArea.innerHTML = "";

    // It requests the browser to execute the code during the next repaint cycle.
    // This allows the system to optimize resources and frame-rate to reduce unnecessary reflow/repaint calls.
    window.requestAnimationFrame(gamePlay);

    // for road white strips
    for (let x = 0; x < 5; x++) {
        let roadLine = document.createElement("div");
        roadLine.setAttribute("class", "lines");
        roadLine.y = x * 150;
        roadLine.style.top = roadLine.y + "px";
        gameArea.appendChild(roadLine);
    }

    let car = document.createElement("div");
    car.setAttribute("class", "car");
    // car.innerText = 'Hey I am car';
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    // for generating enemy cars
    for (let x = 0; x < 3; x++) {
        let enemyCar = document.createElement("div");
        enemyCar.setAttribute("class", "enemy");
        enemyCar.y = (x + 1) * 350 * -1;
        enemyCar.style.top = enemyCar.y + "px";
        enemyCar.style.backgroundColor = randomColor();
        enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
        gameArea.appendChild(enemyCar);
    }

    // console.log(car.offsetTop);
    // console.log(car.offsetLeft);
}

// to generate random colors of enemy cars
function randomColor() {
    // function c() {
    //     let hex = Math.floor(Math.random() * 256).toString(16);
    //     // return last 2 digits
    //     return ("0" + hex.toString()).slice(-2);
    // }
    // return "#" + c() + c() + c();

    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
