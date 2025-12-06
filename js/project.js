document.addEventListener("DOMContentLoaded", () => {
  // botton for phone
    const toggleBtn = document.querySelector(".menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }


  // --- Search Functionality ---
  // Allows users to search for text within the page content
  const searchInput = document.querySelector(".search");
  const searchForm = document.querySelector(".search-form");

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent form submission (page reload)
      performSearch();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      }
    });
  }

  // Core search logic
  function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return; // Do nothing if search is empty

    // Remove previous highlights (if any were added in a more complex version)
    // Currently, we just scroll to the text, but this is good practice for future highlighting
    document.querySelectorAll(".highlight").forEach((el) => {
      el.outerHTML = el.textContent;
    });

    // Define areas to search within to avoid breaking scripts or styles
    const contentAreas = [
      document.querySelector(".landing"),
      document.querySelector(".info"),
      document.querySelector(".persona"),
      document.querySelector(".news"),
    ];

    let found = false;

    for (const area of contentAreas) {
      if (!area) continue;
      
      // Use TreeWalker to efficiently find text nodes containing the search term
      const walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT, null, false);
      let node;
      while (node = walker.nextNode()) {
        const text = node.textContent;
        const index = text.toLowerCase().indexOf(query.toLowerCase());
        
        if (index !== -1) {
          // Found a match!
          const range = document.createRange();
          range.setStart(node, index);
          range.setEnd(node, index + query.length);
          
          // Select the text visually for the user
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          
          // Smoothly scroll the page to the found text
          node.parentElement.scrollIntoView({ behavior: "smooth", block: "center" });
          
          found = true;
          break; // Stop after finding the first match
        }
      }
      if (found) break;
    }

    if (!found) {
      alert("No matches found for: " + query);
    }
  }

  // --- Scroll Animations ---
  // Uses IntersectionObserver to trigger animations when elements enter the viewport
  const observerOptions = {
    root: null, // Use the viewport as the container
    rootMargin: "0px",
    threshold: 0.1, // Trigger when 10% of the element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Element is visible: add class to start animation
        entry.target.classList.add("is-visible");
      } else {
        // Element left viewport: remove class to reset animation (so it plays again later)
        entry.target.classList.remove("is-visible"); // Remove class to re-trigger animation
      }
    });
  }, observerOptions);

  // Select all elements with the 'animate-on-scroll' class and start observing them
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  animatedElements.forEach((el) => observer.observe(el));

  // --- Testimonial Slider ---
  // Data for the testimonials (easy to add more here)
  const testimonials = [
    {
      img: "../img/2020_8_18_12_3_36_873.jpg",
      title: "Eight Different Prescriptions",
      quote:
        '"He was given eight different prescriptions upon release from the hospital and it was very overwhelming to me. So I came across Medisafe and it was the best thing that could ever have happened because I don\'t know how I would have managed."',
      meta: "<strong>Makeba and Son</strong> | <em>Capsulty Since 2017</em>",
    },
    {
      img: "../img/Omnichannel_forwebsite-850x550-1.webp",
      title: "Peace of Mind",
      quote:
        '"Capsulty has given me peace of mind knowing that my mother is taking her medications on time. The app is easy to use and the reminders are a lifesaver."',
      meta: "<strong>Sarah J.</strong> | <em>Capsulty Since 2019</em>",
    },
    {
      img: "../img/Innovation_icon.webp",
      title: "Better Health Outcomes",
      quote:
        '"Since using Capsulty, my adherence to my medication regimen has improved significantly. I feel healthier and more in control of my condition."',
      meta: "<strong>David L.</strong> | <em>Capsulty Since 2021</em>",
    },
  ];

  let currentSlide = 0;
  // Get references to DOM elements that need to be updated
  const personaImg = document.getElementById("persona-img");
  const personaTitle = document.getElementById("persona-title");
  const personaQuote = document.getElementById("persona-quote");
  const personaMeta = document.getElementById("persona-meta");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const dotsContainer = document.getElementById("dots-container");
  const dots = document.querySelectorAll(".dot");

  // Function to update the slider content with a fade effect
  function updateSlide(index) {
    // 1. Fade out current content
    const content = document.querySelector(".persona-content");
    const media = document.querySelector(".persona-media");
    
    if(content) content.style.opacity = 0;
    if(media) media.style.opacity = 0;
    
    // 2. Wait for fade out to finish, then update data
    setTimeout(() => {
        const slide = testimonials[index];
        if(personaImg) personaImg.src = slide.img;
        if(personaTitle) personaTitle.textContent = slide.title;
        if(personaQuote) personaQuote.innerHTML = slide.quote;
        if(personaMeta) personaMeta.innerHTML = slide.meta;

        // Update active dot
        if(dots) {
            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === index);
            });
        }
        
        // 3. Fade in new content
        if(content) content.style.opacity = 1;
        if(media) media.style.opacity = 1;
    }, 300); // 300ms matches the CSS transition duration
  }
  
  // Add transition styles dynamically to ensure smooth fading
  const personaContent = document.querySelector(".persona-content");
  const personaMedia = document.querySelector(".persona-media");
  if(personaContent) personaContent.style.transition = "opacity 0.3s ease";
  if(personaMedia) personaMedia.style.transition = "opacity 0.3s ease";

  // Event listeners for Previous/Next buttons
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      // Calculate previous index (wrapping around to the end)
      currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
      updateSlide(currentSlide);
    });

    nextBtn.addEventListener("click", () => {
      // Calculate next index (wrapping around to the start)
      currentSlide = (currentSlide + 1) % testimonials.length;
      updateSlide(currentSlide);
    });
  }

  // Event listener for Dots navigation
  if (dotsContainer) {
    dotsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("dot")) {
        const index = parseInt(e.target.dataset.index);
        currentSlide = index;
        updateSlide(currentSlide);
      }
    });
  }

  // --- Read More Functionality ---
  // Uses event delegation on the body to handle clicks on "Read More" buttons
  document.body.addEventListener("click", (e) => {
    // Handle "Read More" click
    if (e.target.classList.contains("read-more-btn")) {
      const p = e.target.parentElement;
      const originalText = p.innerHTML; // Save original HTML (short text)
      p.setAttribute("data-original-text", originalText);
      
      // Simulate expanding the text
      const textOnly = p.textContent.replace("Read More", "").trim();
      p.innerHTML = textOnly + " [Expanded Content: This is where the full article would appear. For now, we are simulating the expansion of text to demonstrate functionality.] <span class='read-less-btn' style='color:var(--main-color);cursor:pointer;font-weight:bold;'>Read Less</span>";
    }
    
    // Handle "Read Less" click
    else if (e.target.classList.contains("read-less-btn")) {
      const p = e.target.parentElement;
      const originalText = p.getAttribute("data-original-text");
      if (originalText) {
        // Restore the original short text
        p.innerHTML = originalText;
      }
    }
  });

});
