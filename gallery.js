document.addEventListener('DOMContentLoaded', () => {
    // --- ⚠️ CONFIGURATION ---
    const CLOUDINARY_CONFIG = {
        cloudName: 'dujlwpbrv', // ⚠️  REPLACE with your Cloudinary Cloud Name
    };

    // DOM Elements
    const galleryContainer = document.getElementById('image-gallery');
    const loader = document.getElementById('loader');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Get the category tag from the HTML element's data attribute
    const categoryTag = galleryContainer.dataset.cloudinaryTag;

    // If any required element is missing, stop the script.
    if (!galleryContainer || !loader || !lightbox || !categoryTag || categoryTag === 'your_tag_here') {
        const errorMsg = !categoryTag || categoryTag === 'your_tag_here' 
            ? "Error: The `data-cloudinary-tag` has not been set in the HTML."
            : "Error: A required element (gallery, loader, or lightbox) is missing from the page.";
        if (loader) loader.style.display = 'none';
        if (galleryContainer) galleryContainer.innerHTML = `<p style="color: red;">${errorMsg}</p>`;
        console.error(errorMsg);
        return;
    }

    let allImages = [];
    let currentIndex = 0;

    async function fetchImages() {
        loader.style.display = 'block';
        try {
            // Fetch the list of images with the specific tag
            const response = await fetch(`https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/list/${categoryTag}.json?max_results=100`);
            if (!response.ok) throw new Error(`Could not fetch images. Check the tag name and your Cloudinary settings.`);
            
            const data = await response.json();
            if (data.resources && data.resources.length > 0) {
                allImages = data.resources.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                renderGallery(allImages);
            } else {
                galleryContainer.innerHTML = '<p>No images found in this category yet.</p>';
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            galleryContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
        } finally {
            loader.style.display = 'none';
        }
    }

    function renderGallery(images) {
        galleryContainer.innerHTML = ''; // Clear the loader/previous content
        images.forEach((image, index) => {
            const thumbnailUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/c_fill,g_auto,w_400,h_400,q_auto/${image.public_id}.${image.format}`;
            const imgElement = document.createElement('img');
            imgElement.src = thumbnailUrl;
            imgElement.alt = `Image of ${categoryTag}`;
            imgElement.style.cursor = 'pointer';
            imgElement.style.margin = '5px';
            imgElement.addEventListener('click', () => openLightbox(index));
            galleryContainer.appendChild(imgElement);
        });
    }

    function openLightbox(index) {
        currentIndex = index;
        const image = allImages[currentIndex];
        const fullImageUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/w_1200,h_1200,c_limit,q_auto/${image.public_id}.${image.format}`;
        lightboxImg.src = fullImageUrl;
        lightbox.classList.add('active'); // Changed from style.display
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active'); // Changed from style.display
        document.body.style.overflow = 'auto';
    }

    const showNextImage = () => openLightbox((currentIndex + 1) % allImages.length);
    const showPrevImage = () => openLightbox((currentIndex - 1 + allImages.length) % allImages.length);

    // Event Listeners
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) { // Check for the class
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
    });

    fetchImages();
});