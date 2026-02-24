import { Chess } from "chess.js";
import { Chessground } from "@lichess-org/chessground";

// Parse a %clk string like "0:02:59.9" to seconds
function parseClockSeconds(clkStr) {
  const match = clkStr.match(/(\d+):(\d+):(\d+\.?\d*)/);
  if (!match) return null;
  return parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseFloat(match[3]);
}

// Extract %clk value from a chess.js comment string
function extractClockFromComment(comment) {
  if (!comment) return null;
  const match = comment.match(/\[%clk\s+(\d+:\d+:\d+\.?\d*)\]/);
  if (!match) return null;
  return parseClockSeconds(match[1]);
}

// Format seconds as M:SS
function formatClock(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const PIECE_VALUES = { p: 1, n: 3, b: 3, r: 5, q: 9 };
const PIECE_LETTER = { p: "P", n: "N", b: "B", r: "R", q: "Q" };
const STARTING_COUNTS = { p: 8, n: 2, b: 2, r: 2, q: 1 };
const baseurl = document.querySelector('meta[name="baseurl"]')?.content ?? "";

function computeImbalance(fen) {
  const onBoard = { w: { p:0, n:0, b:0, r:0, q:0 }, b: { p:0, n:0, b:0, r:0, q:0 } };
  for (const ch of fen.split(" ")[0]) {
    const lower = ch.toLowerCase();
    if ("pnbrq".includes(lower)) onBoard[ch === lower ? "b" : "w"][lower]++;
  }
  const captured = { w: {}, b: {} };
  let whiteTotal = 0, blackTotal = 0;
  for (const piece of "pnbrq") {
    captured.w[piece] = STARTING_COUNTS[piece] - onBoard.b[piece];
    captured.b[piece] = STARTING_COUNTS[piece] - onBoard.w[piece];
    whiteTotal += onBoard.w[piece] * PIECE_VALUES[piece];
    blackTotal += onBoard.b[piece] * PIECE_VALUES[piece];
  }
  return { captured, advantage: whiteTotal - blackTotal };
}

function updateCaptures(piecesEl, advantageEl, captured, capturedColor, advantagePoints) {
  const imgs = [];
  for (const piece of "pnbrq") {
    for (let i = 0; i < (captured[piece] || 0); i++) {
      const img = document.createElement("img");
      img.src = `${baseurl}/assets/images/pieces/${capturedColor}${PIECE_LETTER[piece]}.svg`;
      img.alt = piece;
      imgs.push(img);
    }
  }
  piecesEl.replaceChildren(...imgs);
  advantageEl.textContent = advantagePoints > 0 ? `+${advantagePoints}` : "";
}

async function compress(text) {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream("deflate-raw"));
  const buffer = await new Response(stream).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function decompress(base64) {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return await new Response(stream).text();
}

// Init board
const el = document.getElementById("board");
const cg = Chessground(el, {
  viewOnly: true,
  animation: { duration: 300 },
  coordinates: false,
});

// DOM elements
const clockTop = document.getElementById("clock-top");
const clockBottom = document.getElementById("clock-bottom");
const clockTopTime = clockTop.querySelector(".clock-time");
const clockBottomTime = clockBottom.querySelector(".clock-time");
const capturesTopPieces = clockTop.querySelector(".captures-pieces");
const capturesTopAdvantage = clockTop.querySelector(".captures-advantage");
const capturesBottomPieces = clockBottom.querySelector(".captures-pieces");
const capturesBottomAdvantage = clockBottom.querySelector(".captures-advantage");
const resultBanner = document.getElementById("result-banner");
const shareButton = document.getElementById("share");
let flipped = false;
let currentGame = null;

// Flip button
document.getElementById("flip").addEventListener("click", () => {
  cg.toggleOrientation();
  flipped = !flipped;
  if (currentGame) {
    currentGame.updateClockDisplay();
    currentGame.updateCaptureDisplay();
  }
  const params = new URLSearchParams(window.location.search);
  if (params.has("pgn")) {
    params.set("orientation", flipped ? "black" : "white");
    history.replaceState(null, "", "?" + params.toString());
  }
});

// Share button
shareButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(window.location.href);
  shareButton.textContent = "Copied!";
  setTimeout(() => { shareButton.textContent = "Share"; }, 2000);
});

// File input
document.getElementById("pgn-file").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    const pgn = reader.result;
    const compressed = await compress(pgn);
    const params = new URLSearchParams();
    params.set("pgn", compressed);
    params.set("orientation", "white");
    history.replaceState(null, "", "?" + params.toString());
    if (currentGame) currentGame.stop();
    startGame(pgn, "white");
  };
  reader.readAsText(file);
});

// On page load, check for pgn in query string
async function init() {
  const params = new URLSearchParams(window.location.search);
  const pgnParam = params.get("pgn");
  if (pgnParam) {
    const pgn = await decompress(pgnParam);
    const orientation = params.get("orientation") || "white";
    startGame(pgn, orientation);
  }
}
init();

