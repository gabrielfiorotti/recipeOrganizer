// ========== header nav links hamburguer menu ============= //

const navLinks = document.getElementById("nav-links");

const btnHeader = document.getElementById("btn-header");

btnHeader.addEventListener("click", () => {
  navLinks.classList.toggle("visible");
  navLinks.classList.toggle("closed");
});
