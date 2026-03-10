// ./core/bootController.js
import { bindUIEvents } from "../ui/dom.js";
import { applyUILanguage } from "../ui/i18n.js";

let uiMode = "terminal";

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
 setAllIdentities,
 getUserGen,
 setUserGen,
 setGetRandomUserByGroupRef,
 startExperience,
 UI_TEXT,
 getNetworkGroup
} = deps;

window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    window.location.reload();
  }
});

  let menuListenerActive = false;

function startTerminalStatusbar(){

 const el = document.getElementById("terminalClock");
 if(!el) return;

 function update(){

  const now = new Date();

  const date = now.toISOString().slice(0,10);
  const time = now.toLocaleTimeString("en-GB");

  el.textContent = `${date} | ${time}`;

 }

 update();
 setInterval(update,1000);
}

    let liveMode = false;
    let liveInterval = null;

let playlist = [];

  let currentTrack = 0;
  let audioPlayer = null;
  let musicMode = false;
    let trackNumberBuffer = "";

function ensureAudioPlayer(){
 if(!audioPlayer){
  audioPlayer = new Audio();
  window.node403AudioPlayer = audioPlayer;
  audioPlayer.volume = 0.8;

  audioPlayer.onended = () => {
   nextTrack();
   renderMiniPlayer();
   if(musicMode){
    renderMusicScreen();
    renderPlaylist();
    renderMiniPlayer();
   }
  };

  audioPlayer.ontimeupdate = () => {
   renderMiniPlayer();
   if(musicMode){
    renderMusicScreen();
   }
  };
 }
}

async function ensurePlaylistLoaded(){

 if(playlist.length) return;

 try{

  const res = await fetch("/api/playlist.php",{cache:"no-store"});
  playlist = await res.json();

  shufflePlaylist(playlist);

  currentTrack = Math.floor(Math.random() * playlist.length);

 }catch(e){
  console.error("Playlist load failed", e);
 }

 if(!playlist.length) return;

 ensureAudioPlayer();

 audioPlayer.src = playlist[currentTrack].file;

}

function renderMiniPlayer(){

 const track = document.getElementById("miniTrack");
 const playBtn = document.getElementById("miniPlayPause");

 if(!track || !playlist.length) return;

 const title = playlist[currentTrack]?.title || "-";

 track.textContent = `track: ${title}`;

 if(playBtn){
  playBtn.textContent = audioPlayer && !audioPlayer.paused ? "PAUSE" : "PLAY";
 }

}

async function toggleMiniPlayer(){
 await ensurePlaylistLoaded();
 ensureAudioPlayer();

 if(!playlist.length) return;

 if(!audioPlayer.src && playlist[currentTrack]){
  audioPlayer.src = playlist[currentTrack].file;
 }

 if(audioPlayer.paused){
  await audioPlayer.play();
 }else{
  audioPlayer.pause();
 }

 renderMiniPlayer();

 if(musicMode){
  renderMusicScreen();
  renderPlaylist();
 }
}

function stopMenuAudio(){
 if(!audioPlayer) return;
 audioPlayer.pause();
 audioPlayer.currentTime = 0;
}

    let calculatorMode = false;
    let calcInput = "";

    let sudokuMode = false;
    let sudokuGrid = [];
    let sudokuSolution = [];
    let sudokuRow = 0;
    let sudokuCol = 0;

    let passwordMode = false;
    let currentPassword = "";
    let passwordLength = 16;

    let uuidMode = false;
    let uuidCount = "";
    let generatedUUIDs = [];

    let chatMode = false;
    let chatUsernameMode = false;
    let chatUsername = "";
    let chatInput = "";
    let chatMessages = [];
    let chatUsers = [];
    let chatPollInterval = null;
    let chatMessageLimit = 12;
    let chatToken = "";

    let activeTimeouts = [];

    let stopSequence = false;

    let simulationActive = false;

function schedule(fn, delay){
  const id = setTimeout(fn, delay);
  activeTimeouts.push(id);
  return id;
}

