document.addEventListener("DOMContentLoaded", function() {

    // --- STICKY NAVIGATION ---
    const header = document.getElementById("mainHeader");
    const stickyPoint = header.offsetTop + 100; // Add a buffer

    function handleScroll() {
        if (window.pageYOffset > stickyPoint) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    }

    window.addEventListener("scroll", handleScroll);

    // --- MOBILE NAVIGATION TOGGLE ---
    const navToggle = document.getElementById("navToggle");
    const mainNav = document.getElementById("mainNav");

    if (navToggle && mainNav) {
        navToggle.addEventListener("click", () => {
            navToggle.classList.toggle("active");
            mainNav.classList.toggle("active");
        });

        // Close mobile nav when a link is clicked
        mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove("active");
                mainNav.classList.remove("active");
            });
        });
    }

    // --- SCROLL-IN ANIMATIONS ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    const elementsToAnimate = document.querySelectorAll('.anim-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));

});



// --- JAVASCRIPT for script.js ---

// --- Catalogue Modal Logic ---
const openModalBtn = document.getElementById('open-catalogue-modal');
const closeModalBtn = document.getElementById('close-catalogue-modal');
const catalogueModal = document.getElementById('catalogue-modal');

if (openModalBtn && closeModalBtn && catalogueModal) {
    // Function to open the modal
    const openModal = () => {
        catalogueModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    // Function to close the modal
    const closeModal = () => {
        catalogueModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // Event Listeners
    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);

    // Close modal if user clicks on the overlay background
    catalogueModal.addEventListener('click', (e) => {
        if (e.target === catalogueModal) {
            closeModal();
        }
    });

    // Close modal with the 'Escape' key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && catalogueModal.classList.contains('active')) {
            closeModal();
        }
    });
}