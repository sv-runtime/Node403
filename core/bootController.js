// ./core/bootController.js
import { bindUIEvents } from "../ui/dom.js";

export function createBootController(deps) {

  const {
    dom,
    GROUP_WEIGHTS,
    preloadAllIdentities,
    createUserGenerator,
    randFloat,
    STATES,
    setState,
    renderState,
    getAllIdentities,
    setUserGen,
    setGetRandomUserByGroupRef,
    startExperience
  } = deps;

  let menuListenerActive = false;

    let liveMode = false;
    let liveInterval = null;

const playlist = [
  {
    title: "Everything Is Dead - Ambient",
    file: "assets/audio/everything_is_dead-ambient-ambient-music-493695.mp3"
  },
  {
    title: "Blues Ballad - Alec Koff",
    file: "assets/audio/alec_koff-blues-ballad-487408.mp3"
  },
  {
    title: "Bransboynd - Retro Lounge",
    file: "assets/audio/bransboynd-retro-lounge-389644.mp3"
  }, 
  {
    title: "Coma Media - Glossy",
    file: "assets/audio/coma-media-glossy-168156.mp3"
  }, 
  {
    title: "Soul Prod Music - Nightfall",
    file: "assets/audio/soulprodmusic-nightfall-future-bass-music-228100.mp3"
  }
];

  let currentTrack = 0;
  let audioPlayer = null;
  let musicMode = false;

    let calculatorMode = false;
    let calcInput = "";

    let sudokuMode = false;
    let sudokuGrid = [];
    let sudokuSolution = [];
    let sudokuRow = 0;
    let sudokuCol = 0;

    let timerMode = false;
    let timerInterval = null;
    let startTime = 0;
    let elapsed = 0;
    let timerRunning = false;
    let laps = [];

  function showMenu() {

  setState(STATES.MENU);  

    clearInterval(timerInterval);
    timerInterval = null;
    timerRunning = false;
    timerMode = false;

    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer = null;
    }

    musicMode = false;

  if (dom?.introScreen) dom.introScreen.style.display = "none";
  if (dom?.backBtn) dom.backBtn.style.display = "none";

  if (dom?.terminalElement) {
    dom.terminalElement.classList.add("open");
  }

    const terminalOutput = document.getElementById("terminalOutput");
    const terminalTitle  = document.getElementById("terminalTitle");

    if (terminalTitle) terminalTitle.textContent = "NODE403 TERMINAL";

    if (terminalOutput) {
    terminalOutput.innerHTML = `
    <pre>
    NODE403 MAIN MENU

    1) Simulation
    2) Live view real traffic
    3) Music player
    4) Calculator
    5) Timer / Stopwatch
    6) What is my IP?
    7) Sudoku
    8) Contact

    Press 1-8 to choose
    > █
    </pre>

    <input id="mobileInput" type="text" inputmode="numeric"
    style="position:absolute;opacity:0;height:1px;width:1px;">
    `;
   
     const mobileInput = document.getElementById("mobileInput");

    if (mobileInput) {
      mobileInput.focus();
    }

    }

    startMenuKeyboard();
  }

function openLiveView() {

  const terminalOutput = document.getElementById("terminalOutput");
  if (!terminalOutput) return;

  liveMode = true;

  terminalOutput.innerHTML = `
<pre>
NODE403 LIVE NETWORK

Connecting to traffic feed...

Press M to return
</pre>
`;

  startLiveFeed();
}

function startLiveFeed() {

  clearInterval(liveInterval);

  liveInterval = setInterval(async () => {

    try {

      const res = await fetch("/api/live.php",{cache:"no-store"});
      const rows = await res.json();

      const terminalOutput = document.getElementById("terminalOutput");
      if(!terminalOutput) return;

      let out = "NODE403 LIVE NETWORK\n\n";
      out += "TIME   COUNTRY         PATH\n";
      out += "------------------------------------------\n";

      rows.slice(-10).forEach(r => {

        const date = new Date(r.time);
        const h = String(date.getHours()).padStart(2,"0");
        const m = String(date.getMinutes()).padStart(2,"0");

        const time = `${h}:${m}`;

        const country = r.geo?.country || "-";
        const path = r.request?.path || "-";
        const bot = r.client?.bot ? "bot" : "human";

        out += `${time.padEnd(6)} ${country.padEnd(15)} ${path.padEnd(22)} ${bot}\n`;

      });

      out += "\nPress M to return";

      terminalOutput.innerHTML = `<pre>${out}</pre>`;

    } catch(err) {

      console.error(err);

    }

  },1500);

}

