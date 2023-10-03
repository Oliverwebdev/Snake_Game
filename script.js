let gameInterval;
const gameBoard = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const highscoreDisplay = document.getElementById("highscore");
const startButton = document.getElementById("start-button");
const gridSize = 20;
let snake = [{ x: 5, y: 5 }];
let food = { x: 10, y: 10 };
let direction = "right";
let score = 0;
let highscore = 0;
let gameRunning = false;

const gameAudio = document.getElementById("game-audio");
const gameOverAudio = document.getElementById("game-over-audio");
const eatAppleAudio = document.getElementById("eat-apple-audio");


// game sounds
function startGame() {
  if (!gameRunning) {
    startButton.disabled = true;
    gameInterval = setInterval(gameLoop, 100);
    gameRunning = true;
    gameAudio.play(); // Spiele den Audioklang ab, wenn das Spiel gestartet wird
  }
}

function draw() {
  gameBoard.innerHTML = "";

  snake.forEach((segment) => {
    const snakeSegment = document.createElement("div");
    snakeSegment.style.gridRowStart = segment.y;
    snakeSegment.style.gridColumnStart = segment.x;
    snakeSegment.classList.add("snake");
    gameBoard.appendChild(snakeSegment);
  });

  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  gameBoard.appendChild(foodElement);

  scoreDisplay.textContent = `Punkte: ${score}`;
  highscoreDisplay.textContent = `Highscore: ${highscore}`;
}

startButton.addEventListener("click", startGame);


function move() {
  const head = { ...snake[0] };

  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    if (score > highscore) {
      highscore = score;
    }
    eatAppleAudio.play(); // Spiele den Apfel-Sound ab, wenn die Schlange den Apfel frisst

    food = {
      x: Math.floor(Math.random() * gridSize) + 1,
      y: Math.floor(Math.random() * gridSize) + 1,
    };
  } else {
    snake.pop();
  }
  checkCollision(); // Überprüfe auf Kollision nach jedem Zug

}

function changeDirection(event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction !== "down") direction = "up";
      break;
    case "ArrowDown":
      if (direction !== "up") direction = "down";
      break;
    case "ArrowLeft":
      if (direction !== "right") direction = "left";
      break;
    case "ArrowRight":
      if (direction !== "left") direction = "right";
      break;
  }
}

// Event-Handler für Tasten- und Touch-Ereignisse
function changeDirection(event) {
  if (event.type === "keydown") {
      switch (event.key) {
          case "ArrowUp":
              if (direction !== "down") direction = "up";
              break;
          case "ArrowDown":
              if (direction !== "up") direction = "down";
              break;
          case "ArrowLeft":
              if (direction !== "right") direction = "left";
              break;
          case "ArrowRight":
              if (direction !== "left") direction = "right";
              break;
      }
  } else if (event.type === "touchstart") {
      // Berührungsposition speichern, wenn der Bildschirm berührt wird
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
  } else if (event.type === "touchmove") {
      // Berührungsposition aktualisieren, wenn der Finger bewegt wird
      const touchX = event.touches[0].clientX;
      const touchY = event.touches[0].clientY;
      
      // Berechnung der horizontalen und vertikalen Verschiebung
      const deltaX = touchX - touchStartX;
      const deltaY = touchY - touchStartY;
      
      // Überprüfen, ob die horizontale Verschiebung größer ist als die vertikale Verschiebung
      // Ändere die Richtung entsprechend
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0 && direction !== "left") {
              direction = "right";
          } else if (deltaX < 0 && direction !== "right") {
              direction = "left";
          }
      } else {
          // Überprüfen, ob die vertikale Verschiebung größer ist als die horizontale Verschiebung
          // Ändere die Richtung entsprechend
          if (deltaY > 0 && direction !== "up") {
              direction = "down";
          } else if (deltaY < 0 && direction !== "down") {
              direction = "up";
          }
      }
  }
}

// Touch-Events hinzufügen
window.addEventListener("touchstart", changeDirection);
window.addEventListener("touchmove", changeDirection);









function checkCollision() {
  const head = snake[0];
  if (
    head.x < 1 ||
    head.x > gridSize ||
    head.y < 1 ||
    head.y > gridSize ||
    snake
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameInterval);
    gameAudio.pause(); // Halte den Sound an, wenn das Spiel endet
    gameOverAudio.play(); // Spiele den "Game Over" Sound ab

    alert(`Nicht schlecht! Du hast ${score} Punkte erreicht! `);
    if (score > highscore) {
      highscore = score;
    }
    snake = [{ x: 5, y: 5 }]; // Zurücksetzen der Schlange auf die Startposition
    direction = "right";
    score = 0;
    gameRunning = false;
    startButton.disabled = false; // Aktivieren des Startbuttons
  }
}

function gameLoop() {
  move();
  checkCollision();
  draw();
}

startButton.addEventListener("click", () => {
  if (!gameRunning && collisionOccurred) {
    collisionOccurred = false; // Setze die Kollisionsvariable zurück, wenn das Spiel neu gestartet wird
  }

  if (!gameRunning) {
    startButton.disabled = true;
    gameInterval = setInterval(gameLoop, 100);
    gameRunning = true;
  }
});



document.addEventListener("keydown", changeDirection);
