// ====================== GOOGLE LOG IN =============================== //

// Get the Google sign-in button element
const googleBtn = document.getElementById("google-signin-btn");

// Set up the Google Auth provider
const provider = new firebase.auth.GoogleAuthProvider();

// Handle sign-in on button click
googleBtn.addEventListener("click", () => {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      // The signed-in user info.
      const user = result.user;
      console.log("User signed in:", user);
      // Redirect to the main app page (e.g., recipesPage.html)
      window.location.href = "recipesPage.html";
    })
    .catch((error) => {
      console.error("Error during sign-in:", error);
      alert("Authentication failed. Please try again.");
    });
});
