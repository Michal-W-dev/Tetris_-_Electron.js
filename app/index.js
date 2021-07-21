const grid = document.querySelector('.grid')
const miniGrid = document.querySelector('.mini-grid')
const dispScore = document.querySelector('.score span')
const dispTopScore = document.querySelector('.top-score p')
const dispLevelScore = document.querySelector('.score span + span')
const dispPlayerSpeed = document.querySelector('.speed span')
const dispGameSpeed = document.querySelector('.speed span + span')
const anim = document.querySelector('.anim')
const sideAnim = document.querySelectorAll('.side-anim')
const msg = document.querySelector('.msg p')
const rules = document.querySelector('.rules')
const summonContainer = document.querySelector('.summon')
const dispSummon = document.querySelector('.summon span')
const dispDestroy = document.querySelector('.destroy span')
const dispLevel = [...document.querySelectorAll('.level span + span')]
const dispExtra = [...document.querySelectorAll('.level-extra')]

// Buttons
const startBtn = document.querySelector('.start-btn')
const leftBtn = document.querySelector('.left-btn')
const rightBtn = document.querySelector('.right-btn')
const upBtn = document.querySelector('.up-btn')
const downBtn = document.querySelector('.down-btn')
const summBtn = document.querySelector('.summon-btn')
const destBtn = document.querySelector('.destroy-btn')
const rotateBtn = document.querySelector('.rotate-btn')


let gameSpeed, speed, isGameOver, score, level, levelScore, squares;
let timerId, pause, isLeveledUp, summonLong, destroyRow, topScore;
let rulesScreen = true;

const gridNum = 200;
const width = 10;
const miniGridNum = 25;
const miniWidth = 5;

miniGrid.innerHTML = Array(miniGridNum).fill(`<div class='sq'></div>`).join('');
const miniGridSquares = [...document.querySelectorAll('.mini-grid div')]

sideAnim.forEach(sideAnim => (sideAnim.style.animation = 'rules forwards 2s'))

function initial() {
    isGameOver = false;
    // ANCHOR speed - 310
    gameSpeed = 320;
    speed = gameSpeed;
    score = 0;
    // ANCHOR summon 0
    summonLong = 0;
    destroyRow = 2;
    dispDestroy.textContent = destroyRow;
    level = 1;
    // ANCHOR level Score 20 at least
    levelScore = 20;
    grid.innerHTML = Array(gridNum).fill(`<div class='sq'></div>`).join('');
    grid.innerHTML += Array(width).fill(`<div class='taken'></div>`).join('');

    squares = [...document.querySelectorAll('.grid div')]

    dispLevel.forEach(level => level.textContent = 1)
    dispLevelScore.textContent = levelScore;
    dispPlayerSpeed.textContent = parseInt(12000 / gameSpeed);
    dispGameSpeed.textContent = parseInt(12000 / gameSpeed);
    topScore = JSON.parse(window.localStorage.getItem('topScore') || '0')
    dispTopScore.textContent = topScore;
}
initial()

const tTetro = [
    [1, 10, 11, 12],
    [1, 11, 12, 21],
    [10, 11, 12, 21],
    [1, 10, 11, 21]
];

const zLeftTetro = [
    [0, 10, 11, 21],
    [11, 12, 20, 21],
    [0, 10, 11, 21],
    [11, 12, 20, 21]
];

const zRightTetro = [
    [1, 10, 11, 20],
    [10, 11, 21, 22],
    [1, 10, 11, 20],
    [10, 11, 21, 22]
];

const lLeftTetro = [
    [1, 11, 21, 2],
    [10, 11, 12, 22],
    [1, 11, 21, 20],
    [0, 10, 11, 12]
];

const lRightTetro = [
    [0, 1, 11, 21],
    [10, 11, 12, 2],
    [1, 11, 21, 22],
    [10, 11, 12, 20]
];

const iTetro = [
    [1, 11, 21, 31],
    [10, 11, 12, 13],
    [1, 11, 21, 31],
    [10, 11, 12, 13]
];

const iLongTetro = [
    [2, 12, 22, 32, 42],
    [20, 21, 22, 23, 24, 25],
    [2, 12, 22, 32, 42],
    [20, 21, 22, 23, 24, 25]
];

