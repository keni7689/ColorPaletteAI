// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const selectedFile = document.getElementById('selectedFile');
const fileName = document.getElementById('fileName');
const removeFileBtn = document.getElementById('removeFile');
const submitBtn = document.getElementById('submitBtn');
const uploadForm = document.getElementById('uploadForm');
const errorMessage = document.getElementById('errorMessage');
const spinner = document.getElementById('spinner');

// File validation
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
const maxFileSize = 16 * 1024 * 1024; // 16MB

// Upload area click handler
if (uploadArea) {
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag and drop handlers
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelection(files[0]);
        }
    });
}

// File input change handler
if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    });
}

// Remove file button handler
if (removeFileBtn) {
    removeFileBtn.addEventListener('click', () => {
        clearFileSelection();
    });
}

// Form submit handler
if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!fileInput.files[0]) {
            showError('Please select an image file.');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        spinner.classList.remove('d-none');
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span><i class="fas fa-magic me-2"></i>Processing...';

        // Submit form
        uploadForm.submit();
    });
}

// Handle file selection
function handleFileSelection(file) {
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
        showError('Please select a valid image file (JPG, PNG, GIF, BMP, WEBP).');
        return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
        showError('File size must be less than 16MB.');
        return;
    }

    // Clear any previous errors
    hideError();

    // Update UI
    fileName.textContent = file.name;
    selectedFile.classList.remove('d-none');
    uploadArea.style.display = 'none';
    submitBtn.disabled = false;

    // Update file input
    fileInput.files = createFileList(file);
}

// Clear file selection
function clearFileSelection() {
    fileInput.value = '';
    selectedFile.classList.add('d-none');
    uploadArea.style.display = 'block';
    submitBtn.disabled = true;
    hideError();
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');

    // Scroll to error message
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Hide error message
function hideError() {
    errorMessage.classList.add('d-none');
}

// Create FileList object (for compatibility)
function createFileList(file) {
    const dt = new DataTransfer();
    dt.items.add(file);
    return dt.files;
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Copy to clipboard utility function
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        return new Promise((resolve, reject) => {
            document.execCommand('copy') ? resolve() : reject();
            textArea.remove();
        });
    }
}

// Initialize tooltips if Bootstrap is available
document.addEventListener('DOMContentLoaded', function () {
    // Initialize Bootstrap tooltips
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Add smooth scroll behavior to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Handle window resize for responsive design
window.addEventListener('resize', function () {
    // Adjust upload area height on mobile
    if (window.innerWidth <= 768 && uploadArea) {
        uploadArea.style.minHeight = '200px';
    } else if (uploadArea) {
        uploadArea.style.minHeight = '250px';
    }
});

// Prevent default drag behaviors on the entire document
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Add visual feedback for form interactions
document.addEventListener('DOMContentLoaded', function () {
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click animation to color cards (for results page)
    const colorCards = document.querySelectorAll('.color-card');
    colorCards.forEach(card => {
        card.addEventListener('click', function () {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
});

// Error handling for fetch requests (if needed for future AJAX calls)
function handleFetchError(error) {
    console.error('Fetch error:', error);
    showError('An error occurred while processing your request. Please try again.');
}

// Utility function to validate image files client-side
function validateImageFile(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No file provided');
            return;
        }

        // Check file type
        if (!allowedTypes.includes(file.type)) {
            reject('Invalid file type. Please select an image file.');
            return;
        }

        // Check file size
        if (file.size > maxFileSize) {
            reject('File is too large. Maximum size is 16MB.');
            return;
        }

        // Create image element to validate it's a real image
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = function () {
            URL.revokeObjectURL(url);
            resolve(true);
        };

        img.onerror = function () {
            URL.revokeObjectURL(url);
            reject('Invalid image file. Please select a valid image.');
        };

        img.src = url;
    });
}