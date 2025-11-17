/*
 *  __  __                _             _              
 * |  \/  | ___ _ __ __ _(_)_ __   __ _| |_ ___  _ __  
 * | |\/| |/ _ \ '__/ _` | | '_ \ / _` | __/ _ \| '_ \ 
 * | |  | |  __/ | | (_| | | | | | (_| | || (_) | | | |
 * |_|  |_|\___|_|  \__, |_|_| |_|\__, |\__\___/|_| |_|
 *                  |___/         |___/                
 *  _   _ _       _       ____       _                 _ 
 * | | | (_) __ _| |__   / ___|  ___| |__   ___   ___ | |
 * | |_| | |/ _` | '_ \  \___ \ / __| '_ \ / _ \ / _ \| |
 * |  _  | | (_| | | | |  ___) | (__| | | | (_) | (_) | |
 * |_| |_|_|\__, |_| |_| |____/ \___|_| |_|\___/ \___/|_|
 *          |___/                                         
 *  _____ _                                  _ _   _           
 * | ____| | ___ __   ___   ___  _   _ _ __| | |_(_) ___  ___ 
 * |  _| | |/ __\ \ / / | | / _ \| | | | '__| | __| |/ _ \/ __|
 * | |___| | (__ \ V /| |_| | (_) | |_| | |  | | |_| |  __/\__ \
 * |_____|_|\___| \_/  \__,_|\___/ \__,_|_|  |_|\__|_|\___||___/
 */

document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // ASCII art for different activities
      const activityArt = {
        "Chess Club": `
   ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜
   ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟
   · · · · · · · ·
   · · · · · · · ·
   · · · · · · · ·
   · · · · · · · ·
   ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙
   ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖`,
        "Drama Club": `
      .-"""-.
     /       \\
     \\       /
  .-'  .:::.  '-.
 '    .::::::.    '
'    :::::::::::   '
 '-.:::::::::::.-'
    '::::::::'
      ':::::'
        '::`,
        "Robotics Team": `
    ___
   |_|_|
   |_|_|      _____
   |_|_|   __|[_]|__
   |_|_|  |[] [] []|
 _.l___j__\\      /
|___________\\____/`,
        "Debate Society": `
    _______________
   /               \\
  |  ⚖️  DEBATE  ⚖️  |
  |  Pro vs Con   |
   \\_______________/
      |       |
     /         \\`,
        "Environmental Club": `
      🌍
     /|\\
    / | \\
   🌱 🌳 🌻
  ♻️  ♻️  ♻️`,
        "Basketball Team": `
      ___
     /   \\
    |  🏀 |
     \\___/
      | |
     /   \\
    |     |
   👟   👟`,
        "Photography Club": `
   ___________
  |  _______  |
  | |       | |
  | | 📷    | |
  | |_______| |
  |___________|
     |     |`,
        "Coding Club": `
   < CODE />
    ________
   /        \\
  /  { }    \\
 |   [ ]     |
 |   ( )     |
  \\  ===    /
   \\______/`
      };

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Create participants list
        const participantsList = details.participants.length > 0
          ? `<ul class="participants-list">${details.participants.map(email => `<li>${email}</li>`).join('')}</ul>`
          : '<p class="no-participants">No participants yet</p>';

        // Get ASCII art for this activity, or use a default
        const asciiArt = activityArt[name] || `
    ⭐ ${name} ⭐`;

        activityCard.innerHTML = `
          <pre class="ascii-art">${asciiArt}</pre>
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <div class="participants-section">
            <p><strong>Participants:</strong></p>
            ${participantsList}
          </div>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
