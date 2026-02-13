// collage.js

// ============================
// VIEWER ELEMENTS
// ============================
const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewerImg");
const viewerVideo = document.getElementById("viewerVideo");
const viewerText = document.getElementById("viewerText");
const heartsContainer = document.getElementById("hearts");

// ============================
// BACKGROUND MUSIC (FADE IN + QUIETER ON VIEW)
// ============================
const bgMusic = document.getElementById("bg-music");

// volumes you can tweak
const MUSIC_NORMAL = 0.22; // soft background
const MUSIC_QUIET  = 0.07; // even quieter when viewing a memory
const FADE_MS      = 1400;

bgMusic.volume = 0; // start silent

let musicStarted = false;

function fadeAudioTo(target, duration = 600) {
  target = Math.max(0, Math.min(1, target));

  const start = bgMusic.volume;
  const delta = target - start;

  if (duration <= 0) {
    bgMusic.volume = target;
    return;
  }

  const steps = Math.max(1, Math.floor(duration / 40));
  let step = 0;

  const timer = setInterval(() => {
    step++;
    bgMusic.volume = start + (delta * (step / steps));

    if (step >= steps) {
      bgMusic.volume = target;
      clearInterval(timer);
    }
  }, 40);
}

// browsers require a user gesture for audio
function startMusicOnce() {
  if (musicStarted) return;
  musicStarted = true;

  bgMusic.currentTime = 0;

  bgMusic.play()
    .then(() => {
      fadeAudioTo(MUSIC_NORMAL, FADE_MS);
    })
    .catch(() => {
      // If blocked for any reason, allow another attempt on next tap
      musicStarted = false;
    });
}

// Start music on the FIRST user interaction anywhere
["click", "touchstart", "keydown"].forEach((evt) => {
  document.addEventListener(evt, startMusicOnce, { once: true });
});

// ============================
// FLOATING HEARTS
// ============================
let heartInterval = null;

function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.textContent = "💖";

  heart.style.setProperty("--x", Math.random() * 100 + "%");
  heart.style.setProperty("--size", 16 + Math.random() * 20 + "px");
  heart.style.setProperty("--dur", 3 + Math.random() * 3 + "s");
  heart.style.setProperty("--drift", (Math.random() - 0.5) * 220 + "px");
  heart.style.setProperty("--rot", (Math.random() - 0.5) * 180 + "deg");

  heartsContainer.appendChild(heart);

  setTimeout(() => heart.remove(), 6000);
}

function startHearts() {
  if (heartInterval) clearInterval(heartInterval);
  heartInterval = setInterval(createHeart, 260);
}

function stopHearts() {
  if (heartInterval) clearInterval(heartInterval);
  heartInterval = null;
  heartsContainer.innerHTML = "";
}

// ============================
// OPEN VIEWER
// ============================
function openViewer({ type, src, text }) {
  // lower background music when opening a memory
  if (musicStarted) fadeAudioTo(MUSIC_QUIET, 300);

  // Reset media
  viewerImg.style.display = "none";
  viewerVideo.style.display = "none";
  viewerVideo.pause();
  viewerVideo.currentTime = 0;

  if (type === "img") {
    viewerImg.src = src;
    viewerImg.style.display = "block";
  } else {
    viewerVideo.src = src;
    viewerVideo.style.display = "block";
    viewerVideo.muted = false; // sound ON in viewer
    viewerVideo.volume = 1;

    viewerVideo.play().catch(() => {});
  }

  viewerText.textContent = text || "";
  viewer.classList.add("show");
  startHearts();
}

// ============================
// CLOSE VIEWER
// ============================
function closeViewer() {
  viewer.classList.remove("show");
  viewerVideo.pause();
  stopHearts();

  // restore background music after closing
  if (musicStarted) fadeAudioTo(MUSIC_NORMAL, 350);
}

viewer.addEventListener("click", (e) => {
  // close only if clicking outside the content area
  if (e.target === viewer) closeViewer();
});

// ============================
// GRID CLICK HANDLER (.memory-card)
// ============================
document.querySelectorAll(".memory-card").forEach((card) => {
  card.addEventListener("click", () => {
    const media = card.querySelector(".memory-media");
    const text = card.querySelector(".memory-text")?.textContent?.trim() || "";
    const isImg = media.tagName === "IMG";

    openViewer({
      type: isImg ? "img" : "video",
      src: media.getAttribute("src"),
      text,
    });
  });
});

// ============================
// BOTTOM REEL CLICK HANDLER (.reel-item)
// ============================
document.querySelectorAll(".reel-item").forEach((item) => {
  item.addEventListener("click", () => {
    openViewer({
      type: item.dataset.type,
      src: item.dataset.src,
      text: item.dataset.text || "",
    });
  });
});
