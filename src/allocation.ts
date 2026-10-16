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
type row = {
  title: string;
  value: number;
  color: string;
};
function shift(producers: number): shiftResults {
  const production = producers * 3;
  const consumption = 6;
  const balance = production - consumption;
  return { producers, production, consumption, balance };
}
function update() {
  const results = shift(producers);
  renderUI(results);
  renderReadout(results);
}
function renderReadout(results: shiftResults) {
  readout.textContent =
    `Assigned: ${results.producers}/6 · Production: ${results.production} · Consumption: ${results.consumption} · Balance: ${
      results.balance > 0 ? "+" : ""
    }${results.balance}`;
}
function createRows(results: shiftResults) {
  return [{
    title: "production",
    value: results.production,
    color: "#27766b",
  }, {
    title: "Consumption",
    value: results.consumption,
    color: "#a44d23",
  }];
}
function renderRows(rows: row[]) {
  for (let i = 0; i < rows.length; i++) {
    const singleRow = rows[i];
    const labelY = 102 + i * 52;
    const barY = 110 + i * 52;
    ctx.fillStyle = "#233e43";
    ctx.font = "14px system-ui";
    ctx.fillText(`${singleRow.title}: ${singleRow.value}`, 18, labelY);
    ctx.fillStyle = singleRow.color;
    ctx.fillRect(18, barY, singleRow.value * 14, 20);
  }
}
function renderUI(results: shiftResults) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderBoxes(results);
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${results.producers} / 6`, 18, 76);
  renderRows(createRows(results));
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