function resetSimulation(){

  renderState.loadingActive = false;

  if(renderState.animationFrame){
    cancelAnimationFrame(renderState.animationFrame);
    renderState.animationFrame = null;
  }

  clearInterval(liveInterval);
  liveInterval = null;

  activeTimeouts.forEach(clearTimeout);
  activeTimeouts = [];

  setState(-90);

}

function getUIText(key){

  if(uiMode === "terminal"){

    const en = {
      enter: "ENTER",
      back: "REBOOT",
      fullscreen: "FULLSCREEN"
    };

    return en[key];
  }

  if(window.UI_TEXT && window.currentCountry){
    return window.UI_TEXT[window.currentCountry]?.[key];
  }

  return "";
}

function showMenu() {

    startTerminalStatusbar();
    simulationActive = false;

    stopChatPolling();
    chatMode = false;
    chatUsernameMode = false;
    chatInput = "";
    chatMessages = [];
    chatUsers = [];

 const clock = document.getElementById("terminalClock");
 if (clock) clock.style.display = "block";

 const player = document.getElementById("menuAudioConsole");
 if (player) player.style.display = "block";

 const fsBtn = document.getElementById("fullscreenPageBtn");
 if(fsBtn) fsBtn.style.display = "none";

applyUILanguage(getNetworkGroup(), UI_TEXT, "terminal");
  setState(STATES.MENU);  

    musicMode = false;
    trackNumberBuffer = "";

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
     
NETWORK
1) Real-time server traffic (anonymised)
2) IP / ASN Lookup

TOOLS
3) Hash Generator
4) UUID Generator
5) Calculator
6) Music player
7) Sudoku

CONTACT
8) Contact
9) Public Chat

Press 0 to run the 403 Experience

Press 0-9 to choose
> █
</pre>

<div id="menuAudioConsole" style="
margin-top:14px;
border-top:1px solid rgba(255,255,255,0.08);
padding-top:12px;
"></div>

<input id="mobileInput"
type="text"
inputmode="numeric"
autocomplete="off"
autocorrect="off"
autocapitalize="off"
spellcheck="false"
style="
position:absolute;
opacity:0;
height:1px;
width:1px;
left:-9999px;
">`;
   
     const mobileInput = document.getElementById("mobileInput");

if (mobileInput) {

  mobileInput.focus();

  /* mobiel keyboard input */

  mobileInput.addEventListener("input",(e)=>{

    const value = e.target.value;

    if(!value) return;

    const char = value.slice(-1);

    document.dispatchEvent(
      new KeyboardEvent("keydown",{key:char})
    );

    e.target.value = "";

  });

  mobileInput.addEventListener("keydown",(e)=>{

    if(e.key === "Enter"){

      document.dispatchEvent(
        new KeyboardEvent("keydown",{key:"enter"})
      );

    }

  });

}

ensurePlaylistLoaded().then(() => {

 renderMiniPlayer();

 const prevBtn = document.getElementById("miniPrevTrack");
 const playBtn = document.getElementById("miniPlayPause");
 const nextBtn = document.getElementById("miniNextTrack");

 if(prevBtn){
  prevBtn.onclick = () => {
   previousTrack();
   renderMiniPlayer();
  };
 }

 if(playBtn){
  playBtn.onclick = () => {
   toggleMiniPlayer();
  };
 }

 if(nextBtn){
  nextBtn.onclick = () => {
    nextTrack();
    renderMiniPlayer();
  };
 }

});

startMenuKeyboard();   

}  
}

function stopChatPolling(){
  clearInterval(chatPollInterval);
  chatPollInterval = null;
}

