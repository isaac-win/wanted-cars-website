// Get canvas and context
const canvas = document.getElementById("racingGame");
const ctx = canvas.getContext("2d");

// Define game properties
const laneCount = 3; // Number of lanes
const laneWidth = canvas.width / laneCount; // Width of each lane

// Player car properties
const car = {
    width: laneWidth / 2,
    height: 50,
    x: laneWidth / 2, // Start in the middle lane
    y: canvas.height - 100,
    speed: 10
};

// Obstacles array
let obstacles = [];
const obstacleSpeed = 5;

// Handle keyboard input
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && car.x > laneWidth / 4) {
        car.x -= laneWidth; // Move left
    }
    if (event.key === "ArrowRight" && car.x < canvas.width - laneWidth * 1.25) {
        car.x += laneWidth; // Move right
    }
});

// Function to update obstacles
// Track last spawned lane to prevent all lanes being filled
let lastSpawnedLane = -1;
let spawnCooldown = 0;

function updateObstacles() {
    // Reduce cooldown (prevents too frequent spawns)
    if (spawnCooldown > 0) {
        spawnCooldown--;
        return; // Skip spawning until cooldown is over
    }

    // Only spawn a new obstacle sometimes
    if (Math.random() < 0.02) { // 2% chance per frame (~1 every 2 seconds)
        let availableLanes = [0, 1, 2].filter(lane => lane !== lastSpawnedLane); // Avoid last lane
        let randomLane = availableLanes[Math.floor(Math.random() * availableLanes.length)]; // Pick a lane

        let obstacle = {
            x: (randomLane * laneWidth) + (laneWidth / 4),
            y: -50,
            width: laneWidth / 2,
            height: 50
        };

        obstacles.push(obstacle);
        lastSpawnedLane = randomLane; // Store last used lane
        spawnCooldown = 60; // Add cooldown (~1 second)
    }

    // Move obstacles down
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacleSpeed;

        // Remove off-screen obstacles
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            i--; // Adjust index after removal
        }
    }
}

    // Move obstacles down
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacleSpeed;

        // Remove off-screen obstacles
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            i--; // Adjust index after removal
        }
    }
 

// Function to check for collisions
function checkCollisions() {
    for (let obstacle of obstacles) {
        if (
            car.x < obstacle.x + obstacle.width &&
            car.x + car.width > obstacle.x &&
            car.y < obstacle.y + obstacle.height &&
            car.y + car.height > obstacle.y
        ) {
            alert("Game Over!");
            resetGame();
            return; // Restart game
        }
    }
}

function resetGame() {
    car.x = (laneWidth * 1.5) - (laneWidth / 4); // Reset car to the middle lane
    car.y = canvas.height - 80; // Reset car's position
    obstacles = []; // Clear all obstacles
}



// Function to draw the road with lanes
function drawRoad() {
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw lane lines
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    for (let i = 1; i < laneCount; i++) {
        let x = i * laneWidth;
        ctx.setLineDash([20, 20]);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
}

// Function to draw the car
function drawCar() {
    ctx.fillStyle = "red";
    ctx.fillRect(car.x, car.y, car.width, car.height);
}

// Function to draw obstacles
function drawObstacles() {
    ctx.fillStyle = "black";
    for (let obstacle of obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

// Main game loop
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoad();
    updateObstacles();
    drawObstacles();
    drawCar();
    checkCollisions();

    requestAnimationFrame(updateGame);
}

canvas.height = 700;

// Start the game loop
updateGame();
