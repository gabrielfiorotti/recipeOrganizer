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

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // The user is signed in.
    console.log("User is logged in:", user);
    // You can store user details in a global variable or update the UI accordingly.
  } else {
    // No user is signed in.
    console.log("User is not logged in");
    // Optionally, redirect to the login page:
    //window.location.href = "login.html";
  }
});
