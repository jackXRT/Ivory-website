// Pagination System
const paginationConfig = {
  totalItems: document.querySelectorAll('.product-card').length,
  itemsPerPage: 4,
  currentPage: 1,
  maxVisiblePages: 4
};

function initPagination() {
  const pagination = document.querySelector('.pagination');
  if (!pagination) return;
  
  pagination.innerHTML = '';
  const totalPages = Math.ceil(paginationConfig.totalItems / paginationConfig.itemsPerPage);

  // Previous Button
  if (paginationConfig.currentPage > 1) {
    pagination.appendChild(createPageLink('« Prev', paginationConfig.currentPage - 1, 'prev-next'));
  }

  // Page Numbers
  let startPage = Math.max(1, paginationConfig.currentPage - Math.floor(paginationConfig.maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + paginationConfig.maxVisiblePages - 1);

  if (endPage - startPage + 1 < paginationConfig.maxVisiblePages) {
    startPage = Math.max(1, endPage - paginationConfig.maxVisiblePages + 1);
  }

  if (startPage > 1) {
    pagination.appendChild(createPageLink(1, 1));
    if (startPage > 2) {
      pagination.appendChild(createEllipsis());
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pagination.appendChild(createPageLink(
      i,
      i,
      i === paginationConfig.currentPage ? 'active' : ''
    ));
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pagination.appendChild(createEllipsis());
    }
    pagination.appendChild(createPageLink(totalPages, totalPages));
  }

  // Next Button
  if (paginationConfig.currentPage < totalPages) {
    pagination.appendChild(createPageLink('Next »', paginationConfig.currentPage + 1, 'prev-next'));
  }

  // Add event listeners
  document.querySelectorAll('.page-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      paginationConfig.currentPage = parseInt(this.dataset.page);
      initPagination();
      loadProductsForPage(paginationConfig.currentPage);
    });
  });
}

function createPageLink(text, page, className = '') {
  const link = document.createElement('a');
  link.href = '#';
  link.textContent = text;
  link.dataset.page = page;
  link.className = `page-link ${className}`;
  return link;
}

function createEllipsis() {
  const span = document.createElement('span');
  span.textContent = '...';
  span.style.padding = '8px 12px';
  return span;
}

function loadProductsForPage(page) {
  const startIdx = (page - 1) * paginationConfig.itemsPerPage;
  const endIdx = startIdx + paginationConfig.itemsPerPage;
  
  document.querySelectorAll('.product-card').forEach((card, index) => {
    card.style.display = (index >= startIdx && index < endIdx) ? 'block' : 'none';
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', initPagination);