function openMusicPlayer() {

  const terminalOutput = document.getElementById("terminalOutput");
  if (!terminalOutput) return;

  musicMode = true;

  terminalOutput.innerHTML = `
<pre>
NODE403 MUSIC PLAYER

Now playing:
${playlist[currentTrack].title}

N = Next track
B = Previous track
M = Menu

</pre>

<audio id="nodeMusic" controls autoplay style="width:100%"></audio>

<div id="mobileMusicControls" style="
margin-top:20px;
display:flex;
gap:10px;
justify-content:center;
">
<button id="prevTrack">◀</button>
<button id="nextTrack">▶</button>
<button id="exitMusic">MENU</button>
</div>
`;

  audioPlayer = document.getElementById("nodeMusic");
  if (audioPlayer) {
    audioPlayer.src = playlist[currentTrack].file;
  }

  // mobiele knoppen
  const nextBtn = document.getElementById("nextTrack");
  const prevBtn = document.getElementById("prevTrack");
  const exitBtn = document.getElementById("exitMusic");

  if (nextBtn) nextBtn.onclick = nextTrack;
  if (prevBtn) prevBtn.onclick = previousTrack;
  if (exitBtn) exitBtn.onclick = () => {
    if (audioPlayer) audioPlayer.pause();
    audioPlayer = null;
    musicMode = false;
    showMenu();
  };
}

function nextTrack() {

  if (!audioPlayer) return;

  currentTrack++;
  if (currentTrack >= playlist.length) currentTrack = 0;

  openMusicPlayer();
}

function previousTrack() {

  if (!audioPlayer) return;

  currentTrack--;
  if (currentTrack < 0) currentTrack = playlist.length - 1;

  openMusicPlayer();
}

function openCalculator() {

  const terminalOutput = document.getElementById("terminalOutput");
  if (!terminalOutput) return;

  calculatorMode = true;
  calcInput = "";

  terminalOutput.innerHTML = `
<div style="max-width:320px;margin:auto;text-align:center">

<div id="calcDisplay" style="
background:#000;
color:#0f0;
padding:15px;
font-family:monospace;
font-size:24px;
margin-bottom:10px;
border:1px solid #333;
">
0
</div>

<div id="calcKeys" style="
display:grid;
grid-template-columns:repeat(4,1fr);
gap:8px;
">

<button data-k="7">7</button>
<button data-k="8">8</button>
<button data-k="9">9</button>
<button data-k="/">÷</button>

<button data-k="4">4</button>
<button data-k="5">5</button>
<button data-k="6">6</button>
<button data-k="*">×</button>

<button data-k="1">1</button>
<button data-k="2">2</button>
<button data-k="3">3</button>
<button data-k="-">−</button>

<button data-k="0">0</button>
<button data-k=".">.</button>
<button id="calcEq">=</button>
<button data-k="+">+</button>

<button id="calcClear" style="grid-column:span 2">C</button>
<button id="calcMenu" style="grid-column:span 2">MENU</button>

</div>
</div>
`;

  const display = document.getElementById("calcDisplay");

  document.querySelectorAll("#calcKeys button[data-k]").forEach(btn=>{
    btn.onclick = () => {
      calcInput += btn.dataset.k;
      display.textContent = calcInput;
    };
  });

  document.getElementById("calcEq").onclick = () => {

    try {
      const result = eval(calcInput);
      calcInput = result.toString();
      display.textContent = calcInput;
    } catch {
      display.textContent = "error";
      calcInput = "";
    }

  };

  document.getElementById("calcClear").onclick = () => {
    calcInput = "";
    display.textContent = "0";
  };

  document.getElementById("calcMenu").onclick = () => {
    calculatorMode = false;
    showMenu();
  };

}

