const stage = document.querySelector(".letter-stage");
const openButton = document.getElementById("openButton");
const musicButton = document.getElementById("musicButton");
const hint = document.getElementById("hint");
const letterCopy = document.getElementById("letterCopy");

const paragraphs = [
  "Selamat Hari Guru! 💐",
  "Terima kasih sudah mau menjadi wali kelas kami. Terima kasih juga sudah membimbing, mengajari, dan sabar menghadapi kami selama ini.",
  "Kami mungkin belum selalu menjadi murid yang sempurna. Terkadang kami melakukan kesalahan, membuat Ibu kesal, atau belum mendengarkan nasihat Ibu dengan baik.",
  "Untuk semua kesalahan kami, kami mohon maaf ya, Bu.",
  "Kami sayang sama Bu Dea. Semoga Bu Dea selalu sehat, bahagia, dan diberikan kesabaran serta kebahagiaan dalam setiap langkahnya.",
  "Terima kasih sudah menjadi bagian dari perjalanan kami."
];

let opened = false;
let audioContext = null;
let musicTimer = null;
let musicOn = false;
let noteIndex = 0;
let masterGain = null;

// A small original melody synthesized in the browser; no external audio or copyrighted recording.
const melody = [
  [523.25, 0.55], [659.25, 0.55], [783.99, 0.8], [659.25, 0.55],
  [587.33, 0.55], [659.25, 0.55], [698.46, 0.8], [587.33, 0.75],
  [523.25, 0.55], [587.33, 0.55], [659.25, 0.9], [523.25, 0.9],
  [493.88, 0.55], [587.33, 0.55], [659.25, 1.0], [587.33, 1.0]
];

function typeParagraphs() {
  letterCopy.innerHTML = "";
  let paragraphIndex = 0;

  function nextParagraph() {
    if (paragraphIndex >= paragraphs.length) return;
    const p = document.createElement("p");
    letterCopy.appendChild(p);
    const text = paragraphs[paragraphIndex];
    let charIndex = 0;

    function typeCharacter() {
      if (charIndex < text.length) {
        p.textContent += text.charAt(charIndex++);
        window.setTimeout(typeCharacter, 23);
      } else {
        paragraphIndex++;
        window.setTimeout(nextParagraph, 260);
      }
    }
    typeCharacter();
  }
  nextParagraph();
}

function playNote(frequency, duration) {
  if (!audioContext || !masterGain || !musicOn) return;
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const overtone = audioContext.createOscillator();
  const noteGain = audioContext.createGain();
  const overtoneGain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  overtone.type = "triangle";
  overtone.frequency.setValueAtTime(frequency * 2, now);

  noteGain.gain.setValueAtTime(0.0001, now);
  noteGain.gain.exponentialRampToValueAtTime(0.13, now + 0.035);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  overtoneGain.gain.setValueAtTime(0.0001, now);
  overtoneGain.gain.exponentialRampToValueAtTime(0.018, now + 0.025);
  overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.65);

  oscillator.connect(noteGain);
  overtone.connect(overtoneGain);
  noteGain.connect(masterGain);
  overtoneGain.connect(masterGain);
  oscillator.start(now);
  overtone.start(now);
  oscillator.stop(now + duration + 0.03);
  overtone.stop(now + duration + 0.03);
}

async function startMusic() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    hint.textContent = "Browser ini belum mendukung musik otomatis. Surat tetap bisa dibuka.";
    return;
  }
  if (!audioContext) {
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.20; // quiet background volume
    masterGain.connect(audioContext.destination);
  }
  await audioContext.resume();
  musicOn = true;
  musicButton.setAttribute("aria-pressed", "true");
  musicButton.innerHTML = '<span class="music-icon">♫</span> Musik: ON';
  clearInterval(musicTimer);
  playNote(melody[noteIndex][0], melody[noteIndex][1]);
  musicTimer = setInterval(() => {
    if (!musicOn) return;
    noteIndex = (noteIndex + 1) % melody.length;
    playNote(melody[noteIndex][0], melody[noteIndex][1]);
  }, 620);
}

function stopMusic() {
  musicOn = false;
  clearInterval(musicTimer);
  musicTimer = null;
  if (masterGain && audioContext) {
    masterGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.08);
  }
  musicButton.setAttribute("aria-pressed", "false");
  musicButton.innerHTML = '<span class="music-icon">♫</span> Musik: OFF';
}

openButton.addEventListener("click", async () => {
  if (!opened) {
    opened = true;
    stage.classList.add("open");
    openButton.innerHTML = 'Tutup surat <span>♡</span>';
    hint.textContent = "Semoga pesan kecil ini bisa membuat Bu Dea bahagia.";
    typeParagraphs();
    if (musicOn) await startMusic();
  } else {
    opened = false;
    stage.classList.remove("open");
    openButton.innerHTML = 'Buka surat <span>♡</span>';
    hint.textContent = "Suratnya tertutup lagi. Klik untuk membukanya kapan saja.";
  }
});

musicButton.addEventListener("click", async () => {
  if (musicOn) {
    stopMusic();
  } else {
    await startMusic();
  }
});
