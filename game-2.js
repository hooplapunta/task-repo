// Game doesn't end when hitting the top
// Left/Right moves the piece in the direction continuously


let play = false;
const W = 640, H = 640;
const t = document.getElementById('t');
t.height = W;
t.width = H;
const gt = t.getContext('2d');
const enumC = {
    GREEN: 0,
    RED: 1,
    PURPLE: 2,
    YELLOW: 3
}
const sh = {
    'z': [[0, -1], [0, 0], [-1, 0], [-1, 1]],
    's': [[0, -1], [0, 0], [1, 0], [1, 1]],
    'i': [[0, -1], [0, 0], [0, 1], [0, 2]],
    't': [[-1, 0], [0, 0], [1, 0], [0, 1]],
    'sq': [[0, 0], [1, 0], [0, 1], [1, 1]],
    'l': [[-1, -1], [0, -1], [0, 0], [0, 1]],
    'j': [[1, -1], [0, -1], [0, 0], [0, 1]] 
};
const ds = {
    'left': [-1, 0],
    'right': [1, 0],
    'down': [0, 1]
}
var fs; 
var fsRow = 1;
var fsCol = 7;
let falling = false;
let stime, pt;
let col = 0;
var keyDown = false;
let grid = new Grid();
let cd = 'down';
const nr = 20;
const nc = 14;
let st = 0;
var elapsed = 0;

const draw = () => {
    gt.clearRect(0, 0, W, H);
    gt.fillStyle = 'white';
    gt.clearRect(0, 0, 640, 640);
    gt.rect(0, 0, 640, 640);
    gt.closePath();
    gt.fill();
    if(!play) {
        gt.font = '30px Arial';
        gt.fillStyle = 'black';
        gt.textAlign = 'center';
        gt.fillText('Play Tetris - press Enter to Start', 320, 320);
    }
    else {
        fs = getRandomShape();
        col = getRandomColor();
        falling = true;
        clear();
        animate();
    }
}

const displayGameOver = () => {
    play = false;
    gt.clearRect(0, 0, W, H);
    gt.fillStyle = 'white';
    gt.clearRect(0, 0, 640, 640);
    gt.rect(0, 0, 640, 640);
    gt.closePath();
    gt.fill();
    gt.font = '30px Arial';
    gt.fillStyle = 'black';
    gt.textAlign = 'center';
    gt.fillText(`You got ${st} rows`, 320, 320);
    gt.fillText(`Press Enter to play again.`, 320, 360);  
}

const getRandomColor = () => {
    const k = Object.keys(enumC)
    return enumC[k[Math.floor(Math.random() * k.length)]];
}

const getRandomShape = () => {
    const k = Object.keys(sh)
    return sh[k[Math.floor(Math.random() * k.length)]];
}

function removeLines() {
    var count = 0;
    for (var r = 0; r < nr - 1; r++) {
        for (var c = 1; c < nc - 1; c++) {
            if (grid.squares[r][c] === -1)
                break;
            if (c === nc - 2) {
                count++;
                removeLine(r);
            }
        }
    }
    return count;
}



const shapeLanded = () => {
    fs.forEach(pos => {
        grid.squares[fsRow + pos[1]][fsCol + pos[0]] = col;
    });

    st = removeLines();
    if(fsRow < 0) {
        displayGameOver();
    }
}

const moveShape = () => {
    if(falling) {
        fs.forEach(f => new Square(30 * (fsCol + f[0]), 30 * (fsRow + f[1]), 30).draw(gt, col));
        if(checkNoBlockCollision()) {
            fsCol += ds[cd][0];
            fsRow += ds[cd][1];
        }
        else {
            shapeLanded();
            fs = getRandomShape();
            col = getRandomColor();
            fsRow = 1;
            fsCol = 5; 
        }
    }
}

const checkIfRotate = () => {
    var pos = new Array(4);
    for (var i = 0; i < pos.length; i++) {
        pos[i] = fs[i].slice();
    }
    pos.forEach(t => {
        let temp = t[0];
        t[0] = t[1];
        t[1] = temp;
    });

    return pos.every((r) => {
        let nc = fsCol + r[0];
        let nr = fsRow + r[1];
        return grid.squares[nr][nc] === -1;
    });
}

const checkNoBlockCollision = () => {
    return fs.every(s => {
        let c = fsCol + ds[cd][0] + s[0];
        let r = fsRow + ds[cd][1] + s[1];
        return grid.squares[r][c] === -1;
    });
}

const clear = () => {
    gt.fillStyle = 'white';
    gt.clearRect(0, 0, 640, 640);
    gt.rect(0, 0, 640, 640);
    gt.closePath();
    gt.fill();
}

const refresh = () => {
    clear();
    grid.draw(gt);
    moveShape();
}

function animate(t) {
    if(pt === undefined) {
        pt = 0;
    }
    elapsed = t - pt;
    window.requestAnimationFrame(animate);
    if(play) {
        if(elapsed >= 600) {
            clear();
            // cd = 'down';
            grid.draw(gt);
            moveShape();
            pt = t;
            elapsed = 0;
        }
    }
}

const init = () => {
    clear();
    grid = new Grid(nr, nc);
    draw();
}

const rotate = () => {

    fs.forEach(r => {
        let t = r[0];
        r[0] = r[1];
        r[1] = -t;
    });
}

const sg = () => {
    init();
}

function removeLine(line) {
    for (var c = 0; c < nc; c++)
        grid.squares[line][c] = -1;

    for (var c = 0; c < nc; c++) {
        for (var r = line; r > 0; r--)
            grid.squares[r][c] = grid.squares[r - 1][c];
    }
}

window.addEventListener('keydown', (e) => {
    const { key } = e;
    switch(key) {
        case 'Enter':
            if(!play) {
                play = true;
                sg();
            }
            break;
        case 's':
        case 'ArrowDown':
            e.preventDefault();
            cd = 'down';
            if(checkNoBlockCollision()) refresh();
            break;
        case 'w':
        case 'ArrowUp':
            e.preventDefault();
            if(checkIfRotate()) rotate();
            break;
        case 'a':
        case 'ArrowLeft':
            cd = 'left';
            if(checkNoBlockCollision()) refresh();
            break;
        case 'd':
        case 'ArrowRight':
            cd = 'right';
            if(checkNoBlockCollision()) refresh();
            break;
        }
});

init();