import { Chess } from "chess.js";
import { Chessground } from "@lichess-org/chessground";

const PGN = `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2026.02.23"]
[Round "?"]
[White "bearvssharkfan"]
[Black "bkcall"]
[Result "1-0"]
[TimeControl "180"]
[WhiteElo "1500"]
[BlackElo "1506"]
[Termination "bearvssharkfan won by resignation"]

1. e4 {[%clk 0:02:59.9]} 1... e5 {[%clk 0:02:58.9]} 2. Nf3 {[%clk 0:02:59.3]} 2... Nc6 {[%clk 0:02:58.5]} 3. Bc4 {[%clk 0:02:58.7]} 3... Nf6 {[%clk 0:02:57.8]} 4. Ng5 {[%clk 0:02:57.9]} 4... d5 {[%clk 0:02:56.9]} 5. exd5 {[%clk 0:02:56.5]} 5... Nd4 {[%clk 0:02:54.7]} 6. d6 {[%clk 0:02:52.6]} 6... Qxd6 {[%clk 0:02:52.4]} 7. Nxf7 {[%clk 0:02:50.1]} 7... Qc6 {[%clk 0:02:51.5]} 8. O-O {[%clk 0:02:40.6]} 8... Qxc4 {[%clk 0:02:45.2]} 9. Nxh8 {[%clk 0:02:39.6]} 9... Bg4 {[%clk 0:02:38.7]} 10. f3 {[%clk 0:02:29.4]} 10... Nxc2 {[%clk 0:02:33]} 11. d3 {[%clk 0:02:20.7]} 11... Qc5+ {[%clk 0:02:30.3]} 12. Kh1 {[%clk 0:02:17.3]} 12... Nxa1 {[%clk 0:02:21.7]} 13. fxg4 {[%clk 0:02:15.8]} 13... O-O-O {[%clk 0:02:19.7]} 14. Nc3 {[%clk 0:02:07.2]} 14... Nd5 {[%clk 0:02:15.3]} 15. Ne4 {[%clk 0:02:00.2]} 15... Qb6 {[%clk 0:02:10.4]} 16. Bg5 {[%clk 0:01:53.7]} 16... Be7 {[%clk 0:02:04.3]} 17. Bxe7 {[%clk 0:01:50.8]} 17... Nxe7 {[%clk 0:02:04.2]} 18. Nf7 {[%clk 0:01:49]} 18... Re8 {[%clk 0:01:59.3]} 19. Qxa1 {[%clk 0:01:45.5]} 19... Ng6 {[%clk 0:01:50.4]} 20. g3 {[%clk 0:01:35.9]} 20... Qe3 {[%clk 0:01:41.8]} 21. Qd1 {[%clk 0:01:27.5]} 21... Re7 {[%clk 0:01:38]} 22. Nfg5 {[%clk 0:01:22.3]} 22... Rd7 {[%clk 0:01:35.8]} 23. Re1 {[%clk 0:01:14.8]} 23... Qb6 {[%clk 0:01:31.8]} 24. Nxh7 {[%clk 0:01:01.5]} 24... Qxb2 {[%clk 0:01:29.3]} 25. Qe2 {[%clk 0:00:58.8]} 25... Qd4 {[%clk 0:01:27.5]} 26. Neg5 {[%clk 0:00:55.8]} 26... Qxd3 {[%clk 0:01:25.5]} 27. Qxd3 {[%clk 0:00:55]} 27... Rxd3 {[%clk 0:01:24.8]} 28. Nf7 {[%clk 0:00:53.2]} 28... Rd2 {[%clk 0:01:22.6]} 29. Nxe5 {[%clk 0:00:50.5]} 29... Nxe5 {[%clk 0:01:21.7]} 30. Rxe5 {[%clk 0:00:50.1]} 30... Rxa2 {[%clk 0:01:21]} 31. Ng5 {[%clk 0:00:48.3]} 31... Ra1+ {[%clk 0:01:19.6]} 32. Kg2 {[%clk 0:00:47.3]} 32... Ra2+ {[%clk 0:01:18.9]} 33. Kh3 {[%clk 0:00:46.8]} 33... a5 {[%clk 0:01:17.4]} 34. Re7 {[%clk 0:00:44.7]} 34... b6 {[%clk 0:01:16.4]} 35. Rxg7 {[%clk 0:00:44.1]} 35... Ra1 {[%clk 0:01:14.4]} 36. Ne6 {[%clk 0:00:43.4]} 36... a4 {[%clk 0:01:13.7]} 37. Rxc7+ {[%clk 0:00:42.6]} 37... Kb8 {[%clk 0:01:12.5]} 38. Rc6 {[%clk 0:00:40.9]} 38... Rb1 {[%clk 0:01:11.8]} 39. Nd4 {[%clk 0:00:39.5]} 39... b5 {[%clk 0:01:10.7]} 40. Nc2 {[%clk 0:00:38.2]} 40... b4 {[%clk 0:01:04.7]} 41. Rb6+ {[%clk 0:00:36.4]} 41... Ka7 {[%clk 0:01:02.8]} 42. Rxb4 {[%clk 0:00:35.7]} 42... Rxb4 {[%clk 0:01:02]} 43. Nxb4 {[%clk 0:00:35.6]} 43... Kb6 {[%clk 0:01:01.2]} 44. Na2 {[%clk 0:00:35.1]} 44... Kb5 {[%clk 0:01:00.5]} 45. g5 {[%clk 0:00:34.8]} 45... Kc4 {[%clk 0:00:59]} 46. g6 {[%clk 0:00:34.2]} 46... Kb3 {[%clk 0:00:58.9]} 47. g7 {[%clk 0:00:33.6]} 47... Kxa2 {[%clk 0:00:58.2]} 48. g8=Q+ {[%clk 0:00:33.3]} 48... Kb2 {[%clk 0:00:57.3]} 49. Qb8+ {[%clk 0:00:32.6]} 1-0`;

