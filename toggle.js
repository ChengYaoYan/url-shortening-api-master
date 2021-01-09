const toggleBtn = document.querySelector(".toggle-btn");

toggleBtn.addEventListener("click", () => {
  const linksContainer = document.querySelector(".links-container");

  if (linksContainer.classList.contains("show-links")) {
    linksContainer.classList.remove("show-links");
  } else {
    linksContainer.classList.add("show-links");
  }
});
