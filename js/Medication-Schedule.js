let meds = [];
const player = document.getElementById("player");

function addMedicine() {
  const name = document.getElementById("medName").value;
  const time = document.getElementById("medTime").value;
  const date = document.getElementById("medDate").value;
  const sound = document.getElementById("sound").value;

  if (!name || !time || !date) {
    alert("Please complete all fields");
    return;
  }

  meds.push({ name, time, date, sound, taken: null });
  renderList();
  countToday();
}

function renderList() {
  const c = document.getElementById("medList");
  c.innerHTML = "";

  meds.forEach((m, i) => {
    c.innerHTML += `
      <div class="list-item">
        💊 ${m.name} — ${m.time} — ${m.date}<br><br>
        <button class="btn-schedule" onclick="markTaken(${i}, true)">Taken</button>
        <button class="btn-schedule" onclick="markTaken(${i}, false)">Not taken</button>
      </div>
    `;
  });
}

function markTaken(i, v) {
  meds[i].taken = v;
  renderList();
}

function countToday() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("countToday").innerText =
    meds.filter(m => m.date === today).length;
}

function checkByDate() {
  const d = document.getElementById("checkDate").value;
  const c = document.getElementById("checkResult");
  c.innerHTML = "";

  meds.filter(m => m.date === d).forEach(m => {
    c.innerHTML += `
      <div class="list-item">
        💊 ${m.name} — ${m.time}<br>
        Status: ${m.taken === true ? "Taken" :
        m.taken === false ? "Not taken" : "Not specified"}
      </div>
    `;
  });
}

document.getElementById("sound").addEventListener("change", function () {
  if (!this.value) return;
  player.src = this.value;
  player.play();
});
