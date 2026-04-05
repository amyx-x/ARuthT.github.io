// Disable right click globally
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Extra protection for category cards
document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
});

// Disable dragging
document.querySelectorAll("img, video").forEach((el) => {
  el.setAttribute("draggable", "false");
});
document.querySelectorAll(".slideshow").forEach((slideshow) => {
  
  const slides = slideshow.querySelectorAll(".slide");
  const prevBtn = slideshow.querySelector(".prev");
  const nextBtn = slideshow.querySelector(".next");

  let current = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  if (slides.length > 0) {
    showSlide(current);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      current = (current - 1 + slides.length) % slides.length;
      showSlide(current);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      current = (current + 1) % slides.length;
      showSlide(current);
    });
  }
});