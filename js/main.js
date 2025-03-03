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

// Logos carousel
document.addEventListener("DOMContentLoaded", function () {
  const carouselTop = document.getElementById("carousel-logos");
  const carouselGroup = document.querySelector(".carousel--logos-group");

  // Duplicate inner content initially so that there are three groups.
  carouselGroup.innerHTML += carouselGroup.innerHTML + carouselGroup.innerHTML;

  let offset = 100; // starting translateX value (in px)
  const scrollSpeed = 2;
  let lastTimestamp = null;

  function animateCarousel(timestamp) {
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
    }
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    // Decrease offset over time (moves logos to the left).
    offset -= (scrollSpeed * deltaTime) / 60;
    carouselGroup.style.transform = `translateX(${offset}px)`;

    // Check the first group to see if it's mostly offscreen.
    const firstGroup = carouselGroup.querySelector(".carousel--container");
    if (firstGroup) {
      const firstRect = firstGroup.getBoundingClientRect();
      const outerRect = carouselTop.getBoundingClientRect();
      // When half of the first group's width is off to the left,
      // remove it and append it to the end.
      if (firstRect.right <= outerRect.left + firstRect.width / 2) {
        const firstWidth = firstGroup.offsetWidth;
        carouselGroup.appendChild(firstGroup);
        // Adjust offset to account for the removed group's width.
        offset += firstWidth;
        carouselGroup.style.transform = `translateX(${offset}px)`;
      }
    }

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

  // On mobile (<768px): show 1 slide; on desktop: show 3 slides.
  function getSlidesToShow() {
    return window.innerWidth < 768 ? 1 : 3;
  }

  // Returns the card width.
  // On mobile, use the total card width.
  // On desktop, add a 16px gap.
  function getCardWidth() {
    return window.innerWidth < 768
      ? slides[0].offsetWidth
      : slides[0].offsetWidth + 16;
  }

  // On mobile start with +325px
  // this is hard and pure magic lol
  function getBaselineOffset() {
    return window.innerWidth < 768 ? 325 : 0;
  }

  let slidesToShow = getSlidesToShow();
  let cardWidth = getCardWidth();
  let baselineOffset = getBaselineOffset();

  // Total pages = total slides - slides visible + 1.
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
    let offset;
    if (window.innerWidth < 768) {
      // For mobile, start at +325 and subtract one card per page.
      offset = baselineOffset - cardWidth * currentPage;
      spotlightCarousel.style.transform = `translateX(${offset}px)`;
    } else {
      // For desktop, slide left with negative values.
      offset = cardWidth * currentPage;
      spotlightCarousel.style.transform = `translateX(-${offset}px)`;
    }
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
    cardWidth = getCardWidth();
    baselineOffset = getBaselineOffset();
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
