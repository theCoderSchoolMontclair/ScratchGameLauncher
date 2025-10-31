function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const subpages = ["Scratch", "PixelPad", "Godot"];
let currentPage = 0;


function generateLinks() {
  const container = document.getElementById("fileLinks");
  container.innerHTML = "";

  const filtered = fileNames.files.filter(
    (file) => file.category && file.category.toLowerCase() === subpages[currentPage].toLowerCase()
  );

  for (const fileName of filtered) {
    const list = document.createElement("li");
    const link = document.createElement("a");
    link.href = fileName.path;
    link.setAttribute("thumbnail", fileName.thumbnailpath);
    link.textContent = fileName.name;
    list.appendChild(link);
    container.appendChild(list);
  }

  requestAnimationFrame(() => setupNavigation());
}


function setupNavigation() {
  const li_elements = document.querySelectorAll("#fileLinks li");
  const elements = document.querySelectorAll("#fileLinks a");
  const gameimage = document.getElementById("gameimage");

  if (li_elements.length === 0) return;

  let currentIndex = 0;
  const total = li_elements.length;

  const depth = 250 + Math.min(total * 5, 200);
  const verticalSpread = 140 + Math.min(total * 3, 150);
  const angleStep = 360 / total;
  const spinSpeed = 0.18;
  let currentAngle = 0;
  let targetAngle = 0;
  let isSpinning = false;

  li_elements.forEach(li => {
    const link = li.querySelector("a");
    link.style.display = "block";
    link.style.textAlign = "center";
    link.style.whiteSpace = "normal";        
    link.style.wordBreak = "break-word";    
    link.style.lineHeight = "1.1em";
    link.style.maxWidth = "70%";
    link.style.margin = "0 auto";
    link.style.fontSize = "0.9vw";      
  });

  function updateWheel() {
    li_elements.forEach((li, i) => {
      const angle = (i * angleStep + currentAngle) % 360;
      const rad = (angle * Math.PI) / 180;

      const y = Math.sin(rad) * verticalSpread;
      const z = Math.cos(rad) * depth;

      const opacity = Math.max(0, Math.cos(rad));
      li.style.transform = `translateY(${y}px) translateZ(${z}px)`;
      li.style.opacity = opacity;

      li.classList.remove("selected");
      li.style.transform += " scale(1)";
      const frontAngle = ((angle + 360) % 360);
      if (frontAngle < angleStep / 2 || frontAngle > 360 - angleStep / 2) {
        li.classList.add("selected");
        li.style.transform += " scale(1.05)";
        li.style.zIndex = "2";
      } else {
        li.style.zIndex = "1";
      }
    });
  }

  currentAngle = 0;
  targetAngle = 0;
  li_elements[0].classList.add("selected");
  elements[0].classList.add("selected");
  gameimage.src = elements[0].getAttribute("thumbnail");
  updateWheel();

  function spin(direction) {
    if (isSpinning) return;
    isSpinning = true;

    currentIndex = (currentIndex + direction + total) % total;
    targetAngle -= direction * angleStep;

    const startAngle = currentAngle;
    let progress = 0;

    function animate() {
      progress += spinSpeed;
      if (progress >= 1) progress = 1;

      const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
      currentAngle = startAngle + (targetAngle - startAngle) * ease;
      updateWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        currentAngle = targetAngle;
        updateWheel();
        isSpinning = false;

        const selected = document.querySelector("#fileLinks li.selected a");
        if (selected) {
          gameimage.classList.add("fade-out");
          setTimeout(() => {
            gameimage.src = selected.getAttribute("thumbnail");
            gameimage.classList.remove("fade-out");
            gameimage.classList.add("fade-in");
            setTimeout(() => gameimage.classList.remove("fade-in"), 400);
          }, 150);
        }
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "s") spin(1);
    else if (e.key === "ArrowUp" || e.key === "w") spin(-1);
    else if (e.key === "Enter") {
      const selected = document.querySelector("#fileLinks li.selected a");
      if (selected) selected.click();
    }
  });
}


window.onload = () => {
  const logoDiv = document.querySelector(".logo_div");
  if (logoDiv && !document.getElementById("pageLabel")) {
    const label = document.createElement("div");
    label.id = "pageLabel";
    label.textContent = subpages[currentPage];
    label.style.marginTop = "1vh";
    label.style.textAlign = "center";
    label.style.fontSize = "2vw";
    label.style.color = "#00ff00";
    label.style.textShadow = "0 0 10px #00ff00";
    label.style.fontWeight = "bold";
    logoDiv.insertAdjacentElement("afterend", label);
  }

  document.querySelector(".flexcontainer").style.opacity = "0";
  generateLinks();

  setTimeout(() => {
    document.querySelector(".flexcontainer").style.transition = "opacity 0.5s ease";
    document.querySelector(".flexcontainer").style.opacity = "1";
  }, 200);
};

window.addEventListener("keydown", function(e) {
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
    e.preventDefault();
  }
}, false);

function swapPage(direction) {
  const flex = document.querySelector(".flexcontainer");
  flex.style.transition = "opacity 0.4s ease";
  flex.style.opacity = "0";

  setTimeout(() => {
    currentPage = (currentPage + direction + subpages.length) % subpages.length;

    const label = document.getElementById("pageLabel");
    if (label) label.textContent = subpages[currentPage];

    const container = document.getElementById("fileLinks");
    container.innerHTML = "";

    const filteredGames = fileNames.files.filter(
      (f) => f.category === subpages[currentPage]
    );

    filteredGames.forEach((fileName) => {
      const list = document.createElement("li");
      const link = document.createElement("a");
      link.setAttribute("href", fileName.path);
      link.setAttribute("thumbnail", fileName.thumbnailpath);
      link.textContent = fileName.name;
      list.appendChild(link);
      container.appendChild(list);
    });

    container.offsetHeight;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setupNavigation();   
        flex.style.opacity = "1";
      });
    });
  }, 350);
}



window.addEventListener("keydown", (e) => {
  if (e.key === "a" || e.key === "ArrowLeft") swapPage(-1);
  else if (e.key === "d" || e.key === "ArrowRight") swapPage(1);
});
