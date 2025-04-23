// Game Variables
let stash = 5;
let plantsOwned = 0;
let prestigePoints = 0;
let prestigeLevel = 0;
let availablePlants = [];
let plantStrains = [];

const plantTypes = [
  { name: "Basic Weed", baseCost: 5, baseGrowthTime: 2, growthRate: 1, multiplier: 1 },
  { name: "Purple Haze", baseCost: 10, baseGrowthTime: 4, growthRate: 1.5, multiplier: 1.2 },
  { name: "Blue Dream", baseCost: 20, baseGrowthTime: 5, growthRate: 2, multiplier: 1.5 },
  { name: "OG Kush", baseCost: 25, baseGrowthTime: 6, growthRate: 2.5, multiplier: 1.8 },
  { name: "White Widow", baseCost: 40, baseGrowthTime: 8, growthRate: 3, multiplier: 2 },
  { name: "Northern Lights", baseCost: 50, baseGrowthTime: 10, growthRate: 3.5, multiplier: 2.5 },
  { name: "Gorilla Glue", baseCost: 60, baseGrowthTime: 12, growthRate: 4, multiplier: 3 },
  { name: "Sour Diesel", baseCost: 70, baseGrowthTime: 15, growthRate: 4.5, multiplier: 3.5 },
  { name: "Green Crack", baseCost: 80, baseGrowthTime: 18, growthRate: 5, multiplier: 4 },
  { name: "Banana Kush", baseCost: 90, baseGrowthTime: 20, growthRate: 5.5, multiplier: 4.5 },
  { name: "Lemon Haze", baseCost: 95, baseGrowthTime: 22, growthRate: 6, multiplier: 5 },
  { name: "Jack Herer", baseCost: 100, baseGrowthTime: 24, growthRate: 6.5, multiplier: 5.5 },
  { name: "Amnesia Haze", baseCost: 110, baseGrowthTime: 26, growthRate: 7, multiplier: 6 },
  { name: "Maui Wowie", baseCost: 120, baseGrowthTime: 28, growthRate: 7.5, multiplier: 6.5 },
  { name: "Chemdawg", baseCost: 130, baseGrowthTime: 30, growthRate: 8, multiplier: 7 },
  { name: "Strawberry Cough", baseCost: 140, baseGrowthTime: 32, growthRate: 8.5, multiplier: 7.5 },
  { name: "Pineapple Express", baseCost: 150, baseGrowthTime: 34, growthRate: 9, multiplier: 8 },
  { name: "Cherry Pie", baseCost: 160, baseGrowthTime: 36, growthRate: 9.5, multiplier: 8.5 },
  { name: "Trainwreck", baseCost: 170, baseGrowthTime: 38, growthRate: 10, multiplier: 9 },
  { name: "Skywalker OG", baseCost: 180, baseGrowthTime: 40, growthRate: 10.5, multiplier: 9.5 },
  { name: "Cinderella 99", baseCost: 190, baseGrowthTime: 42, growthRate: 11, multiplier: 10 }
];

let idleGrowthInterval;

function initGame() {
  plantStrains = [];
  plantTypes.forEach((plant) => {
    plantStrains.push({
      ...plant,
      quantity: 0,
      totalGrowthTime: plant.baseGrowthTime,
      currentGrowthTime: plant.baseGrowthTime
    });
  });
  updateUI();
  idleGrowth();
}

function growPlant(index) {
  const plant = plantStrains[index];
  if (stash >= plant.baseCost) {
    stash -= plant.baseCost;
    plant.quantity += 1;
    startPlantGrowth(plant);
    plantsOwned += 1;
    updateUI();
  } else {
    alert("Not enough stash to grow this plant!");
  }
}

function startPlantGrowth(plant) {
  plant.currentGrowthTime = plant.totalGrowthTime;
  const growthInterval = setInterval(() => {
    plant.currentGrowthTime -= plant.growthRate;
    if (plant.currentGrowthTime <= 0) {
      clearInterval(growthInterval);
      stash += plant.quantity * plant.multiplier;
      updateUI();
    }
  }, 1000);
}

function idleGrowth() {
  idleGrowthInterval = setInterval(() => {
    plantStrains.forEach((plant) => {
      if (plant.quantity > 0) {
        plant.currentGrowthTime -= plant.growthRate;
        if (plant.currentGrowthTime <= 0) {
          stash += plant.quantity * plant.multiplier;
          plant.currentGrowthTime = plant.totalGrowthTime;
        }
      }
    });
    updateUI();
  }, 1050);
}

function updateUI() {
  document.getElementById("stash").textContent = stash.toFixed(2);
  document.getElementById("plantsOwned").textContent = plantsOwned;

  const plantsSection = document.getElementById("plantsSection");
  plantsSection.innerHTML = "";

  plantStrains.forEach((plant, index) => {
    const plantElement = document.createElement("div");
    plantElement.innerHTML = `
      <div><strong>${plant.name}</strong></div>
      <div>Cost: ${plant.baseCost}g</div>
      <div>Owned: ${plant.quantity}</div>
      <div>Growth: ${plant.currentGrowthTime.toFixed(2)}s</div>
      <button onclick="growPlant(${index})">Grow ${plant.name}</button>
    `;
    plantsSection.appendChild(plantElement);
  });

  const prestigeButton = document.getElementById("prestigeButton");
  prestigeButton.disabled = stash < 10000;

  if (prestigeLevel > 0) {
    document.getElementById("prestigeLevel").style.display = "block";
    document.getElementById("prestigeLevelValue").textContent = prestigeLevel;
    document.getElementById("prestigeShop").style.display = "block";
  }
}

function prestige() {
  if (stash >= 10000) {
    prestigePoints += 1;
    prestigeLevel += 1;
    stash = 5;
    plantsOwned = 0;
    initGame();
    updateUI();
  }
}

function buyPrestigeUpgrade(upgradeType) {
  if (upgradeType === 'speedBoost' && prestigePoints >= 1) {
    plantStrains.forEach(plant => {
      plant.growthRate += 0.5;
    });
    prestigePoints -= 1;
    alert("Speed Boost Purchased!");
  } else if (upgradeType === 'stashBoost' && prestigePoints >= 2) {
    stash += 1000;
    prestigePoints -= 2;
    alert("Stash Boost Purchased!");
  } else {
    alert("Not enough Prestige Points or invalid upgrade!");
  }
  updateUI();
}

// Konami Code Easter Egg
let konamiCode = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a"
];
let konamiIndex = 0;

document.addEventListener("keydown", function (e) {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      activateSnoopDoggEasterEgg();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function activateSnoopDoggEasterEgg() {
  alert("🎤 Snoop D-O-Double-G has entered the game!");

  stash += 420;
  prestigePoints += 1;

  plantTypes.push({
    name: "Snoop's Chronic",
    baseCost: 420,
    baseGrowthTime: 15,
    growthRate: 6.9,
    multiplier: 10.0
  });

  initGame();

  document.body.style.backgroundImage = "url('https://media.giphy.com/media/l0MYwONBGDS7aPGOk/giphy.gif')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center";

  const snoopAudio = new Audio("https://www.myinstants.com/media/sounds/snoop-dogg-smoke-weed-everyday.mp3");
  snoopAudio.play();

  setTimeout(() => {
    document.body.style.backgroundImage = "";
    alert("Snoop D-O-Double-G has left the building.");
  }, 10000);
}

// Start the game
initGame();
