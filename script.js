// ======== DATABASE =====================/

const firebaseConfig = {
  apiKey: "AIzaSyAQVcuh2XO86wlr8EnCi4-65HPRzQ76ijg",
  authDomain: "recipeorganizer-c4bb3.firebaseapp.com",
  projectId: "recipeorganizer-c4bb3",
  storageBucket: "recipeorganizer-c4bb3.firebasestorage.app",
  messagingSenderId: "22010285353",
  appId: "1:22010285353:web:efa1bccf7aeb47faeb3b38",
};

// Use the global firebase object (from the compat CDN)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fetch and display recipes
async function fetchRecipes() {
  const recipesContainer = document.getElementById("recipes-container");
  recipesContainer.innerHTML = "<p>Loading...</p>";

  try {
    const querySnapshot = await db.collection("recipes").get();
    recipesContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const recipe = doc.data();
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("card");

      console.log(recipe.imageURL);
      recipeCard.innerHTML = `
          <img src="${recipe.imageURL}" alt="${recipe.name}" class="card-img" />
          <div class="card-info">
            <h2>${recipe.name}</h2>
            <p>${recipe.mealType}</p>
          </div>
          <img src="./assets/star.svg" alt="star" class="card-star" />
        `;

      recipesContainer.appendChild(recipeCard);
    });

    if (querySnapshot.empty) {
      recipesContainer.innerHTML = "<p>No recipes found.</p>";
    }
  } catch (error) {
    recipesContainer.innerHTML = `<p>Error loading recipes: ${error.message}</p>`;
    console.error("Error fetching recipes:", error);
  }
}

// Fetch recipes on page load
fetchRecipes();

// ========== header nav links hamburguer menu ============= //

const navLinks = document.getElementById("nav-links");

const btnHeader = document.getElementById("btn-header");

btnHeader.addEventListener("click", () => {
  navLinks.classList.toggle("visible");
  navLinks.classList.toggle("closed");
});
