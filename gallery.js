// Lightbox and Gallery Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Lightbox elements
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const closeBtn = document.querySelector('.close-lightbox');
  let currentProductImages = [];
  let currentImageIndex = 0;

  // Thumbnail click handler
  document.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const mainImg = productCard.querySelector('.main-image img');
      
      // Update active thumbnail
      productCard.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Smooth transition for main image
      mainImg.style.opacity = 0;
      setTimeout(() => {
        mainImg.src = this.dataset.full;
        mainImg.alt = this.alt;
        mainImg.style.opacity = 1;
      }, 150);
    });
  });

  // Quick View handler
  document.querySelectorAll('.quick-view').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const productCard = this.closest('.product-card');
      
      // Get only THIS product's images
      currentProductImages = Array.from(productCard.querySelectorAll('.thumbnail'))
        .map(thumb => ({
          src: thumb.dataset.full,
          alt: thumb.alt
        }));
      
      currentImageIndex = 0;
      openLightbox();
    });
  });

  // Lightbox controls
  function openLightbox() {
    lightboxImg.src = currentProductImages[currentImageIndex].src;
    lightboxImg.alt = currentProductImages[currentImageIndex].alt;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  document.querySelector('.prev-lightbox')?.addEventListener('click', prevImage);
  document.querySelector('.next-lightbox')?.addEventListener('click', nextImage);

  function prevImage(e) {
    e?.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + currentProductImages.length) % currentProductImages.length;
    updateLightboxImage();
  }

  function nextImage(e) {
    e?.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % currentProductImages.length;
    updateLightboxImage();
  }

  function updateLightboxImage() {
    lightboxImg.style.opacity = 0;
    setTimeout(() => {
      lightboxImg.src = currentProductImages[currentImageIndex].src;
      lightboxImg.alt = currentProductImages[currentImageIndex].alt;
      lightboxImg.style.opacity = 1;
    }, 200);
  }

  // Close lightbox
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    }
  });
});