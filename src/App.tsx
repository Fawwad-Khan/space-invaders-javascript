import { useEffect, useState } from "react";
import "./App.css";

const canvasheight = 800;
const canvasWidth = 720;

const shipHeight = 70;
const shipWidth = 60;

let shipPosition = 0;
let fireY = 0;
let fireX = shipPosition + 30;
const fireSpeed = 4;
let level = 1;
let initiated = false;
let enemiesMatrix: {
  [key: string]: boolean;
} = {};
let enemiesInitialOffset = 0;
function App() {
  const resetGame = () => {
    shipPosition = 0;
    fireY = 0;
    fireX = shipPosition + 30;

    level = 10;
    enemiesMatrix = {};
    setScore(0);
  };

  const [score, setScore] = useState(0);
  const drawCanvas = () => {
    if (fireY > canvasheight) {
      fireY = shipHeight / 2 - 20;
      fireX = shipPosition + 30;
    } else {
      fireY += fireSpeed * level;
    }

    for (const key of Object.keys(enemiesMatrix)) {
      const coords = key.split("/");
      if (+coords[1] + enemiesInitialOffset + 70 > canvasheight - shipHeight) {
        alert("Game lost ");
        resetGame();
        return;
      }
      if (enemiesMatrix[key] !== false) {
        if (
          canvasWidth - fireY < +coords[1] + enemiesInitialOffset + 70 &&
          canvasWidth - fireY > +coords[1] + enemiesInitialOffset &&
          fireX >= +coords[0] &&
          fireX <= +coords[0] + 60
        ) {
          enemiesMatrix[key] = false;
          delete enemiesMatrix[key];
          setScore((prev) => (prev += 10));
          fireX = shipPosition;
          fireY = shipHeight / 2 - 20;
        }
      }
    }

    const canvas: HTMLCanvasElement = document.getElementById(
      "gameContainer"
    ) as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas!.getContext("2d")!;

    // Drawing the ship
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.strokeRect(
      shipPosition,
      canvasheight - shipHeight,
      shipWidth,
      shipHeight
    );

    // Drawing the ship Firing
    ctx.moveTo(fireX, canvasWidth - fireY);
    ctx.lineTo(fireX, canvasWidth - (fireY - 30));
    ctx.lineWidth = 2;
    ctx.stroke();

    // Drawing Enemies

    ctx.strokeStyle = "white";

    if (Object.keys(enemiesMatrix).length === 0) {
      if (!initiated) {
        initiated = true;
      } else {
        level += 1;
        enemiesInitialOffset = 0;
      }

      for (let i = 0; i < 9; i++) {
        if (i % 2 === 0) {
          enemiesMatrix[`${shipWidth * i + 90}/${40}`] = true;
          ctx.strokeRect(shipWidth * i + 90, 40, shipWidth, shipHeight);
        } else {
          enemiesMatrix[`${shipWidth * i + 90}/${shipHeight + 60}`] = true;
          ctx.strokeRect(
            shipWidth * i + 90,
            shipHeight + 60,
            shipWidth,
            shipHeight
          );
        }
      }
    } else {
      for (const key of Object.keys(enemiesMatrix)) {
        if (enemiesMatrix[key]) {
          const coords = key.split("/");
          ctx.strokeRect(
            +coords[0]!,
            +coords[1] + enemiesInitialOffset,
            shipWidth,
            shipHeight
          );
        }
      }
    }

    enemiesInitialOffset += 0.1 * level;
  };

  useEffect(() => {
    window.addEventListener("keypress", (e) => {
      switch (e.code) {
        case "KeyA":
          if (shipPosition !== 0) {
            shipPosition -= 10;
          }
          break;
        case "KeyD":
          if (shipPosition !== canvasWidth - shipWidth) {
            shipPosition += 10;
          }
          break;
        default:
          break;
      }
    });

    const redrawInterval = setInterval(() => {
      drawCanvas();
    }, 17);
    return () => {
      window.clearInterval(redrawInterval);
      window.removeEventListener("keypress", (e) => {
        switch (e.code) {
          case "keyA":
            if (shipPosition !== 0) {
              shipPosition -= 10;
            }
            break;
          case "keyD":
            if (shipPosition !== canvasWidth - shipWidth) {
              shipPosition += 10;
            }
            break;
          default:
            break;
        }
      });
    };
  }, []);

  return (
    <>
      <p style={{ color: "white" }}> Score: {score}</p>
      <canvas
        id="gameContainer"
        width={canvasWidth}
        height={canvasheight}
        style={{ border: "solid white" }}
      ></canvas>
    </>
  );
}

export default App;
