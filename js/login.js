// ====================== GOOGLE LOG IN =============================== //

const googleBtn = document.getElementById("google-signin-btn");

// Set up the Google Auth provider
const provider = new firebase.auth.GoogleAuthProvider();

googleBtn.addEventListener("click", () => {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      console.log("User signed in:", user);
      window.location.href = "recipesPage.html";
    })
    .catch((error) => {
      console.error("Error during sign-in:", error);
      alert("Authentication failed. Please try again.");
    });
});