function openTimer() {

  const terminalOutput = document.getElementById("terminalOutput");
  if (!terminalOutput) return;

  timerMode = true;
  elapsed = 0;
  startTime = 0;
  laps = [];
  timerRunning = false;

  terminalOutput.innerHTML = `
<pre>
NODE403 STOPWATCH

00:00.00

SPACE = start/stop
L = lap
R = reset
M = menu

</pre>
`;
}

function openSudoku() {

  sudokuMode = true;

  sudokuRow = 0;
  sudokuCol = 0;

  generateSudoku();

  renderSudoku();
}

function renderSudoku() {

  const terminalOutput = document.getElementById("terminalOutput");

  const line = "+---------+---------+---------+";

  let grid = [];
  grid.push(line);

  for (let r = 0; r < 9; r++) {

    let row = "|";

    for (let c = 0; c < 9; c++) {

      let v = sudokuGrid[r][c] || ".";

      if (r === sudokuRow && c === sudokuCol)
        row += "[" + v + "]";
      else
        row += " " + v + " ";

      if ((c + 1) % 3 === 0) row += "|";
    }

    grid.push(row);

    if ((r + 1) % 3 === 0)
      grid.push(line);
  }

  const help = [
    "",
    "ARROWS  move",
    "1-9     number",
    "0       clear",
    "N       new puzzle",
    "M       menu"
  ];

  let out = "NODE403 SUDOKU\n\n";

  const maxLines = Math.max(grid.length, help.length);

  for (let i = 0; i < maxLines; i++) {

    const left  = grid[i] || "";
    const right = help[i] || "";

    out += left.padEnd(28," ") + "   " + right + "\n";
  }

  terminalOutput.innerHTML = `<pre>${out}</pre>`;
}

function renderTimer(time) {

  const terminalOutput = document.getElementById("terminalOutput");

  const lapText = laps.map((l,i)=>`Lap ${i+1}: ${l}`).join("\n");

  terminalOutput.innerHTML = `
<pre>
NODE403 STOPWATCH

${time}

SPACE = start/stop
L = lap
R = reset
M = menu

${lapText}

</pre>
`;
}

function generateSudoku() {

  sudokuSolution = generateSolvedGrid();

  sudokuGrid = sudokuSolution.map(r => [...r]);

  let holes = 45; // difficulty

  while (holes > 0) {

    let r = Math.floor(Math.random()*9);
    let c = Math.floor(Math.random()*9);

    if (sudokuGrid[r][c] !== 0) {
      sudokuGrid[r][c] = 0;
      holes--;
    }
  }
}

function generateSolvedGrid() {

  let grid = Array.from({length:9}, () => Array(9).fill(0));

  function valid(r,c,n) {

    for(let i=0;i<9;i++)
      if(grid[r][i]===n || grid[i][c]===n)
        return false;

    let br = Math.floor(r/3)*3;
    let bc = Math.floor(c/3)*3;

    for(let i=0;i<3;i++)
      for(let j=0;j<3;j++)
        if(grid[br+i][bc+j]===n)
          return false;

    return true;
  }

  function fill() {

    for(let r=0;r<9;r++)
      for(let c=0;c<9;c++)
        if(grid[r][c]===0){

          let nums=[1,2,3,4,5,6,7,8,9]
            .sort(()=>Math.random()-0.5);

          for(let n of nums){

            if(valid(r,c,n)){

              grid[r][c]=n;

              if(fill()) return true;

              grid[r][c]=0;

            }
          }

          return false;
        }

    return true;
  }

  fill();
  return grid;
}

