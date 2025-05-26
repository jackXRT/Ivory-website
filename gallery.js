// Product Image Gallery Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Thumbnail click functionality
  document.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const mainImg = productCard.querySelector('.main-image img');
      
      // Remove active class from all thumbnails
      productCard.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
      
      // Set clicked thumbnail as active
      this.classList.add('active');
      
      // Update main image with smooth transition
      mainImg.style.opacity = 0;
      setTimeout(() => {
        mainImg.src = this.dataset.full;
        mainImg.alt = this.alt;
        mainImg.style.opacity = 1;
      }, 150);
    });
  });

  // Mobile navigation
  document.querySelectorAll('.prev-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const activeThumb = productCard.querySelector('.thumbnail.active');
      const prevThumb = activeThumb.previousElementSibling || 
                       productCard.querySelector('.thumbnail:last-child');
      
      if (prevThumb) {
        prevThumb.click();
      }
    });
  });

  document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const activeThumb = productCard.querySelector('.thumbnail.active');
      const nextThumb = activeThumb.nextElementSibling || 
                       productCard.querySelector('.thumbnail:first-child');
      
      if (nextThumb) {
        nextThumb.click();
      }
    });
  });

  // Lightbox functionality
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const quickViews = document.querySelectorAll('.quick-view');
  const products = document.querySelectorAll('.product-card');
  let currentProductIndex = 0;

  // Open lightbox
  quickViews.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      currentProductIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    const product = products[currentProductIndex];
    const imgSrc = product.querySelector('.main-image img').src;
    const imgAlt = product.querySelector('.main-image img').alt;
    const productName = product.querySelector('.product-name').textContent;
    
    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt;
    lightboxCaption.textContent = productName;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Focus on lightbox for keyboard navigation
    setTimeout(() => {
      lightbox.focus();
    }, 100);
  }

  // Close lightbox
  document.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
  
  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  // Lightbox navigation
  document.querySelector('.prev-lightbox').addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(-1);
  });
  
  document.querySelector('.next-lightbox').addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(1);
  });

  function navigateLightbox(direction) {
    currentProductIndex += direction;
    
    if (currentProductIndex >= products.length) {
      currentProductIndex = 0;
    } else if (currentProductIndex < 0) {
      currentProductIndex = products.length - 1;
    }
    
    const product = products[currentProductIndex];
    lightboxImg.style.opacity = 0;
    
    setTimeout(() => {
      lightboxImg.src = product.querySelector('.main-image img').src;
      lightboxImg.alt = product.querySelector('.main-image img').alt;
      lightboxCaption.textContent = product.querySelector('.product-name').textContent;
      lightboxImg.style.opacity = 1;
    }, 200);
  }

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      }
    }
  });

  // Close when clicking outside image
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
      closeLightbox();
    }
  });

  // Touch events for mobile swipe navigation
  let touchStartX = 0;
  let touchEndX = 0;
  
  lightbox.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive: true});
  
  lightbox.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, {passive: true});
  
  function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      navigateLightbox(1); // Swipe left - next
    } else if (touchEndX > touchStartX + threshold) {
      navigateLightbox(-1); // Swipe right - previous
    }
  }

  // Preload lightbox images for better performance
  function preloadLightboxImages() {
    products.forEach(product => {
      const img = new Image();
      img.src = product.querySelector('.main-image img').src;
    });
  }
  
  // Initialize preloading
  preloadLightboxImages();
  
  // Make lightbox focusable
  lightbox.setAttribute('tabindex', '0');
});