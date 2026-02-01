// ====== HELPERS ======
const screens = document.querySelectorAll(".screen");
function showScreen(className) {
  screens.forEach((s) => (s.style.display = "none"));
  if (!className) return;
  const el = document.querySelector(className);
  if (el) el.style.display = "grid";
}

// ====== MUSIC (AUTOPLAY SAFE) ======
const bgMusic = document.getElementById("bg-music");
let musicStarted = false;
function startMusic() {
  if (!bgMusic || musicStarted) return;
  bgMusic.volume = 0.25;
  const p = bgMusic.play();
  if (p && typeof p.then === "function") {
    p.then(() => (musicStarted = true)).catch(() => (musicStarted = false));
  } else {
    musicStarted = true;
  }
}
document.addEventListener("click", () => {
  if (!musicStarted) startMusic();
});

const muteBtn = document.querySelector(".js-mute-btn");
if (muteBtn && bgMusic) {
  muteBtn.addEventListener("click", () => {
    bgMusic.muted = !bgMusic.muted;
    muteBtn.textContent = bgMusic.muted ? "🔇" : "🔊";
  });
}

// ====== ELEMENTS ======
const startBtn = document.querySelector(".js-start-btn");

// Match
const matchChoices = document.querySelectorAll(".js-match-choice");
const matchMsg = document.querySelector(".js-match-msg");
const correctCountEl = document.querySelector(".js-correct-count");
let correctFound = 0;

// PIN
const pinInput = document.querySelector(".js-pin-input");
const pinSubmit = document.querySelector(".js-pin-submit");
const pinMsg = document.querySelector(".js-pin-msg");
const CORRECT_PIN = "0502"; // CHANGE THIS

// Bow
const bowChoices = document.querySelectorAll(".js-bow-choice");
const bowMsg = document.querySelector(".js-bow-msg");

// Final + letter modal
const openLetterBtn = document.querySelector(".js-open-letter-btn");
const letterModal = document.querySelector(".js-letter-modal");
const letterCloseEls = document.querySelectorAll(".js-letter-close");
const valentineArea = document.querySelector(".js-valentine-area");

const tabImage = document.querySelector(".js-tab-image");
const tabText = document.querySelector(".js-tab-text");
const imageView = document.querySelector(".js-letter-image-view");
const textView = document.querySelector(".js-letter-text-view");

// Valentine buttons
const yesBtn = document.querySelector(".js-yes-btn");
const noBtn = document.querySelector(".js-no-btn");

// Result/loader
const resultContainer = document.querySelector(".result-container");
const gifResult = document.querySelector(".gif-result");
const heartLoader = document.querySelector(".cssload-main");

// No-click messages
const messages = ["No 💔", "Are you sure? 🥺", "Pleaseee 💘", "Come onnn 😭", "Just say yes 😏"];
let messageIndex = 0;

// ====== START STATE (IMPORTANT: force modal hidden) ======
showScreen(".intro-screen");
if (resultContainer) resultContainer.style.display = "none";
if (heartLoader) heartLoader.style.display = "none";
if (valentineArea) valentineArea.classList.remove("show");
if (letterModal) {
  letterModal.classList.remove("show");
  letterModal.setAttribute("aria-hidden", "true");
}

// ====== INTRO -> MATCH ======
if (startBtn) {
  startBtn.addEventListener("click", () => {
    startMusic();
    showScreen(".match-screen");
  });
}

// ====== MATCH ======
function updateCorrectUI() {
  if (correctCountEl) correctCountEl.textContent = String(correctFound);
}

if (matchChoices.length && matchMsg) {
  matchChoices.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("locked")) return;
      const isCorrect = btn.dataset.correct === "true";

      if (isCorrect) {
        btn.classList.add("correct", "locked");
        correctFound += 1;
        updateCorrectUI();
        matchMsg.textContent = `Correct! 💗 (${correctFound}/2)`;

        if (correctFound >= 2) {
          matchMsg.textContent = "Perfect! You found both matches 💘";
          setTimeout(() => {
            matchMsg.textContent = "";
            showScreen(".pin-screen");
          }, 800);
        }
      } else {
        btn.classList.add("wrong");
        matchMsg.textContent = "Wrong one 😭 try again!";
        setTimeout(() => btn.classList.remove("wrong"), 450);
      }
    });
  });
}