const cTetro = [
    [1, 2, 11, 21, 22],
    [20, 10, 11, 12, 22],
    [0, 1, 11, 20, 21],
    [0, 10, 11, 12, 2]
];

const oTetro = [
    [1, 2, 11, 12],
    [1, 2, 11, 12],
    [1, 2, 11, 12],
    [1, 2, 11, 12]
];

const tetros = [tTetro, cTetro, oTetro, iTetro, zLeftTetro, zRightTetro, lLeftTetro, lRightTetro, iLongTetro]

const nextTetros = [
    // [1, 10, 11, 12] -  tTetro
    [1, miniWidth, miniWidth + 1, miniWidth + 2],
    // [1, 2, 11, 21, 22] - cTetro
    [1, 2, miniWidth + 1, 2 * miniWidth + 1, 2 * miniWidth + 2],
    // [1, 2, 11, 12]  - oTetro
    [1, 2, miniWidth + 1, miniWidth + 2],
    // [1, 11, 21, 31]  - iTetro
    [1, miniWidth + 1, 2 * miniWidth + 1, 3 * miniWidth + 1],
    // [0, 10, 11, 21]  - zLeftTetro
    [0, miniWidth, miniWidth + 1, 2 * miniWidth + 1],
    // [1, 10, 11, 20]  - zRightTetro
    [1, miniWidth, miniWidth + 1, 2 * miniWidth],
    // [1, 11, 21, 2]  -  lLeftTetro
    [1, miniWidth + 1, 2 * miniWidth + 1, 2],
    // [0, 1, 11, 21] -  lRightTetro
    [0, 1, miniWidth + 1, 2 * miniWidth + 1],
    // [2, 12, 22, 32, 42] - iLongTetro 
    [1 - miniWidth, 1, miniWidth + 1, 2 * miniWidth + 1, 3 * miniWidth + 1]
]
// Color pallete: 0 - 360
const colors = ['10', '35', '120', '210', '260', '280', '310', '330', '350']

let curPos = 4;
let randTetro = Math.floor(Math.random() * (tetros.length - 1))
let randRot = Math.floor(Math.random() * 4)
let randNextTetro = Math.floor(Math.random() * (nextTetros.length - 1))
let colorTaken = randTetro;
drawMini()

let curTetro = tetros[randTetro]
document.body.style.setProperty('--color-main', colors[randTetro]);
colors.forEach((color, i) => document.body.style.setProperty(`--color-shape-${i}`, color))


function draw() {
    curTetro[randRot].forEach(shape => { if (squares[curPos + shape]) squares[curPos + shape].classList.add('active') })
}
function drawMini() {
    nextTetros[randNextTetro].forEach(shape => {
        if (miniGridSquares[1 + miniWidth + shape]) miniGridSquares[1 + miniWidth + shape].classList.add('active');
    })
    document.body.style.setProperty('--color-mini', colors[randNextTetro]);
}

function undraw() {
    curTetro[randRot].forEach(shape => { if (squares[curPos + shape]) squares[curPos + shape].classList.remove('active') })
}
function undrawMini() {
    nextTetros[randNextTetro].forEach(shape => {
        if (miniGridSquares[1 + miniWidth + shape]) miniGridSquares[1 + miniWidth + shape].classList.remove('active')
    })
}

function gameRestart() {
    pause = false;
    dispLevel[1].previousSibling.textContent = 'Level: '
    resetAnim(anim)
    sideAnim.forEach(sideAnim => resetAnim(sideAnim))
    anim.style.animation = 'top 12s 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
    sideAnim.forEach(sideAnim => (sideAnim.style.animation = 'darken forwards 10s 0.5s'))
    initial();
    summonContainer.classList.remove('show')
    setTimeout(() => (timerId = setTimeout(moveDown, speed)), 2000)
}

function resetAnim(el) {
    el.style.animation = 'none'
    el.offsetTop;
    el.style.animation = null
}


