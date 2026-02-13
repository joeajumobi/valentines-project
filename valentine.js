// Elements
const envelope = document.getElementById("envelop-container");
const letter = document.getElementById("letter-container");

const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".yes-btn");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

const collageBtn = document.getElementById("collage-btn");

// Click Envelope
envelope.addEventListener("click", () => {
  envelope.style.display = "none";
  letter.style.display = "flex";

  setTimeout(() => {
    document.querySelector(".letter-window").classList.add("open");
  }, 50);
});

// Move NO button on hover
noBtn.addEventListener("mouseover", () => {
  // distance range
  const min = 160;
  const max = 240;

  const distance = Math.random() * (max - min) + min;
  const angle = Math.random() * Math.PI * 2;

  const moveX = Math.cos(angle) * distance;
  const moveY = Math.sin(angle) * distance;

  noBtn.style.transition = "transform 0.3s ease";
  noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

// Make YES button grow when NO is clicked
let yesScale = 1;

noBtn.addEventListener("click", () => {
  yesScale += 0.25;

  if (yesBtn.style.position !== "fixed") {
    yesBtn.style.position = "fixed";
    yesBtn.style.top = "50%";
    yesBtn.style.left = "50%";
  }

  yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
});

// YES clicked
yesBtn.addEventListener("click", () => {
  title.textContent = "Yippeeee!";
  catImg.src = "kitty.gif";

  buttons.style.display = "none";
  finalText.style.display = "block";

  // show click me button next to cat
  collageBtn.style.display = "inline-block";
});

// Click Me -> go to collage page
collageBtn.addEventListener("click", () => {
  window.location.href = "collage.html";
});
