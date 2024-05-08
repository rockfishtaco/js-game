const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.results')
let currentShooterIndex = 202
let width = 15
let direction = 1
let invadersId
let goingRight = true

for (let i = 0; i < 225; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39

]
function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.add('invader')
    }
}
draw()

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}
squares[currentShooterIndex].classList.add('shooter')


function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch (e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
            break
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
            break
    }
    squares[currentShooterIndex].classList.add('shooter')
}
document.addEventListener('keydown', moveShooter)

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === -1
    remove()

    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
            direction = -1
            goingRight = false
        }
    }
    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1
            direction = 1
            goingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()

    if (squares[currentShooterIndex].classList.contains('invader, shooter')) {
        resultsDisplay.innerHTML = 'GAME OVER'
        clearInterval(invadersId)
    }
    for (let i = 0; i < alienInvaders.length; i++) {
        if (alienInvaders[i] > (squares.length)) {
            resultDisplay.innerHTML = 'GAME OVER'
            clearInterval(invadersId)
        }
    }
}

invadersId = setInterval(moveInvaders, 100)

// Define variables for the shooter's missile, missile index, and missile movement interval
let currentMissileIndex
let missileId
let missileMoving = false

// Function to move the missile
function moveMissile() {
    squares[currentMissileIndex].classList.remove('missile')
    currentMissileIndex -= width
    squares[currentMissileIndex].classList.add('missile')

    // Check if missile hits an invader
    if (squares[currentMissileIndex].classList.contains('invader')) {
        squares[currentMissileIndex].classList.remove('missile')
        squares[currentMissileIndex].classList.remove('invader')
        squares[currentMissileIndex].classList.add('boom')

        setTimeout(() => squares[currentMissileIndex].classList.remove('boom'), 250)
        clearInterval(missileId)

        const invaderTakenDown = alienInvaders.indexOf(currentMissileIndex)
        alienInvaders.splice(invaderTakenDown, 1)

        // Check if all invaders are defeated
        if (alienInvaders.length === 0) {
            resultsDisplay.innerHTML = 'YOU WIN!'
            clearInterval(invadersId)
            document.removeEventListener('keydown', moveShooter)
        }
    }

    // Check if missile reaches the top
    if (currentMissileIndex < width) {
        clearInterval(missileId)
        setTimeout(() => squares[currentMissileIndex].classList.remove('missile'), 100)
    }
}

// Function to handle shooting
function shoot(e) {
    if (e.key === 'ArrowUp') {
        if (!missileMoving) {
            missileMoving = true
            currentMissileIndex = currentShooterIndex

            // Move missile upwards
            missileId = setInterval(moveMissile, 100)
        }
    }
}

document.addEventListener('keydown', shoot)