// FREEZE FUNCTIONS - AddScore(), LevelUp(), GameOver()
function addScore() {
    let innerScore = 0;
    for (let i = 0; i < 199; i += width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
        if (row.every(idx => squares[idx].classList.contains('taken'))) {
            row.forEach(i => squares[i].className = 'sq')
            innerScore += 10
            const squaresRemoved = squares.splice(i, width)
            squares.splice(0, 0, ...squaresRemoved)
            grid.prepend(...squaresRemoved)
            // squares.forEach(cell => grid.appendChild(cell));          
        }
    }
    msg.style.color = 'DarkCyan'
    msg.parentNode.style.backgroundColor = 'rgba(87, 0, 141, 0.07)'
    if (innerScore === 10) {
        innerScore = 10; msg.textContent = 'Good!'
    }
    else if (innerScore === 20) { innerScore = 30; msg.textContent = 'Cool!' }
    else if (innerScore === 30) {
        innerScore = 60;
        msg.style.color = 'hsl(150, 100%, 30%)'
        msg.parentNode.style.backgroundColor = 'hsl(150, 100%, 94%)'
        msg.textContent = '+1 to Destroy Row'
        destroyRow++;
        dispDestroy.textContent = destroyRow;
    }
    else if (innerScore === 40) {
        innerScore = 100;
        msg.style.color = 'hsl(150, 100%, 30%)'
        msg.parentNode.style.backgroundColor = 'hsl(150, 100%, 94%)'
        msg.textContent = `Summon +1`;
        summonLong++;
        dispSummon.textContent = summonLong;
    }
    else if (innerScore === 50) {
        innerScore = 50;
        msg.style.color = 'hsl(150, 100%, 30%)'
        msg.parentNode.style.backgroundColor = 'hsl(150, 100%, 94%)'
        msg.textContent = `game speed reduced`;
        gameSpeed += 30;
        if (speed + 30 === gameSpeed) { speed += 30; dispPlayerSpeed.textContent = parseInt(12000 / speed) }
        dispGameSpeed.textContent = parseInt(12000 / gameSpeed);
    }
    else { msg.textContent = 'Tetris..' }
    score += innerScore;
    dispScore.textContent = score;
}

function randomSquaresAtLevelUp() {
    let levelHeight = level + 1;
    // top levelHeight where can appear random squares
    if (levelHeight > 12) { levelHeight = 12 }
    // console.log(levelHeight);
    let randFrom = gridNum - (levelHeight * width)
    let randomSq1 = Math.floor(Math.random() * levelHeight * width)
    let randomSq2 = Math.floor(Math.random() * levelHeight * width)
    let randomSq3 = Math.floor(Math.random() * levelHeight * width)
    let randomSq4 = Math.floor(Math.random() * levelHeight * width)
    let randomSq5 = Math.floor(Math.random() * levelHeight * width)
    const randSqLevelUp = [randomSq1, randomSq2, randomSq3, randomSq4, randomSq5]
    // console.log(randSqLevelUp);
    randSqLevelUp.forEach(randSq => {
        if (!squares[randSq + randFrom].classList.contains('taken')) {
            squares[randSq + randFrom].classList.add('taken', 'b1')
        }
    })
}

function levelUp() {
    if (score >= levelScore) {
        isLeveledUp = true;
        levelScore *= 2;
        level += 1;
        dispLevelScore.textContent = levelScore;
        dispLevel.forEach(level => level.textContent = +level.textContent + 1)
        // ANCHOR summon - after each level
        if (level % 2 === 0) {
            // 5% to summon +1
            let rand = Math.random()
            if (rand < 0.05) {
                summonLong++
                dispExtra[0].classList.remove('hidden')
            } else if (rand > 0.5) {
                // 50% to summon +2
                summonLong += 2;
                dispExtra[1].classList.remove('hidden')
            } else {
                // 45% to destroy +1, summon +1
                summonLong++;
                destroyRow++;
                dispDestroy.textContent = destroyRow
                dispExtra[2].classList.remove('hidden')
            }
            dispSummon.textContent = summonLong
            summonContainer.classList.add('show')
        }
        gameSpeed -= 10;
        dispGameSpeed.textContent = parseInt(12000 / gameSpeed);
        if (speed > gameSpeed) {
            speed = gameSpeed
            dispPlayerSpeed.textContent = parseInt(12000 / speed);
        }
        randomSquaresAtLevelUp()
        // Animation LevelUp
        setTimeout(() => clearTimeout(timerId))
        timerId = null;
        resetAnim(anim)
        sideAnim.forEach(sideAnim => {
            resetAnim(sideAnim); sideAnim.style.animation = 'darken 10s 0.5s'
        })
        anim.style.animation = 'top 12s 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
        setTimeout(() => {
            timerId = setTimeout(moveDown, speed);
            isLeveledUp = false;
        }, 2100)
        setTimeout(() => (dispExtra.forEach((el) => el.classList.add('hidden'))), 5000)
    }
}

