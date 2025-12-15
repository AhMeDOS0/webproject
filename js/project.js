// Wait for the DOM (Document Object Model) to be fully loaded before running any code.
// This ensures that all HTML elements exist before we try to manipulate them with JavaScript.
document.addEventListener("DOMContentLoaded", () => {
    
    // =========================================================================
    // SECTION 1: GLOBAL SEARCH FUNCTIONALITY
    // =========================================================================
    // This section handles the search feature found in the header.
    // It allows users to type a query and finds matching text anywhere on the page.

    const searchInput = document.querySelector(".search"); // The input field where user types
    const searchForm = document.querySelector(".search-form"); // The form wrapping the input

    // Event Listener: Handle Form Submission
    // Prevents the default form behavior (which would reload the page) and triggers the search.
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Stop page reload
        performSearch();    // Run the search logic
      });
    }

    // Event Listener: Handle 'Enter' Key Press
    // Allows the user to press 'Enter' inside the input box to trigger the search.
    if (searchInput) {
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault(); // Stop default behavior
          performSearch();    // Run the search logic
        }
      });
    }

    /**
     * Function: performSearch
     * -----------------------
     * Core logic for searching text within the document.
     * 1. Gets the user's query.
     * 2. Scans the 'document.body' for matching text.
     * 3. Highlights and selects the first match found.
     * 4. Scrolls the viewport to show the result.
     */
    function performSearch() {
      const query = searchInput.value.trim(); // Get value and remove extra whitespace
      if (!query) return; // Exit function if the search box is empty

      // Define where to search. We use 'document.body' to search everything visible on the page.
      const contentAreas = [document.body];

      let found = false; // Flag to track if we found a match

      for (const area of contentAreas) {
        if (!area) continue;
        
        // TreeWalker is a powerful API to traverse the DOM tree.
        // NodeFilter.SHOW_TEXT ensures we only look at text nodes (ignoring HTML tags).
        const walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT, null, false);
        let node;
        
        // Iterate through every text node in the document
        while (node = walker.nextNode()) {
          const text = node.textContent;
          // Check if the query exists in this text node (case-insensitive check)
          const index = text.toLowerCase().indexOf(query.toLowerCase());
          
          if (index !== -1) {
            // MATCH FOUND!
            
            // Create a Range object to define the start and end of the matching text
            const range = document.createRange();
            range.setStart(node, index);
            range.setEnd(node, index + query.length);
            
            // Use the Window Selection API to visually highlight the text (blue background selection)
            const selection = window.getSelection();
            selection.removeAllRanges(); // Clear any existing selection
            selection.addRange(range);   // Add our new range
            
            // Smoothly scroll the page so the found text is centered in the view
            node.parentElement.scrollIntoView({ behavior: "smooth", block: "center" });
            
            found = true;
            break; // Stop loop after finding the first match
          }
        }
        if (found) break; // Exit outer loop if match found
      }

      // If loop finishes and 'found' is still false, alert the user.
      if (!found) {
        alert("No matches found for: " + query);
      }
    }

    // =========================================================================
    // SECTION 2: SCROLL ANIMATIONS (Intersection Observer)
    // =========================================================================
    // This section adds animations to elements as they scroll into view.
    // It works by watching elements with the class '.animate-on-scroll'.

    // Configuration options for the Observer
    const observerOptions = {
      root: null, // null means we are observing relative to the browser viewport
      rootMargin: "0px", // No extra margin
      threshold: 0.1, // Trigger callback when 10% of the element is visible
    };

    // Create the Observer instance
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        // 'entry.isIntersecting' is true when the element is visible in the viewport
        if (entry.isIntersecting) {
          // Add class 'is-visible' which triggers CSS animations (e.g., fade in)
          entry.target.classList.add("is-visible");
        } else {
          // Remove class when element leaves view. This allows the animation to *replay* 
          // every time the user scrolls back to it.
          entry.target.classList.remove("is-visible"); 
        }
      });
    }, observerOptions);

    // Find all elements meant to be animated and tell the observer to watch them
    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));


    // =========================================================================
    // SECTION 3: TESTIMONIAL SLIDER
    // =========================================================================
    // A custom-built slider for rotating through customer testimonials.
    // It updates the image, title, quote, and metadata dynamically.

    // Array of Objects: Stores the content for each slide
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

    let currentSlide = 0; // Tracks the index of the currently displayed slide

    // DOM Elements: Get references to parts of the page we need to update
    const personaImg = document.getElementById("persona-img");
    const personaTitle = document.getElementById("persona-title");
    const personaQuote = document.getElementById("persona-quote");
    const personaMeta = document.getElementById("persona-meta");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const dotsContainer = document.getElementById("dots-container");
    const dots = document.querySelectorAll(".dot");

    /**
     * Function: updateSlide
     * ---------------------
     * Handles the visual transition between slides.
     * @param {number} index - The index of the new slide to show.
     */
    function updateSlide(index) {
      // Step 1: Fade Out
      const content = document.querySelector(".persona-content");
      const media = document.querySelector(".persona-media");
      
      if(content) content.style.opacity = 0;
      if(media) media.style.opacity = 0;
      
      // Step 2: Content Update (after a short delay to allow fade out)
      setTimeout(() => {
          const slide = testimonials[index];
          // Update HTML content from the data array
          if(personaImg) personaImg.src = slide.img;
          if(personaTitle) personaTitle.textContent = slide.title;
          if(personaQuote) personaQuote.innerHTML = slide.quote;
          if(personaMeta) personaMeta.innerHTML = slide.meta;
  
          // Update the "active" class on the navigation dots
          if(dots) {
              dots.forEach((dot, i) => {
                  dot.classList.toggle("active", i === index);
              });
          }
          
          // Step 3: Fade In
          if(content) content.style.opacity = 1;
          if(media) media.style.opacity = 1;
      }, 300); // 300ms matches the transition duration in CSS
    }
    
    // Set explicit CSS transition property via JS to ensure smooth effects
    const personaContent = document.querySelector(".persona-content");
    const personaMedia = document.querySelector(".persona-media");
    if(personaContent) personaContent.style.transition = "opacity 0.3s ease";
    if(personaMedia) personaMedia.style.transition = "opacity 0.3s ease";
  
    // Event Listeners: Navigation Buttons
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        // Calculate Previous: (current - 1 + length) % length handles wrapping from 0 back to end
        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
        updateSlide(currentSlide);
      });
  
      nextBtn.addEventListener("click", () => {
        // Calculate Next: (current + 1) % length handles wrapping from end back to 0
        currentSlide = (currentSlide + 1) % testimonials.length;
        updateSlide(currentSlide);
      });
    }
  
    // Event Listener: Dots Navigation
    if (dotsContainer) {
      dotsContainer.addEventListener("click", (e) => {
        // Use event delegation: check if the clicked element is a dot
        if (e.target.classList.contains("dot")) {
          const index = parseInt(e.target.dataset.index); // Get index from data attribute
          currentSlide = index;
          updateSlide(currentSlide);
        }
      });
    }
  
    // =========================================================================
    // SECTION 4: READ MORE / READ LESS LOGIC
    // =========================================================================
    // Handles expanding and collapsing text dynamically using event delegation.
    // This allows it to work on any element with class 'read-more-btn' without
    // attaching individual listeners to each button.

    document.body.addEventListener("click", (e) => {
      
      // Check if user clicked a "Read More" button
      if (e.target.classList.contains("read-more-btn")) {
        const p = e.target.parentElement; // The paragraph containing the text
        const originalText = p.innerHTML; // Store the original text to restore later
        p.setAttribute("data-original-text", originalText);
        
        // Logic to simulate fetching new content (In a real app, you might fetch from an API)
        const textOnly = p.textContent.replace("Read More", "").trim();
        p.innerHTML = textOnly + " [Expanded Content: This is where the full article would appear. For now, we are simulating the expansion of text to demonstrate functionality.] <span class='read-less-btn' style='color:var(--main-color);cursor:pointer;font-weight:bold;'>Read Less</span>";
      }
      
      // Check if user clicked a "Read Less" button
      else if (e.target.classList.contains("read-less-btn")) {
        const p = e.target.parentElement;
        const originalText = p.getAttribute("data-original-text"); // Retrieve stored original text
        if (originalText) {
          p.innerHTML = originalText; // Restore content
        }
      }
    });
  });