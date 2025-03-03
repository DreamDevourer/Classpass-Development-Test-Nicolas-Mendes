const debugMode = true;

function log(message) {
  if (debugMode) {
    console.log(message);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.getElementById("navToggle");
  const navClose = document.getElementById("navClose");
  const mainNav = document.getElementById("mainNav");
  const header = document.querySelector("header");

  if (header.getAttribute("data-navigation") === "true") {
    let isOpen = false;
    if (!isOpen) {
      navClose.classList.add("hidden");
    }

    navToggle.addEventListener("click", function () {
      mainNav.classList.add("open");
      navClose.classList.remove("hidden");
      navToggle.classList.add("hidden");
      isOpen = true;
    });

    navClose.addEventListener("click", function () {
      mainNav.classList.remove("open");
      navClose.classList.add("hidden");
      navToggle.classList.remove("hidden");
      isOpen = false;
    });
  } else {
    navToggle.classList.add("hidden");
    navClose.classList.add("hidden");
    mainNav.classList.add("hidden");
  }

  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 0) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("carousel");
  log("Logos Carousel started");

  carousel.innerHTML += carousel.innerHTML;

  let scrollLeft = 0;
  const scrollSpeed = 3;
  let lastTimestamp = null;

  const resetDistance = carousel.offsetWidth;

  function animateCarousel(timestamp) {
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
    }
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    scrollLeft += (scrollSpeed * deltaTime) / 60; //60fps
    if (scrollLeft >= resetDistance) {
      scrollLeft = 0;
    }
    carousel.style.transform = `translateX(-${scrollLeft}px)`;

    requestAnimationFrame(animateCarousel);
  }

  requestAnimationFrame(animateCarousel);
});

// Sponsors tabs
document.addEventListener("DOMContentLoaded", function () {
  const sponsorTabs = document.querySelectorAll(".sponsor--tab");
  const sponsorDetails = document.querySelectorAll(".sponsor--details");

  sponsorTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      sponsorTabs.forEach((t) => t.classList.remove("active"));
      // Hide all sponsor details
      sponsorDetails.forEach((detail) => detail.classList.add("hidden"));

      // Add active class to the clicked tab
      this.classList.add("active");
      // Get the associated sponsor ID from data attribute
      const sponsorId = this.getAttribute("data-sponsor");
      // Show the corresponding sponsor details
      document.getElementById(sponsorId).classList.remove("hidden");
    });
  });
});

// Carousel
document.addEventListener("DOMContentLoaded", function () {
  const spotlightCarousel = document.getElementById("spotlightCarousel");
  const prevButton = document.querySelector(".carousel--button.prev");
  const nextButton = document.querySelector(".carousel--button.next");
  const dotsContainer = document.getElementById("spotlightDots");
  const slides = document.querySelectorAll(".spotlight--card");
  if (!slides.length) return;

  function getSlidesToShow() {
    return window.innerWidth < 768 ? 1 : 3;
  }

  let slidesToShow = getSlidesToShow();
  let cardWidth = slides[0].offsetWidth + 16;
  let totalPages = slides.length - slidesToShow + 1;
  let maxPageIndex = totalPages - 1;
  let currentPage = 0;

  function createDots() {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("button");
      dot.classList.add("carousel--dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        goToPage(i);
      });
      dotsContainer.appendChild(dot);
    }
  }

  createDots();
  let dotButtons = dotsContainer.querySelectorAll(".carousel--dot");

  function goToPage(pageIndex) {
    if (pageIndex < 0) pageIndex = 0;
    if (pageIndex > maxPageIndex) pageIndex = maxPageIndex;
    currentPage = pageIndex;
    spotlightCarousel.style.transform = `translateX(-${
      cardWidth * currentPage
    }px)`;
    updateUI();
  }

  function updateUI() {
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === maxPageIndex;
    dotButtons.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentPage);
    });
  }

  nextButton.addEventListener("click", () => {
    goToPage(currentPage + 1);
  });
  prevButton.addEventListener("click", () => {
    goToPage(currentPage - 1);
  });

  goToPage(0);

  window.addEventListener("resize", () => {
    slidesToShow = getSlidesToShow();
    cardWidth = slides[0].offsetWidth + 16;
    totalPages = slides.length - slidesToShow + 1;
    maxPageIndex = totalPages - 1;
    createDots();
    dotButtons = dotsContainer.querySelectorAll(".carousel--dot");
    if (currentPage > maxPageIndex) {
      currentPage = maxPageIndex;
    }
    goToPage(currentPage);
  });
});