function gameOver() {
    if (curTetro[randRot].some(shape => squares[curPos + shape].classList.contains('taken'))) {
        isGameOver = true;
        setTimeout(() => clearTimeout(timerId))
        timerId = null;
        dispScore.innerHTML = score;
        // Save top score in localStorage
        if (topScore < score) {
            window.localStorage.setItem('topScore', JSON.stringify(score))
            dispTopScore.textContent = score;
        }
        dispLevel[1].textContent = ''
        dispLevel[1].previousSibling.textContent = 'Game Over'
        resetAnim(anim)
        sideAnim.forEach(sideAnim => {
            resetAnim(sideAnim); sideAnim.style.animation = 'gameOver 0.5s 0.5s forwards cubic-bezier(0.34, 1.56, 0.64, 1)'
        })
        anim.style.animation = 'gameOver 0.5s 0.5s forwards cubic-bezier(0.34, 1.56, 0.64, 1)';
        startBtn.textContent = 'Restart'
        pause = true;
    }
}


function freeze() {
    let isTaken = curTetro[randRot].some(shape => squares[curPos + shape + width].classList.contains('taken'));
    if (isTaken) {
        curTetro[randRot].forEach(shape => squares[curPos + shape].classList.add('taken', `c${colorTaken}`))
        curPos = 4;
        colorTaken = randNextTetro;
        randRot = Math.floor(Math.random() * 4)
        curTetro = tetros[randNextTetro]
        document.body.style.setProperty('--color-main', colors[randNextTetro]);
        addScore()
        draw()
        undrawMini()
        randNextTetro = Math.floor(Math.random() * (nextTetros.length - 1))
        drawMini()
        levelUp()
        gameOver()
    }
}

function moveDown() {
    freeze()
    undraw()
    curPos += width;
    draw()
    timerId = setTimeout(moveDown, speed)
}

function startFirstGame() {
    // hide Rules
    rules.classList.add('hidden')
    // show Levels
    dispLevel[1].parentNode.classList.remove('hidden')
    // change Animations
    anim.classList.remove('start-anim')
    anim.parentNode.classList.remove('start-screen')
    anim.style.animation = 'top 12s 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
    sideAnim.forEach(sideAnim => (sideAnim.style.animation = 'darken forwards 10s 0.5s'))
}

// START BUTTON
function startPauseRestart() {
    if (!isGameOver) {
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
            startBtn.textContent = 'Start';
            pause = true
        } else {
            if (!rulesScreen) {
                timerId = setTimeout(moveDown, speed)
                startBtn.textContent = 'Pause';
                pause = false;
            } else {
                setTimeout(() => (timerId = setTimeout(moveDown, speed)), 1000)
                startBtn.textContent = 'Pause';
                pause = false;
                rulesScreen = false;
                startFirstGame()
            }
        }
    } else {
        gameRestart()
        startBtn.textContent = 'Pause';
    }
}

startBtn.addEventListener('click', () => {
    startPauseRestart()
})


// MOVEMENT FUNCTIONS - Left, Right, Up, Down, R
function moveLeft() {
    let leftSpaceIsTaken = true;
    let isAtLeftEdge = curTetro[randRot].some(shape => (curPos + shape) % width === 0);
    leftSpaceIsTaken = curTetro[randRot].some(shape => squares[curPos - 1 + shape].classList.contains('taken'));
    if (!leftSpaceIsTaken) {
        if (!isAtLeftEdge) curPos -= 1;
    }
}

function moveRight() {
    let rightSpaceIsTaken = true;
    let isAtRightEdge = curTetro[randRot].some(shape => (curPos + shape) % width === width - 1);
    rightSpaceIsTaken = curTetro[randRot].some(shape => squares[curPos + 1 + shape].classList.contains('taken'))
    if (!rightSpaceIsTaken) {
        if (!isAtRightEdge) curPos += 1;
    }
}