function startGame(pgn, orientation = "white") {
  const chess = new Chess();
  chess.loadPgn(pgn);

  // Build a map of FEN -> comment from chess.js
  const commentsByFen = {};
  for (const { fen, comment } of chess.getComments()) {
    commentsByFen[fen] = comment;
  }

  // Get the full move list
  const moves = chess.history({ verbose: true });

  // Attach clock times to each move using the FEN after the move
  const clocks = moves.map((move) => extractClockFromComment(commentsByFen[move.after]));

  // Parse time control from PGN header
  const timeControlHeader = chess.header()["TimeControl"];
  const timeControlSeconds = timeControlHeader ? parseInt(timeControlHeader) || 0 : 0;

  // Game metadata from PGN headers
  const whiteName = chess.header()["White"] || "White";
  const blackName = chess.header()["Black"] || "Black";
  const termination = chess.header()["Termination"] || null;
  const result = chess.header()["Result"] || null;

  // Playback state
  chess.reset();
  flipped = orientation === "black";
  cg.set({ fen: chess.fen(), orientation });
  let currentImbalance = computeImbalance(chess.fen());
  let moveIndex = 0;
  let whiteSeconds = timeControlSeconds;
  let blackSeconds = timeControlSeconds;
  let tickInterval = null;
  let nextMoveTimeout = null;
  let activeColor = null;
  let lastTickTime = null;

  function getThinkTimeMs(idx) {
    const currentClock = clocks[idx];
    if (currentClock === null) return 1000;

    const prevIndex = idx - 2;
    let prevClock;
    if (prevIndex < 0) {
      prevClock = timeControlSeconds;
    } else {
      prevClock = clocks[prevIndex];
      if (prevClock === null) return 1000;
    }

    const thinkTimeMs = (prevClock - currentClock) * 1000;
    return Math.max(thinkTimeMs, 300);
  }

  function updateClockDisplay() {
    const white = formatClock(whiteSeconds);
    const black = formatClock(blackSeconds);
    if (flipped) {
      clockTop.querySelector(".player-name").textContent = whiteName;
      clockBottom.querySelector(".player-name").textContent = blackName;
      clockTopTime.textContent = white;
      clockBottomTime.textContent = black;
      clockTop.className = "clock clock-white";
      clockBottom.className = "clock clock-black";
    } else {
      clockTop.querySelector(".player-name").textContent = blackName;
      clockBottom.querySelector(".player-name").textContent = whiteName;
      clockTopTime.textContent = black;
      clockBottomTime.textContent = white;
      clockTop.className = "clock clock-black";
      clockBottom.className = "clock clock-white";
    }
  }

  function updateCaptureDisplay() {
    const { captured, advantage } = currentImbalance;
    if (flipped) {
      updateCaptures(capturesTopPieces, capturesTopAdvantage, captured.w, "b", advantage > 0 ? advantage : 0);
      updateCaptures(capturesBottomPieces, capturesBottomAdvantage, captured.b, "w", advantage < 0 ? -advantage : 0);
    } else {
      updateCaptures(capturesTopPieces, capturesTopAdvantage, captured.b, "w", advantage < 0 ? -advantage : 0);
      updateCaptures(capturesBottomPieces, capturesBottomAdvantage, captured.w, "b", advantage > 0 ? advantage : 0);
    }
  }

  function updateResultBanner() {
    if (moveIndex >= moves.length && result) {
      resultBanner.innerHTML = "";
      let outcome;
      if (result === "1-0") outcome = "White wins";
      else if (result === "0-1") outcome = "Black wins";
      else outcome = "Draw";

      const line1 = document.createElement("div");
      line1.textContent = `${outcome} (${result})`;
      resultBanner.appendChild(line1);

      if (termination) {
        const line2 = document.createElement("div");
        line2.textContent = termination;
        line2.className = "result-detail";
        resultBanner.appendChild(line2);
      }
      resultBanner.hidden = false;
    } else {
      resultBanner.hidden = true;
    }
  }

  function stopTicking() {
    if (tickInterval !== null) {
      clearInterval(tickInterval);
      tickInterval = null;
    }
    activeColor = null;
  }

  function stop() {
    stopTicking();
    if (nextMoveTimeout !== null) {
      clearTimeout(nextMoveTimeout);
      nextMoveTimeout = null;
    }
  }

  function startTicking(color) {
    stopTicking();
    activeColor = color;
    lastTickTime = performance.now();
    tickInterval = setInterval(() => {
      const now = performance.now();
      const elapsed = (now - lastTickTime) / 1000;
      lastTickTime = now;
      if (activeColor === "w") {
        whiteSeconds = Math.max(0, whiteSeconds - elapsed);
      } else {
        blackSeconds = Math.max(0, blackSeconds - elapsed);
      }
      updateClockDisplay();
    }, 100);
  }

  function playNextMove() {
    if (moveIndex >= moves.length) {
      stopTicking();
      return;
    }

    const move = moves[moveIndex];
    chess.move(move.san);
    cg.move(move.from, move.to);
    cg.set({ fen: chess.fen() });
    currentImbalance = computeImbalance(chess.fen());
    updateCaptureDisplay();

    if (clocks[moveIndex] !== null) {
      if (move.color === "w") {
        whiteSeconds = clocks[moveIndex];
      } else {
        blackSeconds = clocks[moveIndex];
      }
    }
    updateClockDisplay();

    moveIndex++;

    updateResultBanner();

    if (moveIndex < moves.length) {
      const nextColor = move.color === "w" ? "b" : "w";
      startTicking(nextColor);
      nextMoveTimeout = setTimeout(playNextMove, getThinkTimeMs(moveIndex));
    } else {
      stopTicking();
    }
  }

  currentGame = { updateClockDisplay, updateCaptureDisplay, stop };

  updateClockDisplay();
  updateCaptureDisplay();
  playNextMove();
}
