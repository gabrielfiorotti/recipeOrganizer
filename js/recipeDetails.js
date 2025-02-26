// Get the recipeId from the URL query parameters
const params = new URLSearchParams(window.location.search);
const recipeId = params.get("recipeId");

if (recipeId) {
  db.collection("recipes")
    .doc(recipeId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const recipe = doc.data();
        displayRecipe(recipe);
      } else {
        document.getElementById("recipe-details").innerHTML =
          "<p>Recipe not found.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching recipe:", error);
      document.getElementById("recipe-details").innerHTML =
        "<p>Error loading recipe.</p>";
    });
} else {
  document.getElementById("recipe-details").innerHTML =
    "<p>No recipe selected.</p>";
}

function displayRecipe(recipe) {
  const container = document.getElementById("recipe-details");
  container.innerHTML = `
      <h2>${recipe.name}</h2>
      <img src="${recipe.imageURL}" alt="${recipe.name}" />
      <br>
      <p><strong>Meal Type:</strong> ${recipe.mealType}</p>
      <br>
      <p><strong>Ingredients:</strong> <span id="ingredients-display">${
        recipe.ingredients || ""
      }</span></p>
      <br>
      <p><strong>Instructions:</strong> <span id="instructions-display">${
        recipe.instructions || ""
      }</span></p>
      <br>
      <div id="edit-form-container" style="display: none;">
        <h3>Edit Recipe</h3>
        <form id="edit-form">
          <label>
            Ingredients:<br/>
            <textarea id="ingredients-input">${
              recipe.ingredients || ""
            }</textarea>
          </label><br/>
          <label>
            Instructions:<br/>
            <textarea id="instructions-input">${
              recipe.instructions || ""
            }</textarea>
          </label><br/>
          <button type="submit">Save Changes</button>
          <button type="button" id="cancel-edit">Cancel</button>
        </form>
      </div>
      <div class="buttons">
        <button id="edit-btn" class="controlBtn">Edit</button>
        <button id="delete-btn" class="controlBtn">Delete</button>
        <button id="favorite-btn" class="controlBtn">Mark as Favorite</button>
      </div>
    `;

  // Edit button: show the edit form
  document.getElementById("edit-btn").addEventListener("click", () => {
    const user = firebase.auth().currentUser;
    if (!user) {
      alert("You must be signed in to edit recipes.");
      return;
    }
    document.getElementById("edit-form-container").style.display = "block";
  });

  // Cancel button: hide the edit form
  document.getElementById("cancel-edit").addEventListener("click", () => {
    document.getElementById("edit-form-container").style.display = "none";
  });

  // Handle the form submission to update the recipe in Firestore
  document.getElementById("edit-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const newIngredients = document.getElementById("ingredients-input").value;
    const newInstructions = document.getElementById("instructions-input").value;

    db.collection("recipes")
      .doc(recipeId)
      .update({
        ingredients: newIngredients,
        instructions: newInstructions,
      })
      .then(() => {
        document.getElementById("ingredients-display").innerText =
          newIngredients;
        document.getElementById("instructions-display").innerText =
          newInstructions;
        document.getElementById("edit-form-container").style.display = "none";
        alert("Recipe updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating recipe:", error);
        alert(
          "Failed to update recipe. Please try again. \nNote: you must be logged in to edit a recipe."
        );
      });
  });

  // Delete button: confirm and delete the recipe from Firestore
  document.getElementById("delete-btn").addEventListener("click", () => {
    const user = firebase.auth().currentUser;
    if (!user) {
      alert("You must be signed in to delete recipes.");
      return;
    }
    if (
      confirm(
        "Are you sure you want to delete this recipe? This action cannot be undone."
      )
    ) {
      db.collection("recipes")
        .doc(recipeId)
        .delete()
        .then(() => {
          alert("Recipe deleted successfully!");
          window.location.href = "recipesPage.html";
        })
        .catch((error) => {
          console.error("Error deleting recipe:", error);
          alert("Failed to delete recipe. Please try again.");
        });
    }
  });

  document.getElementById("favorite-btn").addEventListener("click", () => {
    // Get the current user from Firebase Auth
    const user = firebase.auth().currentUser;
    if (!user) {
      alert("You must be signed in to mark favorites.");
      return;
    }

    db.collection("users")
      .doc(user.uid)
      .collection("favorites")
      .doc(recipeId)
      .set({
        recipeId: recipeId,
        name: recipe.name,
        imageURL: recipe.imageURL,
        mealType: recipe.mealType,
      })
      .then(() => {
        alert("Recipe marked as favorite!");
      })
      .catch((error) => {
        console.error("Error marking favorite:", error);
        alert("Failed to mark as favorite. Please try again.");
      });
  });
}