function startMenuKeyboard() {

  if (menuListenerActive) return;
  menuListenerActive = true;

  document.addEventListener("keydown", async (e) => {

    const key = e.key.toLowerCase();

    if (liveMode) {

      if (key === "m") {

        clearInterval(liveInterval);
        liveInterval = null;
        liveMode = false;

        showMenu();
      }

      return;
    }

if (timerMode) {

  if (key === "m") {
    clearInterval(timerInterval);
    timerInterval = null;
    timerRunning = false;
    timerMode = false;
    showMenu();
    return;
  }

  if (e.code === "Space") {

  e.preventDefault();

    if (!timerRunning) {

      timerRunning = true;
      startTime = Date.now() - elapsed;

      timerInterval = setInterval(() => {

        elapsed = Date.now() - startTime;

        const ms = Math.floor((elapsed % 1000) / 10);
        const sec = Math.floor(elapsed / 1000) % 60;
        const min = Math.floor(elapsed / 60000);

        const m = String(min).padStart(2,"0");
        const s = String(sec).padStart(2,"0");
        const milli = String(ms).padStart(2,"0");

        renderTimer(`${m}:${s}.${milli}`);

      },10);

    } else {

      clearInterval(timerInterval);
      timerInterval = null;
      timerRunning = false;

    }

    return;
  }

  if (key === "l") {

    const ms = Math.floor((elapsed % 1000) / 10);
    const sec = Math.floor(elapsed / 1000) % 60;
    const min = Math.floor(elapsed / 60000);

    const m = String(min).padStart(2,"0");
    const s = String(sec).padStart(2,"0");
    const milli = String(ms).padStart(2,"0");

    laps.push(`${m}:${s}.${milli}`);

    renderTimer(`${m}:${s}.${milli}`);

    return;
  }

  if (key === "r") {

    clearInterval(timerInterval);
    timerInterval = null;

    elapsed = 0;
    timerRunning = false;
    laps = [];

    renderTimer("00:00.00");

    return;
  }

  return;
}

if (sudokuMode) {

      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }

  if (key==="m"){
    sudokuMode=false;
    showMenu();
    return;
  }

const terminalOutput = document.getElementById("terminalOutput");

  if(key==="n"){
    generateSudoku();
    renderSudoku();
    terminalOutput.onclick = (e) => {

  const rect = terminalOutput.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const col = Math.floor(x / (rect.width / 9));
  const row = Math.floor((y-40) / ((rect.height-80) / 9));

  if(row>=0 && row<9 && col>=0 && col<9){
    sudokuRow = row;
    sudokuCol = col;
    renderSudoku();
  }

};

    return;
  }

  if(e.key==="ArrowUp") sudokuRow=Math.max(0,sudokuRow-1);
  if(e.key==="ArrowDown") sudokuRow=Math.min(8,sudokuRow+1);
  if(e.key==="ArrowLeft") sudokuCol=Math.max(0,sudokuCol-1);
  if(e.key==="ArrowRight") sudokuCol=Math.min(8,sudokuCol+1);

  if(/^[1-9]$/.test(key))
    sudokuGrid[sudokuRow][sudokuCol]=Number(key);

  if(key==="0")
    sudokuGrid[sudokuRow][sudokuCol]=0;

  renderSudoku();

  return;
}

if (calculatorMode) {

  if (key === "m") {
    calculatorMode = false;
    showMenu();
    return;
  }

if (key === "enter") {

  let result = "error";

  try {
    result = eval(calcInput);
  } catch {}

  const terminalOutput = document.getElementById("terminalOutput");

  terminalOutput.innerHTML += `
${calcInput} = ${result}
> █
`;

  calcInput = "";
  return;
}

  if (/^[0-9+\-*/().]$/.test(key)) {

    calcInput += key;

    const terminalOutput = document.getElementById("terminalOutput");

    terminalOutput.innerHTML = `
<pre>
NODE403 CALCULATOR

Type expression and press Enter

${calcInput}

Press M to return

> █
</pre>
`;

  }

  return;
}

    if (musicMode) {

      if (key === "n") {
        nextTrack();
        return;
      }

      if (key === "b") {
        previousTrack();
        return;
      }

      if (key === "m") {
        if (audioPlayer) audioPlayer.pause();
        audioPlayer = null;
        musicMode = false;
        showMenu();
        return;
      }

      return;
    }

    if (key === "1") {
      await startSimulationFromMenu();
      return;
    }

    if (key === "2") {
      openLiveView();
      return;
    }

    if (key === "3") {
      openMusicPlayer();
      return;
    }

    if (key === "4") {
      openCalculator();
      return;
    }

if (key === "5") {
  openTimer();
  return;
}

if (key === "6") {
  openIPLookup();
  return;
}

    if (key === "7") {
      openSudoku();
      return;
    }

    if (key === "8") {

      const terminalOutput = document.getElementById("terminalOutput");

      if (terminalOutput) {
        terminalOutput.innerHTML = `
<pre>
NODE403 CONTACT

webmaster@node403.com

Press M to return
</pre>`;
      }

      return;
    }

    if (key === "m") {
      showMenu();
    }

  });

}

  async function startSimulationFromMenu() {

    if (dom?.menuScreen) dom.menuScreen.style.display = "none";

    await ensureIdentitiesLoaded();
    await ensureUserGeneratorReady();

    if (dom?.backBtn) dom.backBtn.style.display = "block";

    if (dom?.terminalElement) {
      dom.terminalElement.classList.remove("open");
    }
    
    await startExperience();
  }

  function goToLiveView() {
    window.location.href = "live.php";
  }