function renderChatScreen(){

  const terminalOutput = document.getElementById("terminalOutput");
  if(!terminalOutput) return;

  if(chatUsernameMode){
    terminalOutput.innerHTML = `<pre>
NODE403 PUBLIC CHAT

No permanent logging
Messages expire after 24h or 250 messages
Usernames are temporary and unique while online

Enter username
Allowed: a-z A-Z 0-9 _ -

> ${chatUsername}█

Press ESCAPE to return
</pre>`;
    return;
  }

  let out = "NODE403 PUBLIC CHAT\n\n";
  out += `CONNECTED AS: ${chatUsername || "-"}\n`;
  out += `USERS ONLINE: ${chatUsers.length ? chatUsers.join(", ") : "-"}\n\n`;

  const visible = chatMessages.slice(-chatMessageLimit);

  visible.forEach(row => {
    const time = row.time || "--:--:--";
    const user = row.user || "unknown";
    const msg  = row.msg || "";
    out += `[${time}] ${user}: ${msg}\n`;
  });

  out += `\n> ${chatInput}█\n\n`;
  out += "ENTER = send\n";
  out += "ESC = menu";

  terminalOutput.innerHTML = `<pre>${out}</pre>`;
}

async function fetchChatMessages(){
  try{
    const res = await fetch("/api/chat-read.php", { cache: "no-store" });
    chatMessages = await res.json();
  }catch(err){
    console.error("chat read failed", err);
  }
}

async function heartbeatChatPresence(){

  if(!chatUsername) return;

  try{

    const res = await fetch("/api/chat-presence.php",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        user: chatUsername,
        token: chatToken
      })
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {ok:false};

    if(!data.ok){
      return data;
    }

    chatToken = data.token || "";
    chatUsers = data.users || [];

    return data;

  }catch(err){
    console.error("chat presence failed", err);
    return {ok:false};
  }
}

async function sendChatMessage(){

  const msg = chatInput.trim();
  if(!msg || !chatUsername) return;

  try{
    await fetch("/api/chat-send.php",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: chatUsername,
        msg
      })
    });

    chatInput = "";

    await fetchChatMessages();
    renderChatScreen();

  }catch(err){
    console.error("chat send failed", err);
  }
}

function startChatPolling(){

  stopChatPolling();

  chatPollInterval = setInterval(async () => {
    if(!chatMode) return;

    const res = await heartbeatChatPresence();

    if(!res || res.error === "username_taken"){

      stopChatPolling();

      chatUsername = "";
      chatToken = "";
      chatInput = "";

      chatUsernameMode = true;

      alert("Username already in use");

      renderChatScreen();
      return;
    }
    await fetchChatMessages();
    renderChatScreen();
  }, 1500);
}

async function openChat(){

  chatMode = true;
  chatUsernameMode = true;
  chatUsername = "";
  chatInput = "";
  chatMessages = [];
  chatUsers = [];

  stopChatPolling();
  renderChatScreen();
}

function openLiveView() {

  const terminalOutput = document.getElementById("terminalOutput");
  if (!terminalOutput) return;

  liveMode = true;

  terminalOutput.innerHTML = `
<pre>
NODE403 LIVE NETWORK

Connecting to traffic feed...

Press ESCAPE to return
</pre>
`;

  startLiveFeed();
}

function generateUUIDList(count){

 generatedUUIDs = [];

 for(let i=0;i<count;i++){
  generatedUUIDs.push(crypto.randomUUID());
 }

}

function openUUIDGenerator(){

 const terminalOutput = document.getElementById("terminalOutput");
 if(!terminalOutput) return;

 uuidMode = true;
 uuidCount = "";

 terminalOutput.innerHTML = `
<pre>
NODE403 UUID GENERATOR

Enter number of UUIDs to generate

Maximum: 100

> ${uuidCount}█

Press ESCAPE to return
</pre>
`;

}

function renderUUIDResult(){

 const terminalOutput = document.getElementById("terminalOutput");
 if(!terminalOutput) return;

 let list = generatedUUIDs.join("\n");

 terminalOutput.innerHTML = `
<pre>
NODE403 UUID GENERATOR

Generated ${generatedUUIDs.length} UUIDs

${list}

N = new batch
C = copy all
ESC = menu
</pre>
`;

}

function copyUUIDs(){

 if(!generatedUUIDs.length) return;

 navigator.clipboard.writeText(
  generatedUUIDs.join("\n")
 ).catch(()=>{});

}

