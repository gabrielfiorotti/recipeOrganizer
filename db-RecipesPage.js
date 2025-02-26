let allRecipes = []; // Store all fetched recipes
let filteredRecipes = []; // Store filtered recipes

// Fetch and display recipes
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

// Generate a recipe card
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

  // When a card is clicked, go to the details page with the recipe's id
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