async function openIPLookup() {

  const terminalOutput = document.getElementById("terminalOutput");
  if (!terminalOutput) return;

  terminalOutput.innerHTML = `
<pre>
NODE403 IP LOOKUP

Resolving IP...

Press M to return
</pre>
`;

  try {

    const res = await fetch("/api/ip.php",{cache:"no-store"});
    const data = await res.json();

    const ip = data.ip || "-";
    const city = data.city || "";
    const country = data.country || "";

    terminalOutput.innerHTML = `
<pre>
NODE403 IP LOOKUP

Your IP:
${ip}

${city || country ? `Location:
${city}${city && country ? ", " : ""}${country}

` : ""}Press M to return
</pre>
`;

  } catch (err) {

    terminalOutput.innerHTML = `
<pre>
NODE403 IP LOOKUP

Error resolving IP

Press M to return
</pre>
`;

  }
}

  async function ensureIdentitiesLoaded() {

    renderState.loadingActive = true;
    renderState.loadingProgress = 0;

    setState(STATES.LOADING);
    if (dom?.terminalElement) {
    dom.terminalElement.classList.remove("open");
    }

    if (dom?.introScreen) dom.introScreen.style.display = "none";

    const alreadyLoaded = getAllIdentities();

    if (alreadyLoaded) {
      for (let i = 0; i <= 100; i += 10) {
        renderState.loadingProgress = i;
        await new Promise(r => setTimeout(r, 30));
      }
      renderState.loadingActive = false;
      return;
    }

    const groups = Object.keys(GROUP_WEIGHTS);

    const identities = await preloadAllIdentities({
      groups,
      basePath: "./data",
      cache: "no-store",
      onProgress: (p) => {
        renderState.loadingProgress = p;
      }
    });

    setAllIdentities(identities);

    renderState.loadingProgress = 100;
    renderState.loadingActive = false;
  }

  async function ensureUserGeneratorReady() {

    if (getUserGen()) return;

    const gen = createUserGenerator(
      getAllIdentities(),
      { randFloat }
    );

    setUserGen(gen);
    setGetRandomUserByGroupRef(gen.getRandomUserByGroup);
  }

  function bind() {

    bindUIEvents(dom, {

      onBack: async () => {

      setState(STATES.MENU);
      showMenu();

    },
      onEnter: async () => showMenu(),

      onMenuOption1: async () => await startSimulationFromMenu(),
      onMenuOption2: async () => goToLiveView(),
      onMenuOption3: async () => openMusicPlayer(),
        onMenuOption4: async () => openCalculator(),
        onMenuOption5: async () => openTimer(),
        onMenuOption6: async () => openIPLookup(),
        onMenuOption7: async () => openSudoku(),
        onMenuOption8: async () => showMenu()

    });
  }

  return { bind };
}
