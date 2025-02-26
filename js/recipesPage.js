let allRecipes = [];
let filteredRecipes = [];

async function fetchRecipes() {
  const recipesContainer = document.getElementById("recipes-container");
  recipesContainer.innerHTML = "<p>Loading...</p>";

  try {
    if (allRecipes.length === 0) {
      const querySnapshot = await db.collection("recipes").get();
      // Include the document id along with the recipe data
      allRecipes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    const filteredValue = document.getElementById("selectInput").value;
    filteredRecipes =
      filteredValue === "All" || !filteredValue
        ? allRecipes
        : allRecipes.filter((recipe) => recipe.mealType === filteredValue);

    recipesContainer.innerHTML = "";

    if (filteredRecipes.length === 0) {
      recipesContainer.innerHTML = "<p>No recipes found.</p>";
    } else {
      filteredRecipes.forEach((recipe) => {
        // Pass the recipe id to the card creator
        const recipeCard = createRecipeCard(recipe);
        recipesContainer.appendChild(recipeCard);
      });
    }
  } catch (error) {
    recipesContainer.innerHTML = `<p>Error loading recipes: ${error.message}</p>`;
    console.error("Error fetching recipes:", error);
  }
}

function createRecipeCard(recipe) {
  const recipeCard = document.createElement("div");
  recipeCard.classList.add("card");
  recipeCard.innerHTML = `
    <img src="${recipe.imageURL}" alt="${recipe.name}" class="card-img"/>
    <div class="card-info">
      <h2>${recipe.name}</h2>
      <p>${recipe.mealType}</p>
    </div>
  `;

  recipeCard.addEventListener("click", () => {
    window.location.href = `recipeDetails.html?recipeId=${recipe.id}`;
  });

  return recipeCard;
}

// Fetch recipes on page load
fetchRecipes();

// ================= FILTER RECIPES BY TYPE ===================== //

//handle form submission
const formFilter = document.getElementById("form-filter");

formFilter.addEventListener("submit", function (event) {
  event.preventDefault();
  fetchRecipes();
});

// ========================= CHATBOX AI ================================= //

import { GoogleGenerativeAI } from "https://cdn.skypack.dev/@google/generative-ai";

let apiKey, genAI, model;

// Get the API key from Firestore
firebase
  .firestore()
  .collection("apikey")
  .doc("googlegenai")
  .get()
  .then((docSnapshot) => {
    if (docSnapshot.exists) {
      apiKey = docSnapshot.data().key;
      genAI = new GoogleGenerativeAI(apiKey);
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } else {
      console.error("API key document not found.");
    }
  })
  .catch((error) => {
    console.error("Error retrieving API key:", error);
  });

async function askChatBot(request) {
  try {
    if (!model) {
      throw new Error("Model is not initialized yet.");
    }
    const response = await model.generateContent(request);
    return response;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

function appendMessage(message) {
  const chatHistory = document.getElementById("chat-history");
  chatHistory.innerHTML += `<div>${message}</div>`;
}

function ruleChatBot(request) {
  const normalizedRequest = request.toLowerCase().trim();
  if (
    normalizedRequest === "what can i do with this app?" ||
    normalizedRequest === "what can i do with this app"
  ) {
    appendMessage(
      `<strong>AI:</strong><br/>
      - You can see a clean and organized list of recipes<br/>
      - You can add new recipes<br/>
      - You can edit and delete recipes<br/>
      - You can mark recipes as favorites<br/>
      Enjoy!`
    );
    return true;
  }
  return false;
}

// show/hide chat box container
document.getElementById("chatBtn").addEventListener("click", () => {
  const chatContainer = document.getElementById("chatbot-container");
  if (
    chatContainer.style.display === "none" ||
    chatContainer.style.display === ""
  ) {
    chatContainer.style.display = "block";
  } else {
    chatContainer.style.display = "none";
  }
});

// Handle sending a message via the chatbot.
document.getElementById("send-btn").addEventListener("click", async () => {
  const chatInput = document.getElementById("chat-input");
  const userRequest = chatInput.value.trim();

  if (!userRequest) return; // Exit if the input is empty.

  // Append the user's message to the chat history.
  appendMessage(`<strong>You:</strong> ${userRequest}`);

  // Check if the message matches our rule for the specific question.
  if (ruleChatBot(userRequest)) {
    chatInput.value = "";
    return;
  }

  // Otherwise, fall back to the generative AI response.
  try {
    const aiResponse = await askChatBot(userRequest);
    const aiText = aiResponse.response.candidates[0].content.parts[0].text;
    appendMessage(`<strong>AI:</strong> ${aiText}`);
  } catch (error) {
    console.error("Error generating AI response:", error);
    appendMessage(
      `<div class="error-message">Error: Failed to get a response from the chatbot.</div>`
    );
  }

  chatInput.value = "";
});
