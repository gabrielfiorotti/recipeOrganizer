//function to upload img and return a URL to the img
async function uploadImageToImgBB(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    "https://api.imgbb.com/1/upload?key=245d18adb55db4da4d1340f8a3ad980d",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  console.log("ImgBB Response:", data); // Debugging

  if (!data.success) {
    throw new Error("Failed to upload image to ImgBB");
  }

  const imageDirectLink = data.data.url;

  return imageDirectLink;
}

// Function to handle form submission
document
  .getElementById("recipe-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById("recipe-name").value;
    const ingredients = document.getElementById("ingredients").value;
    const instructions = document.getElementById("instructions").value;
    const fileInput = document.getElementById("recipe-image");
    const mealType = document.getElementById("mealType").value;

    if (!fileInput.files.length) {
      alert("Please select an image.");
      return;
    }

    const imageFile = fileInput.files[0];

    try {
      // Upload image to ImgBB
      const imageURL = await uploadImageToImgBB(imageFile);
      console.log("return that Im receiving to add in the DB:", imageURL);

      // Save recipe data to Firestore
      await db.collection("recipes").add({
        name,
        ingredients,
        instructions,
        imageURL,
        mealType,
      });

      alert("Recipe added successfully!");
      document.getElementById("recipe-form").reset();
    } catch (error) {
      console.error("Error uploading image or saving recipe:", error);
      alert(
        "Failed to add recipe. Please try again. \n Note: you must be logged in to add a new recipe."
      );
    }
  });