function calculateStats(rows){

  const total = rows.length;

  let bots = 0;
  const countries = new Set();

  rows.forEach(r => {

    if(r.client?.bot) bots++;

    if(r.geo?.country){
      countries.add(r.geo.country);
    }

  });

  const humans = total - bots;

  let rpm = 0;

  if(rows.length > 1){
    const first = new Date(rows[0].time);
    const last  = new Date(rows[rows.length-1].time);

    const diffSeconds = (last - first) / 1000;

    if(diffSeconds > 0){
      rpm = Math.round((rows.length / diffSeconds) * 60);
    }
  }

  return {
    total,
    bots,
    humans,
    countries: countries.size,
    rpm
  };

}

function anonymizeIP(ip){

  if(!ip) return "-";

  // IPv6
  if(ip.includes(":")){
    const parts = ip.split(":");
    return parts[0] + ":xxxx:xxxx";
  }

  // IPv4
  const parts = ip.split(".");
  if(parts.length === 4){
    return `${parts[0]}.xx.xx.xx`;
  }

  return ip;
}

function startLiveFeed() {

  clearInterval(liveInterval);

  liveInterval = setInterval(async () => {

    try {

      const res = await fetch("/api/live.php",{cache:"no-store"});
      const rows = await res.json();
        const stats = calculateStats(rows);

      const terminalOutput = document.getElementById("terminalOutput");
      if(!terminalOutput) return;

      let out = "NODE403 LIVE NETWORK\n\n";

        out += `Requests:  ${stats.total}   Humans:    ${stats.humans}   Bots:     ${stats.bots}
Countries: ${stats.countries}
RPM:       ${stats.rpm}

`;

      out += "TIME   COUNTRY        IP           METHOD  PATH                   BOT\n";
      out += "--------------------------------------------------------------------------------\n";

      rows.slice(-10).forEach(r => {

        const date = new Date(r.time);
        const h = String(date.getHours()).padStart(2,"0");
        const m = String(date.getMinutes()).padStart(2,"0");
        const time = `${h}:${m}`;

        const country = r.geo?.country || "-";
        const ip = anonymizeIP(r.ip?.address);
        const method = r.request?.method || "-";
        const path = r.request?.path || "-";

    
        const botLevel = r.client?.bot || 0;
        const bot = botLevel ? `BOT${botLevel}` : "HUMAN";

        out += `${time.padEnd(6)} ${country.padEnd(14)} ${ip.padEnd(12)} ${method.padEnd(7)} ${path.padEnd(22)} ${bot}\n`;

      });

      out += "\nPress ESCAPE to return";

      terminalOutput.innerHTML = `<pre>${out}</pre>`;

    } catch(err) {

      console.error(err);

    }

  },1500);

}

function shufflePlaylist(arr){

  for(let i = arr.length - 1; i > 0; i--){

    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];

  }

}

async function loadPlaylist(){

  try{

    const res = await fetch("/api/playlist.php",{cache:"no-store"});
    playlist = await res.json();

    shufflePlaylist(playlist);

    currentTrack = 0;

  }catch(e){

    console.error("Playlist load failed",e);

  }
if(!playlist.length){
      const terminalOutput = document.getElementById("terminalOutput");
    if(terminalOutput){
      terminalOutput.innerHTML = "<pre>No music found</pre>";
    }
  return;
}
}