function rotate() {
    let nextRotate = (randRot < 3) ? randRot + 1 : 0;
    // console.log(nextRotate);
    let canRotate = curTetro[nextRotate].some(shape => {
        if (squares[curPos + shape].classList.contains('taken')) { return true }
        // can rotate left (check wall)
        else if ((curPos + 1) % width < width / 2) { return (curPos + 1 + shape) % width === 0 }
        // can rotate right (check wall)
        else { return (curPos + shape) % width === 0 }
    });
    if (!canRotate) {
        randRot = (randRot < 3) ? randRot + 1 : 0;
    }
}

function speedUp() {
    if (speed > 200) speed = 200
    else if (speed === 200) speed = 120;
    dispPlayerSpeed.textContent = parseInt(12000 / speed);
}
function slowDown() {
    speed = gameSpeed;
    dispPlayerSpeed.textContent = parseInt(12000 / speed);
}

// SUMMON & DESTROY FUNCTIONS
function summonLongShape() {
    msg.textContent = 'summonning..'
    miniGridSquares.forEach(sq => { resetAnim(sq); sq.style.animation = 'summoning 1.5s' })
    setTimeout(() => {
        summonLong--
        dispSummon.textContent = summonLong
        let rand = Math.random()
        if (rand > 0.1) {
            undrawMini()
            randNextTetro = nextTetros.length - 1
            drawMini()
            msg.style.color = 'hsl(150, 100%, 30%)'
            msg.parentNode.style.backgroundColor = 'hsl(150, 100%, 94%)'
            msg.textContent = 'successful!'
        } else {
            msg.style.color = 'crimson';
            msg.parentNode.style.backgroundColor = 'hsl(350, 100%, 94%)'
            msg.textContent = 'FAILED!'
        }
    }, 1100)
}

function destroyLastRow() {
    destroyRow--
    dispDestroy.textContent = destroyRow;
    let lastRow = gridNum - width  // 200 - 10
    for (let i = lastRow; i < gridNum; i++) {
        squares[i].className = 'sq'
    }
    const squaresDestroyed = squares.splice(lastRow, width)  // 190, 10
    console.log(squaresDestroyed);
    squares.splice(0, 0, ...squaresDestroyed)
    grid.prepend(...squaresDestroyed)
    msg.parentNode.style.backgroundColor = 'hsl(150, 100%, 94%)'
    msg.textContent = 'Row destroyed'
}

document.addEventListener('keydown', (evt) => {
    undraw()
    if (!pause) {
        if (evt.key === 'ArrowLeft') moveLeft();
        else if (evt.key === 'ArrowRight') moveRight();
        else if (evt.key === 'ArrowDown') speedUp();
        else if (evt.key === 'ArrowUp') slowDown();
        else if (evt.key === 'f') rotate();
    }
    if (!isLeveledUp) {
        if (evt.key === 'p') { startPauseRestart(); }
    }
    // if (!pause && summonLong > 0) {
    if (summonLong > 0) {
        if (evt.key === 's') {
            summonLongShape()
        }
    }
    if (destroyRow > 0) {
        if (evt.key === 'd') {
            destroyLastRow()
        }
    }
    draw()
})

// ------------------ FUTURE DEVELOPMENT ------------------ //
// BUTTONS mobile (future development)
// leftBtn.addEventListener('click', () => { if (!pause) { undraw(); moveLeft(); draw() } })
// rightBtn.addEventListener('click', () => { if (!pause) { undraw(); moveRight(); draw() } })
// upBtn.addEventListener('click', () => { if (!pause) { undraw(); slowDown(); draw() } })
// downBtn.addEventListener('click', () => { if (!pause) { undraw(); speedUp(); draw() } })
// rotateBtn.addEventListener('click', () => { if (!pause) { undraw(); rotate(); draw() } })

// summBtn.addEventListener('click', () => {
//     if (summonLong > 0) {
//         undraw();
//         summonLongShape();
//         draw();
//     }
// })

// destBtn.addEventListener('click', () => {
//     if (destroyRow > 0) {
//         undraw();
//         destroyLastRow();
//         draw();
//     }
// })
