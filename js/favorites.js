firebase.auth().onAuthStateChanged((user) => {
  const recipesContainer = document.getElementById("recipes-container");
  recipesContainer.innerHTML = "";

  if (user) {
    db.collection("users")
      .doc(user.uid)
      .collection("favorites")
      .get()
      .then((querySnapshot) => {
        // Check if there are any favorites
        if (querySnapshot.empty) {
          recipesContainer.innerHTML =
            "<p>You haven't added any favorite recipes yet.</p>";
          return;
        }
        querySnapshot.forEach((doc) => {
          const recipe = doc.data();

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
            window.location.href = `recipeDetails.html?recipeId=${recipe.recipeId}`;
          });

          recipesContainer.appendChild(recipeCard);
        });
      })
      .catch((error) => {
        console.error("Error fetching favorites:", error);
      });
  } else {
    recipesContainer.innerHTML =
      "You must be signed in to see your favorites recipes.";
  }
});