async function openMusicPlayer(){

 await ensurePlaylistLoaded();

 const terminalOutput = document.getElementById("terminalOutput");
 if(!terminalOutput) return;

 musicMode = true;

 terminalOutput.innerHTML = `

<div id="musicLayout" style="
display:flex;
gap:10px;
align-items:flex-start;
width:85%;
">

<pre id="musicScreen" style="
flex:1;
min-width:320px;
margin:0;
white-space:pre;
overflow:hidden;
">
NODE403 MUSIC PLAYER

Loading...

N = Next track
B = Previous track
SPACE = Play / Pause
V = Mute
+ / - = Volume
ESC = Menu
</pre>

<pre id="musicPlaylist" style="
flex:0 0 480px;
margin:0;
white-space:pre;
height:300px;
overflow-y:auto;
overflow-x:hidden;
">
PLAYLIST
</pre>

</div>

<div id="mobileMusicControls" style="
margin-top:8px;
display:flex;
gap:10px;
justify-content:center;
flex-wrap:wrap;
">

<button id="prevTrack">◀</button>
<button id="playPause">⏯</button>
<button id="nextTrack">▶</button>
<button id="muteBtn">🔇</button>
<button id="exitMusic">MENU</button>

</div>
`;

 ensureAudioPlayer();

 if(!audioPlayer.src && playlist[currentTrack]){
  audioPlayer.src = playlist[currentTrack].file;
 }

 renderMusicScreen();
 renderPlaylist();
 renderMiniPlayer();

 const nextBtn = document.getElementById("nextTrack");
 const playBtn = document.getElementById("playPause");
 const muteBtn = document.getElementById("muteBtn");
 const prevBtn = document.getElementById("prevTrack");
 const exitBtn = document.getElementById("exitMusic");

 if(playBtn) playBtn.onclick = togglePlay;
 if(muteBtn) muteBtn.onclick = toggleMute;
 if(nextBtn) nextBtn.onclick = nextTrack;
 if(prevBtn) prevBtn.onclick = previousTrack;

 if(exitBtn) exitBtn.onclick = () => {
  musicMode = false;
  showMenu();
 };
}

function nextTrack(){

  if(!audioPlayer || !playlist.length) return;

  currentTrack++;
  if(currentTrack >= playlist.length) currentTrack = 0;

  audioPlayer.src = playlist[currentTrack].file;
  audioPlayer.play();

  renderMusicScreen();
    renderPlaylist();
}

function previousTrack(){

  if(!audioPlayer || !playlist.length) return;

  currentTrack--;
  if(currentTrack < 0) currentTrack = playlist.length - 1;

  audioPlayer.src = playlist[currentTrack].file;
  audioPlayer.play();

  renderMusicScreen();
    renderPlaylist();
}

async function togglePlay(){

 ensureAudioPlayer();

 if(!audioPlayer) return;

 if(audioPlayer.paused){
  await audioPlayer.play();
 }else{
  audioPlayer.pause();
 }

 renderMiniPlayer();

 if(musicMode){
  renderMusicScreen();
  renderPlaylist();
 }
}

function toggleMute(){

  if(!audioPlayer) return;

  audioPlayer.muted = !audioPlayer.muted;

}

    function renderPlaylist(){

      const list = document.getElementById("musicPlaylist");
      if(!list) return;

      let out = "PLAYLIST\n\n";

      playlist.forEach((t,i)=>{

        if(i === currentTrack){
          out += `> ${i+1}. ${t.title}\n`;
        }else{
          out += `  ${i+1}. ${t.title}\n`;
        }

      });

      list.textContent = out;
    }

function renderMusicScreen(){

  const screen = document.getElementById("musicScreen");
  if(!screen || !audioPlayer) return;

  const duration = audioPlayer.duration || 0;
  const current  = audioPlayer.currentTime || 0;

  const percent = duration ? current / duration : 0;

  const barLength = 20;
  const filled = Math.floor(percent * barLength);

  const bar =
    "█".repeat(filled) +
    "░".repeat(barLength - filled);

    const vol = audioPlayer.volume || 0;
    const volBlocks = 10;
    const volFilled = Math.round(vol * volBlocks);

    const volBar =
    "█".repeat(volFilled) +
    "░".repeat(volBlocks - volFilled);

const volPercent = Math.round(vol * 100);

  function fmt(t){
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  }

  const time = `${fmt(current)} / ${fmt(duration)}`;

screen.textContent = `NODE403 MUSIC PLAYER

${playlist[currentTrack].title}

${audioPlayer.paused ? "[PAUSED]" : "[PLAYING]"} ${audioPlayer.muted ? "[MUTED]" : ""}

[${bar}] ${time}

VOL [${volBar}] ${volPercent}%

${trackNumberBuffer ? "SELECT: " + trackNumberBuffer : ""}

N = Next track
B = Previous track
SPACE = Play / Pause
V = Mute
+ / - = Volume
ESC = Menu`;
}