const TIME_CONTROL_SECONDS = 180;

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

// Parse the game and build move list with clock data
const chess = new Chess();
chess.loadPgn(PGN);

// Build a map of FEN -> comment from chess.js
const commentsByFen = {};
for (const { fen, comment } of chess.getComments()) {
  commentsByFen[fen] = comment;
}

// Get the full move list
const moves = chess.history({ verbose: true });

// Attach clock times to each move using the FEN after the move
const clocks = moves.map((move) => extractClockFromComment(commentsByFen[move.after]));

// Calculate think time for a move
function getThinkTimeMs(moveIndex) {
  const currentClock = clocks[moveIndex];
  if (currentClock === null) return 1000;

  // Find previous clock for the same color (2 moves back)
  const prevIndex = moveIndex - 2;
  let prevClock;
  if (prevIndex < 0) {
    prevClock = TIME_CONTROL_SECONDS;
  } else {
    prevClock = clocks[prevIndex];
    if (prevClock === null) return 1000;
  }

  const thinkTimeMs = (prevClock - currentClock) * 1000;
  return Math.max(thinkTimeMs, 300);
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

// Clock elements
const clockTop = document.getElementById("clock-top");
const clockBottom = document.getElementById("clock-bottom");
const clockTopTime = clockTop.querySelector(".clock-time");
const clockBottomTime = clockBottom.querySelector(".clock-time");
let flipped = false;

// Game metadata from PGN headers
const whiteName = chess.header()["White"] || "White";
const blackName = chess.header()["Black"] || "Black";
const termination = chess.header()["Termination"] || null;
const result = chess.header()["Result"] || null;

// Result banner
const resultBanner = document.getElementById("result-banner");

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

// Play back moves with timing
chess.reset();
let moveIndex = 0;
let whiteSeconds = TIME_CONTROL_SECONDS;
let blackSeconds = TIME_CONTROL_SECONDS;
let tickInterval = null;
let activeColor = null; // "w" or "b" — whose clock is ticking
let lastTickTime = null;

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

function stopTicking() {
  if (tickInterval !== null) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
  activeColor = null;
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

  // Snap the moving player's clock to the PGN value
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

  // Start ticking the next player's clock and delay by their think time
  if (moveIndex < moves.length) {
    const nextColor = move.color === "w" ? "b" : "w";
    startTicking(nextColor);
    setTimeout(playNextMove, getThinkTimeMs(moveIndex));
  } else {
    stopTicking();
  }
}

playNextMove();

// Flip button
document.getElementById("flip").addEventListener("click", () => {
  cg.toggleOrientation();
  flipped = !flipped;
  updateClockDisplay();
});
