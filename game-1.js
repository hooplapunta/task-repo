
let f = false // TODO: what is f?
let start;
// TODO: finish timing code??? Game is moving too fast

const c = document.getElementById('c'); // TODO: can we use a better identifier
c.width = 640;
c.height = 640;
let point = 0;
const g = c.getContext('2d');
let d = 'up'; // direction?
let dx = 20, dy = 20; // grid movement length?
let food = { x: getRandomArbitrary(1, 640), y: getRandomArbitrary(1, 640) };
let s = [{ x: 320, y: 320 }]; // TODO: what is S? series of coordinates, controls snake drawing

const MOVE = { 
    'up': (pos) => { return { x: pos.x, y: pos.y - dy } }, 
    'down': (pos) => { return { x: pos.x, y: pos.y + dy } }, // canvas draws from top left, increasing values go down
    'left': (pos) => { return { x: pos.x - dx, y: pos.y } },
    'right': (pos) => { return { x: pos.x + dx, y: pos.y } }
}


const generateFood = () => {
    const { x, y } = drawFood();
    food = { x, y };
}

const drawFood = () => {
    const pos = { x: Math.floor(getRandomArbitrary(10, 640)), y: Math.floor(getRandomArbitrary(10, 640)) };
    new Circle(pos.x, pos.y, 10).draw(g);
    return pos;
}

const drawSnake = () => {
    s.forEach(r => new Rectangle(r.x, r.y, 10, 10).draw(g));
}

const checkIfLegalMove = (s) => {
    return s.every(pos => pos.x > 0 && pos.x < 640 && pos.y > 0 && pos.y < 640);
}

const moveSnake = (timestamp) => {
    if(!f) { // probably the game start state?
        return;
    }
    if(!start) {
        start = timestamp;
    }

    const oldS = s; // BUG: should be just moving all the S positions?
    s = s.map((p, i) => {
        return i === 0 ? MOVE[d](p) : oldS[i - 1]; // if first position, move, otherwise use oldS
    }); 

    const legal = checkIfLegalMove(s);
    const id = legal && f && window.requestAnimationFrame(function() {
        setTimeout(() => { moveSnake() }, 500);
    });
    // Game Loop is handled by moveSnake()
    // implement a game pause: https://www.sitepoint.com/delay-sleep-pause-wait/
    // TODO: what is ID used for?
    
    // new Circle(food.x, food.y, 10).draw(g); 
    // BUG: generates a new food on every move, instead draw on food consumption

    if(!legal) {
        drawSnake();
        gameOver();
        return;
    }

    if(checkFoodCollision()) {
        generateFood();
        const endOfSnake = s[s.length - 1];
        switch(d) { // BUG: tail logic seems off, might be opposite and doesn't account for tail diff from head
            case 'up':
                s.push({ x: endOfSnake.x, y: endOfSnake.y - dy });
                break;
            case 'down':
                s.push({ x: endOfSnake.x, y: endOfSnake.y + dy });
                break;
            case 'left':
                s.push({ x: endOfSnake.x + dx, y: endOfSnake.y });
                break;
            case 'right':
                s.push({ x: endOfSnake.x - dx, y: endOfSnake.y });
                break;
        }
        point += 50;
    }

    drawSnake();
    
}

// TODO : implement Scoreboard? 


const intro = () => {
    g.font = '30px Arial';
    g.fillStyle = 'black';
    
    g.textAlign = 'center';
    
    g.fillText('Play Snake - press Enter to Start', 320, 320);
}

const startGame = () => {
    // TODO: need to clear the board
    // TODO: size should be a global variable
    g.clearRect(0, 0, 640, 640)

    if(f) {
        s = [{ x: 320, y: 320 }];
        d = 'up';
        generateFood();
        moveSnake();
    }
}

const gameOver = () => {
    f = false;
    g.font = '30px Arial';
    g.fillStyle = 'black';
    g.textAlign = 'center';
    g.fillText(`Game over! You earned ${point} points.`, 320, 320);
    g.fillText(`Press Enter to play again.`, 320, 360);

    setTimeout(() => { 
        if(!f) {
             // clear the board automatically
            g.clearRect(0, 0, 640, 640)

            intro();
        }
    }, 10000);
}

const checkFoodCollision = () => {
    return ((food.x - Math.floor( 5 * Math.PI) < s[0].x ) || (food.x + Math.floor( 5 * Math.PI)) > s[0].x) && 
    ((food.y - Math.floor( 5 * Math.PI) < s[0].y ) || (food.y + Math.floor( 5 * Math.PI)) > s[0].y)
}

window.addEventListener('keydown', (e) => {
    const { key } = e;
    switch(key) {
        case 'Enter':
            e.preventDefault();
            if(!f) {
                f = true;
                startGame();
            }
            break;
        case 's':
        case 'ArrowDown':
            if(d === 'up' && s.length > 1) { // TODO: Ask if going backwards should automatically end the game
                gameOver();
                return;
            }
            d = 'down';
            break;
        case 'w':
        case 'ArrowUp':
            if(d === 'down' && s.length > 1) {
                gameOver();
                return;
            }
            d = 'up';
            break;
        case 'a':
        case 'ArrowLeft':
            if(d === 'right' && s.length > 1) {
                gameOver();
                return;
            }
            d = 'left';
            break;
        case 'd':
        case 'ArrowRight':
            if(d === 'left' && s.length > 1) {
                gameOver();
                return;
            }
            d = 'right';
            break;
    }
});



intro();