// ====== PIN ======
function cleanPin(val) {
  return (val || "").replace(/\D/g, "").slice(0, 4);
}

if (pinInput) {
  pinInput.addEventListener("input", () => (pinInput.value = cleanPin(pinInput.value)));
  pinInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      pinSubmit?.click();
    }
  });
}

if (pinSubmit && pinInput && pinMsg) {
  pinSubmit.addEventListener("click", () => {
    const entered = cleanPin(pinInput.value);

    if (entered.length !== 4) {
      pinMsg.textContent = "Enter 4 digits 😭";
      return;
    }
    if (entered === CORRECT_PIN) {
      pinMsg.textContent = "Unlocked! 💖";
      setTimeout(() => {
        pinMsg.textContent = "";
        showScreen(".bow-screen");
      }, 650);
    } else {
      pinMsg.textContent = "Wrong code 🙈 try again!";
    }
  });
}

// ====== BOW ======
if (bowChoices.length && bowMsg) {
  bowChoices.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isCorrect = btn.dataset.correct === "true";
      if (isCorrect) {
        bowMsg.textContent = "You found it! 🏹✨";
        setTimeout(() => {
          bowMsg.textContent = "";
          showScreen(".final-screen");
        }, 800);
      } else {
        bowMsg.textContent = "Not there 🙈 try again!";
      }
    });
  });
}

// ====== LETTER MODAL ======
function openLetter() {
  if (!letterModal) return;
  letterModal.classList.add("show");
  letterModal.setAttribute("aria-hidden", "false");

  // default image view
  if (imageView) imageView.style.display = "grid";
  if (textView) textView.style.display = "none";
}

function closeLetter() {
  if (!letterModal) return;
  letterModal.classList.remove("show");
  letterModal.setAttribute("aria-hidden", "true");

  // show valentine UI only after letter closed
  if (valentineArea) valentineArea.classList.add("show");
}

openLetterBtn?.addEventListener("click", openLetter);
letterCloseEls.forEach((el) => el.addEventListener("click", closeLetter));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && letterModal?.classList.contains("show")) closeLetter();
});

tabImage?.addEventListener("click", () => {
  if (imageView) imageView.style.display = "grid";
  if (textView) textView.style.display = "none";
});
tabText?.addEventListener("click", () => {
  if (imageView) imageView.style.display = "none";
  if (textView) textView.style.display = "grid";
});

// ====== NO GROWS YES (UNLIMITED) ======
let yesScale = 1;

function growYesButton() {
  if (!yesBtn) return;

  yesScale *= 1.25;

  yesBtn.style.transform = `
    translateX(-50%)
    scale(${yesScale})
  `;

  // once it gets HUGE, make it fixed and centered
  if (yesScale > 6) {
    yesBtn.style.position = "fixed";
    yesBtn.style.top = "50%";
    yesBtn.style.left = "50%";
    yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
    yesBtn.style.zIndex = "9999";
  }

  // when it's MASSIVE, make it basically full screen
  if (yesScale > 12) {
    yesBtn.style.borderRadius = "0";
    yesBtn.style.width = "100vw";
    yesBtn.style.height = "100vh";
    yesBtn.style.fontSize = "8vw";
  }
}

noBtn?.addEventListener("click", () => {
  noBtn.textContent = messages[messageIndex];
  messageIndex = (messageIndex + 1) % messages.length;
  growYesButton();
});

// ====== YES ======
yesBtn?.addEventListener("click", () => {
  showScreen("");
  if (heartLoader) heartLoader.style.display = "grid";

  setTimeout(() => {
    if (heartLoader) heartLoader.style.display = "none";
    if (resultContainer) resultContainer.style.display = "grid";
    gifResult?.play();
  }, 2500);
});
