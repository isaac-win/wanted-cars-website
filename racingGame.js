// Get canvas and context
const canvas = document.getElementById("racingGame");
const ctx = canvas.getContext("2d");

const carImage = new Image();
carImage.src = "images/playercarwhite.png"; // Ensure correct path

carImage.onload = () => {
    console.log("Car image loaded successfully.");
};
carImage.onerror = () => {
    console.error("Failed to load car image.");
};

// Define game properties
const laneCount = 3;
const laneWidth = canvas.width / laneCount;

// Player car properties
const car = {
    width: laneWidth * 0.6,
    height: 80,
    x: (laneWidth * 1.5) - (laneWidth * 0.3),
    y: canvas.height - 120,
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
let obstacleSpeed = 5;

// Score and Level System
let score = 0;
let level = 1;
let highScore = localStorage.getItem("highScore") || 0;

// Handle keyboard input
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && car.x > laneWidth / 4) {
        car.x -= laneWidth;
    }
    if (event.key === "ArrowRight" && car.x < canvas.width - laneWidth * 1.25) {
        car.x += laneWidth;
    }
});

// Function to update obstacles
let lastSpawnedLane = -1;
let spawnCooldown = 0;

function updateObstacles() {
    if (spawnCooldown > 0) {
        spawnCooldown--;
        return;
    }

    if (Math.random() < 0.02) {
        let numObstacles = Math.random() < 0.5 ? 1 : 2;
        let availableLanes = [0, 1, 2].filter(lane => lane !== lastSpawnedLane);
    
        for (let i = 0; i < numObstacles; i++) {
            let randomLane = availableLanes.splice(Math.floor(Math.random() * availableLanes.length), 1)[0];
            
            let obstacle = {
                x: (randomLane * laneWidth) + (laneWidth / 4),
                y: -50,
                width: laneWidth / 2,
                height: 50,
                image: loadedObstacleImages[Math.floor(Math.random() * loadedObstacleImages.length)]
            };
    
            obstacles.push(obstacle);
            lastSpawnedLane = randomLane;
        }
    
        spawnCooldown = 60;
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacleSpeed;

        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            i--;
            score += 10;
            if (score % 100 === 0) {
                level++;
                obstacleSpeed++;
            }
        }
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
            return;
        }
    }
}

function resetGame() {
    car.x = (laneWidth * 1.5) - (laneWidth * 0.3);
    car.y = canvas.height - 120;
    obstacles = [];
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    score = 0;
    level = 1;
    obstacleSpeed = 5;
}

// Function to draw the road with lanes
function drawRoad() {
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

// Function to draw UI
function drawUI() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Level: ${level}`, 10, 60);
    ctx.fillText(`High Score: ${highScore}`, 10, 90);
}

// Main game loop
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoad();
    updateObstacles();
    drawObstacles();
    drawCar();
    checkCollisions();
    drawUI();

    requestAnimationFrame(updateGame);
}

canvas.height = 700;
updateGame();
