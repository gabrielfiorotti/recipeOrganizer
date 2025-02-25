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

// ======================= GOOGLE LOG IN =============================== //

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
