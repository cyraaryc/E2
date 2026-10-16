export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let producers = 2;
type shiftResults = {
  producers: number;
  production: number;
  consumption: number;
  balance: number;
};
function shift(producers: number): shiftResults {
  const production = producers * 3;
  const consumption = 6;
  const balance = production - consumption;
  return { producers, production, consumption, balance };
}
function update() {
  const results = shift(producers);
  renderBoxes(results);
  renderUI(results);
  renderReadout(results);
}
function renderReadout(results: shiftResults) {
  readout.textContent =
    `Assigned: ${results.producers}/6 · Production: ${results.production} · Consumption: ${results.consumption} · Balance: ${
      results.balance > 0 ? "+" : ""
    }${results.balance}`;
}
function renderUI(results: shiftResults) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${results.producers} / 6`, 18, 76);
  ctx.fillText(`Production: ${results.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, results.production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${results.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, results.consumption * 14, 20);
}
function renderBoxes(results: shiftResults) {
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < results.producers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < results.producers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  producers = Math.max(0, producers - 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  producers = Math.min(6, producers + 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    producers = 2;
    update();
  };
update();
