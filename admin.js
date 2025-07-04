document.addEventListener('DOMContentLoaded', () => {
    // --- ⚠️  CONFIGURATION ⚠️ ---
    const CLOUDINARY_CONFIG = {
        cloudName: 'dujlwpbrv',        // ⚠️  REPLACE with your Cloudinary Cloud Name
        uploadPreset: 'coffee555'   // ⚠️  REPLACE with the Unsigned Upload Preset you created
    };

    // DOM Elements
    const uploadStatusDiv = document.getElementById('upload-status');
    const uploadButtons = document.querySelectorAll('.upload-btn');

    // This function creates and opens the Cloudinary widget
    function openUploader(categoryTag) {
        // Ensure a tag is provided
        if (!categoryTag) {
            console.error("No category tag provided for the uploader.");
            return;
        }

        const uploadWidget = cloudinary.createUploadWidget({
            cloudName: CLOUDINARY_CONFIG.cloudName,
            uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
            tags: [categoryTag],
            sources: ['local', 'url', 'camera'],
            multiple: true,
        }, (error, result) => {
            if (!error && result && result.event === "success") {
                uploadStatusDiv.innerHTML = `<p>Successfully uploaded: <strong>${result.info.original_filename}</strong> with tag <strong>${categoryTag}</strong>.</p>`;
                uploadStatusDiv.className = 'success'; // Add this line
            } else if (error) {
                uploadStatusDiv.innerHTML = `<p>Upload failed. Please check the console.</p>`;
                uploadStatusDiv.className = 'error'; // Add this line
            }
        });
        uploadWidget.open();
    }

    // Attach a click event listener to every upload button on the page
    uploadButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tag = button.dataset.categoryTag;
            uploadStatusDiv.innerHTML = ''; // Clear previous status
            openUploader(tag);
        });
    });
});