function generatePassword(length = 16){

  const chars =
  "abcdefghijklmnopqrstuvwxyz" +
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
  "0123456789" +
  "!@#$%^&*()-_=+[]{}";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  let pass = "";

  for(let i=0;i<length;i++){
    pass += chars[array[i] % chars.length];
  }

  return pass;
}

function openPasswordGenerator(){

  const terminalOutput = document.getElementById("terminalOutput");
  if (!terminalOutput) return;

  passwordMode = true;

  currentPassword = generatePassword(passwordLength);

  renderPassword();
}

function renderPassword(){

  const terminalOutput = document.getElementById("terminalOutput");
  if (!terminalOutput) return;

  terminalOutput.innerHTML = `
<pre>
NODE403 PASSWORD GENERATOR

Length: ${passwordLength}

Generated password:

${currentPassword}

N = new password
+ = longer
- = shorter
C = copy
ESC = menu

</pre>`;
}

function copyPassword(){

  if(!currentPassword) return;

  navigator.clipboard.writeText(currentPassword)
  .catch(()=>{});
}

function openCalculator() {

  const terminalOutput = document.getElementById("terminalOutput");
  if (!terminalOutput) return;

  calculatorMode = true;
  calcInput = "";

terminalOutput.innerHTML = `
<div style="
width:100%;
min-height:calc(100vh - 180px);
display:flex;
align-items:flex-start;
justify-content:center;
padding-top:5px;
">

<div style="
transform:scale(.7);
transform-origin:center;
width:100%;
max-width:420px;
">

<div style="
width:100%;
max-width:420px;
height:100%;
display:flex;
flex-direction:column;
">

<div id="calcDisplay" style="
background:#000;
color:#0f0;
padding:16px;
font-family:monospace;
font-size:28px;
margin-bottom:10px;
border:1px solid #333;
text-align:right;
overflow:hidden;
">
0
</div>

<div id="calcKeys" style="
display:grid;
grid-template-columns:repeat(4,1fr);
gap:8px;
flex-grow:1;
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
    "ESC     menu"
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

  /* blokkeer ESC tijdens simulatie */

  if (simulationActive && e.code === "Escape") {
    e.preventDefault();
    return;
  }

  let key = e.key;
  const code = e.code;

  /* NUMPAD FIX */

  if (code && code.startsWith("Numpad")) {

    const map = {
      Numpad0: "0",
      Numpad1: "1",
      Numpad2: "2",
      Numpad3: "3",
      Numpad4: "4",
      Numpad5: "5",
      Numpad6: "6",
      Numpad7: "7",
      Numpad8: "8",
      Numpad9: "9",
      NumpadAdd: "+",
      NumpadSubtract: "-",
      NumpadMultiply: "*",
      NumpadDivide: "/",
      NumpadDecimal: ".",
      NumpadEnter: "enter"
    };

    if (map[code]) {
      key = map[code];
    }

  }

  key = String(key).toLowerCase();

if(uuidMode){

if(code === "Escape"){
  uuidMode = false;
  uuidCount = "";
  generatedUUIDs = [];
  showMenu();
  return;
}

 if(!generatedUUIDs.length){

  if(/^[0-9]$/.test(key)){
   uuidCount += key;
  }

  if(key === "enter"){

   const count = Math.min(100, parseInt(uuidCount) || 1);

   generateUUIDList(count);
   renderUUIDResult();
   return;
  }

  const terminalOutput = document.getElementById("terminalOutput");

  terminalOutput.innerHTML = `
<pre>
NODE403 UUID GENERATOR

Enter number of UUIDs to generate

> ${uuidCount}█

Press ESCAPE to return
</pre>
`;

  return;
 }

 if(key === "n"){
  generatedUUIDs = [];
  uuidCount = "";
  openUUIDGenerator();
  return;
 }

 if(key === "c"){
  copyUUIDs();
  return;
 }

 return;
}

    /* -------------------------
       LIVE VIEW MODE
    ------------------------- */

    if (liveMode) {

      if (code === "Escape") {

        clearInterval(liveInterval);
        liveInterval = null;
        liveMode = false;

        showMenu();
      }

      return;
    }


    /* -------------------------
       PASSWORD GENERATOR
    ------------------------- */

    if (passwordMode) {

      if (code === "Escape") {
        passwordMode = false;
        showMenu();
        return;
      }

      if (key === "n") {
        currentPassword = generatePassword(passwordLength);
        renderPassword();
        return;
      }

      if (key === "+") {
        passwordLength = Math.min(64,passwordLength+1);
        currentPassword = generatePassword(passwordLength);
        renderPassword();
        return;
      }

      if (key === "-") {
        passwordLength = Math.max(6,passwordLength-1);
        currentPassword = generatePassword(passwordLength);
        renderPassword();
        return;
      }

      if (key === "c") {
        copyPassword();
        return;
      }

      return;
    }


    /* -------------------------
       CALCULATOR
    ------------------------- */

if (calculatorMode) {

  e.stopPropagation();
  e.preventDefault();

  if (code === "Escape") {
    calculatorMode = false;
    showMenu();
    return;
  }

  if (key === "enter") {

    let result = "error";

    try {
      result = Function("'use strict'; return (" + calcInput + ")")();
    } catch {}

    const display = document.getElementById("calcDisplay");

    if(display){
      display.textContent = result;
    }

    calcInput = result.toString();
    return;
  }

  if (/^[0-9+\-*/().]$/.test(key)) {

    calcInput += key;

    const display = document.getElementById("calcDisplay");

    if(display){
      display.textContent = calcInput;
    }

  }

  return;
}

    /* -------------------------
       MUSIC PLAYER
    ------------------------- */

    if (musicMode) {

      if(/^[0-9]$/.test(key)){
        trackNumberBuffer += key;
        return;
      }

      if(key === "enter"){

        const index = parseInt(trackNumberBuffer) - 1;

        if(!isNaN(index) && playlist[index]){
          currentTrack = index;
          audioPlayer.src = playlist[currentTrack].file;
            audioPlayer.play();

            renderMusicScreen();
            renderPlaylist();
            renderMiniPlayer();
        }

        trackNumberBuffer = "";
        return;
      }

      if (key === "n") {
        nextTrack();
        return;
      }

      if (key === "b") {
        previousTrack();
        return;
      }

      if (code === "Space") {
        e.preventDefault();
        togglePlay();
        return;
      }

      if (key === "v") {
        toggleMute();
        return;
      }

    if(key === "+"){
      audioPlayer.volume = Math.min(1,audioPlayer.volume + 0.05);
    }

    if(key === "-"){
      audioPlayer.volume = Math.max(0,audioPlayer.volume - 0.05);
    }

      if (code === "Escape") {
      musicMode = false;
      trackNumberBuffer = "";
      showMenu();
      return;
    }

      return;
    }

/* -------------------------
   SUDOKU
------------------------- */

if (sudokuMode) {

  if (code === "Escape") {
    sudokuMode = false;
    showMenu();
    return;
  }

  if (code === "ArrowUp") {
    sudokuRow = (sudokuRow + 8) % 9;
    renderSudoku();
    return;
  }

  if (code === "ArrowDown") {
    sudokuRow = (sudokuRow + 1) % 9;
    renderSudoku();
    return;
  }

  if (code === "ArrowLeft") {
    sudokuCol = (sudokuCol + 8) % 9;
    renderSudoku();
    return;
  }

  if (code === "ArrowRight") {
    sudokuCol = (sudokuCol + 1) % 9;
    renderSudoku();
    return;
  }

  if (/^[1-9]$/.test(key)) {
    sudokuGrid[sudokuRow][sudokuCol] = Number(key);
    renderSudoku();
    return;
  }

  if (key === "0") {
    sudokuGrid[sudokuRow][sudokuCol] = 0;
    renderSudoku();
    return;
  }

  if (key === "n") {
    generateSudoku();
    sudokuRow = 0;
    sudokuCol = 0;
    renderSudoku();
    return;
  }

  return;
}

if(chatMode){

  e.stopPropagation();
  e.preventDefault();

  if(document.activeElement !== document.body){
    document.body.focus();
  }

      if(code === "Escape"){
      chatMode = false;
      stopChatPolling();
      showMenu();
      return;
    }

  if(chatUsernameMode){

    if(key === "backspace"){
      chatUsername = chatUsername.slice(0,-1);
      renderChatScreen();
      return;
    }

if(key === "enter"){

  const cleaned = chatUsername.trim();
  if(!cleaned) return;

  chatUsername = cleaned;

  const res = await heartbeatChatPresence();

if(!res || res.error === "username_taken"){

  stopChatPolling();

  chatUsername = "";
  chatToken = "";
  chatInput = "";

  chatUsernameMode = true;

  alert("Username already in use");

  renderChatScreen();
  return;
}

  chatUsernameMode = false;

  await fetchChatMessages();
  renderChatScreen();
  startChatPolling();

  return;
}

    if(/^[a-z0-9_-]$/i.test(key) && chatUsername.length < 20){
      chatUsername += e.key;
      renderChatScreen();
    }

    return;
  }

  if(key === "backspace"){
    chatInput = chatInput.slice(0,-1);
    renderChatScreen();
    return;
  }

  if(key === "enter"){
    await sendChatMessage();
    return;
  }

  if(key.length === 1 && chatInput.length < 200){
    chatInput += key;
    renderChatScreen();
  }

  return;
}

    /* -------------------------
       MAIN MENU
    ------------------------- */
    if (key === "1") {
      openLiveView();
      return;
    }

    if (key === "2") {
      openIPLookup();
      return;
    }

    if (key === "3") {
      openPasswordGenerator();
      return;
    }

    if(key === "4"){
     openUUIDGenerator();
     return;
    }

    if (key === "5") {
      openCalculator();
      return;
    }

    if (key === "6") {
      openMusicPlayer();
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

Press ESCAPE to return
</pre>`;

      }

      return;
    }

    if (key === "9") {
      openChat();
      return;
    }

    if (key === "0") {
      await startSimulationFromMenu();
      return;
    }

    if (code === "Escape") {
      showMenu();
    }

  });

}

    async function startSimulationFromMenu() {

      simulationActive = true;

      stopSequence = false;
      stopMenuAudio();

    const clock = document.getElementById("terminalClock");
    if (clock) clock.style.display = "none";
    
    const player = document.getElementById("menuAudioConsole");
    if (player) player.style.display = "none";

    applyUILanguage(getNetworkGroup(), UI_TEXT, "simulation");

    const fsBtn = document.getElementById("fullscreenPageBtn");
    if(fsBtn) fsBtn.style.display = "block";

    if (dom?.backBtn) dom.backBtn.style.display = "none";

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
NODE403 IP / ASN LOOKUP

Resolving network information...

Press ESCAPE to return
</pre>
`;

 try {

   const res = await fetch("/api/ip.php",{cache:"no-store"});
   const text = await res.text();
    const data = text ? JSON.parse(text) : {ok:false};

const ip = data.ip || "-";
const city = data.city || "";
const country = data.country || "";
const asn = data.asn || "-";
const network = data.org || "-";

terminalOutput.innerHTML = `
<pre>
NODE403 IP / ASN LOOKUP

IP ADDRESS
${ip}

LOCATION
${city}${city && country ? ", " : ""}${country}

NETWORK
ASN: ${asn}
ORG: ${network}

Press ESCAPE to return
</pre>
`;

 } catch (err) {

   terminalOutput.innerHTML = `
<pre>
NODE403 IP / ASN LOOKUP

Lookup failed

Press ESCAPE to return
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
        await new Promise(r => schedule(r, 30));
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

  bindUIEvents(dom,{

    onBack: async () => {

      stopSequence = true;

      activeTimeouts.forEach(clearTimeout);
      activeTimeouts = [];

      if(renderState.animationFrame){
        cancelAnimationFrame(renderState.animationFrame);
        renderState.animationFrame = null;
      }

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
