// Get canvas and context
const canvas = document.getElementById("racingGame");
const ctx = canvas.getContext("2d");


const carImage = new Image();
carImage.src = "images/cupra290front.png"; // Make sure this path is correct

carImage.onload = () => {
    console.log("Car image loaded successfully.");
};
carImage.onerror = () => {
    console.error("Failed to load car image.");
};


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

const obstacleImages = [
    "images/barrier.png",
    "images/sign_blue.png",
    "images/sign_red.png"
];

// Preload images
const loadedObstacleImages = [];
let imagesLoaded = 0;

obstacleImages.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === obstacleImages.length) {
            console.log("All obstacle images loaded.");
        }
    };
    loadedObstacleImages.push(img);
});


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
    if (Math.random() < 0.02) { // 2% chance per frame (~1 every 2 sec)
        let numObstacles = Math.random() < 0.5 ? 1 : 2; // 50% chance for 1 or 2 obstacles
        let availableLanes = [0, 1, 2].filter(lane => lane !== lastSpawnedLane); // Avoid last lane
    
        for (let i = 0; i < numObstacles; i++) {
            let randomLane = availableLanes.splice(Math.floor(Math.random() * availableLanes.length), 1)[0]; // Pick a lane
            
            let obstacle = {
                x: (randomLane * laneWidth) + (laneWidth / 4),
                y: -50,
                width: laneWidth / 2,
                height: 50,
                image: loadedObstacleImages[Math.floor(Math.random() * loadedObstacleImages.length)]
            };
    
            obstacles.push(obstacle);
            lastSpawnedLane = randomLane; // Store last used lane
        }
    
        spawnCooldown = 60; // Add cooldown (~1 sec)
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
    car.y = canvas.height - 100; // Reset car's position
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
    ctx.drawImage(carImage, car.x, car.y, car.width, car.height);
}

// Function to draw obstacles
function drawObstacles() {
    for (let obstacle of obstacles) {
        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
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
