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

// Init board
const el = document.getElementById("board");
const cg = Chessground(el, {
  viewOnly: true,
  animation: { duration: 300 },
  coordinates: false,
});

// DOM elements
const container = document.querySelector(".container");
const fileInputArea = document.querySelector(".file-input-area");
const clockTop = document.getElementById("clock-top");
const clockBottom = document.getElementById("clock-bottom");
const clockTopTime = clockTop.querySelector(".clock-time");
const clockBottomTime = clockBottom.querySelector(".clock-time");
const resultBanner = document.getElementById("result-banner");
let flipped = false;

// Flip button
document.getElementById("flip").addEventListener("click", () => {
  cg.toggleOrientation();
  flipped = !flipped;
  if (currentGame) currentGame.updateClockDisplay();
});

let currentGame = null;

// File input
document.getElementById("pgn-file").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    fileInputArea.hidden = true;
    container.hidden = false;
    startGame(reader.result);
  };
  reader.readAsText(file);
});

function startGame(pgn) {
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
  cg.set({ fen: chess.fen(), orientation: "white" });
  flipped = false;
  let moveIndex = 0;
  let whiteSeconds = timeControlSeconds;
  let blackSeconds = timeControlSeconds;
  let tickInterval = null;
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
      setTimeout(playNextMove, getThinkTimeMs(moveIndex));
    } else {
      stopTicking();
    }
  }

  // Expose updateClockDisplay for the flip button
  currentGame = { updateClockDisplay };

  updateClockDisplay();
  playNextMove();
}
