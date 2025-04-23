// Game Variables
let stash = 5; // Start with 5g stash
let plantsOwned = 0; // Plants initially owned
let prestigePoints = 0; // Prestige points starting out
let prestigeLevel = 0; // Add Prestige Level
let availablePlants = [];
let plantStrains = [];

// Plant Strain Configuration
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

// Game Initialization
function initGame() {
  plantTypes.forEach((plant, index) => {
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

// Plant Growing Logic
function growPlant(index) {
  const plant = plantStrains[index];

  console.log("Stash: " + stash);  // Debugging stash
  console.log("Plant Cost: " + plant.baseCost);  // Debugging plant cost

  // Check if enough stash to grow the plant
  if (stash >= plant.baseCost) {
    stash -= plant.baseCost;
    plant.quantity += 1;
    startPlantGrowth(plant);
    plantsOwned += 1; // Increment the total plants owned after growing
    updateUI();
  } else {
    alert("Not enough stash to grow this plant!");
  }
}

function startPlantGrowth(plant) {
  plant.currentGrowthTime = plant.totalGrowthTime;

  // Reduce growth time based on growth rate and multiplier
  const growthInterval = setInterval(() => {
    plant.currentGrowthTime -= plant.growthRate;
    if (plant.currentGrowthTime <= 0) {
      clearInterval(growthInterval);
      stash += plant.quantity * plant.multiplier; // Add stash based on quantity and multiplier
      updateUI();
    }
  }, 1000);
}

// Idle Growth for All Plants
function idleGrowth() {
  idleGrowthInterval = setInterval(() => {
    plantStrains.forEach((plant) => {
      if (plant.quantity > 0) {
        // Decrease growth time based on growth rate
        plant.currentGrowthTime -= plant.growthRate;

        // If growth is complete, reset time and add stash
        if (plant.currentGrowthTime <= 0) {
          stash += plant.quantity * plant.multiplier; // Add stash based on multiplier
          plant.currentGrowthTime = plant.totalGrowthTime; // Reset growth time for idle growth
        }
      }
    });
    updateUI();
  }, 1050); // Update every 1.5 second
}

// Update the UI
function updateUI() {
  document.getElementById("stash").textContent = stash.toFixed(2);  // Round stash to 2 decimal places
  document.getElementById("plantsOwned").textContent = plantsOwned;

  const plantsSection = document.getElementById("plantsSection");
  plantsSection.innerHTML = "";

  plantStrains.forEach((plant, index) => {
    const plantElement = document.createElement("div");
    plantElement.innerHTML = `
      <div><strong>${plant.name}</strong></div>
      <div>Cost: ${plant.baseCost}g</div>
      <div>Owned: ${plant.quantity}</div>
      <div>Growth: ${plant.currentGrowthTime}s</div>
      <button onclick="growPlant(${index})">Grow ${plant.name}</button>
    `;
    plantsSection.appendChild(plantElement);
  });

  // Enable/Disable prestige button based on stash
  const prestigeButton = document.getElementById("prestigeButton");
  if (stash >= 10000) {
    prestigeButton.disabled = false;  // Enable the button
  } else {
    prestigeButton.disabled = true;  // Keep the button disabled
  }

  // Show Prestige Level and the Prestige Shop if player has prestiged
  if (prestigeLevel > 0) {
    document.getElementById("prestigeLevel").style.display = "block";
    document.getElementById("prestigeLevelValue").textContent = prestigeLevel;
    document.getElementById("prestigeShop").style.display = "block";
  }
}

// Prestige System Logic
function prestige() {
  if (stash >= 10000) {
    prestigePoints += 1;
    prestigeLevel += 1;  // Increase Prestige Level
    stash = 5;           // Reset stash after prestige
    plantsOwned = 0;     // Reset plants owned
    plantStrains = [];   // Reset plant strains after prestige
    initGame();          // Reinitialize game with prestige boost
    updateUI();          // Update the UI with the new prestige info
  }
}

// Buy Prestige Upgrade (Speed Boost or Stash Boost)
function buyPrestigeUpgrade(upgradeType) {
  if (upgradeType === 'speedBoost' && prestigePoints >= 1) {
    // Apply speed boost upgrade (e.g., speed up plant growth)
    plantStrains.forEach(plant => {
      plant.growthRate += 0.5; // Example of a speed boost
    });
    prestigePoints -= 1;  // Spend one Prestige Point
    alert("Speed Boost Purchased! Growth rate increased.");
  } else if (upgradeType === 'stashBoost' && prestigePoints >= 2) {
    // Apply stash boost upgrade (e.g., increase stash multiplier)
    stash += 1000; // Give 1000 stash as a boost (just an example)
    prestigePoints -= 2;  // Spend two Prestige Points
    alert("Stash Boost Purchased! Gained 1000 stash.");
  } else {
    alert("Not enough Prestige Points or invalid upgrade!");
  }

  updateUI();  // Update UI after purchasing an upgrade
}

// Game Initialization
initGame();
