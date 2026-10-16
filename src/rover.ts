export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
let x = 2;
let y = 2;
let direction = 0;
const queue: Command[] = [];
interface Command {
  name: string;
  execute(): void;
}
type directionsType = { name: string; dx: number; dy: number };
const directions: directionsType[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];
class moveCommand implements Command {
  name = "move";
  execute() {
    const commandDirection = directions[direction];
    x = Math.max(0, Math.min(4, x + commandDirection.dx));
    y = Math.max(0, Math.min(4, y + commandDirection.dy));
  }
}
class turnRight implements Command {
  name = "right";
  execute() {
    direction = (direction + 1) % directions.length;
  }
}
const _invoker = {
  run(cmd: Command) {
    cmd.execute();
    drawRover();
  },
};
function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].name
  }`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  queue.push(new moveCommand());
  renderQueue();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  queue.push(new turnRight());
  renderQueue();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  queue.length = 0;
  renderQueue();
  drawRover();
};
document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = () => {
  while (queue.length > 0) {
    queue.shift()!.execute();
  }
  renderQueue();
  drawRover();
};
document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = () => {
  queue.length = 0;
  renderQueue();
};
drawRover();
function renderQueue() {
  document.querySelector<HTMLButtonElement>("#rover-clear")!.disabled = false;
  document.querySelector<HTMLButtonElement>("#rover-run")!.disabled = false;

  const ul = document.querySelector<HTMLUListElement>("#rover-pending")!;
  while (ul.firstChild !== null) {
    ul.removeChild(ul.firstChild);
  }
  for (let i = 0; i < queue.length; i++) {
    const cmd = queue[i];
    const li = document.createElement("li");
    li.textContent = cmd.name;
    ul.appendChild(li);
  }
}
