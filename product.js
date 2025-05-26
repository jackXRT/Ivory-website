// ===== DOM ELEMENTS =====
const dom = {
  lengthOptions: document.querySelectorAll('.length-option'),
  qtyInput: document.querySelector('.quantity-selector input'),
  qtyMinus: document.querySelector('.qty-minus'),
  qtyPlus: document.querySelector('.qty-plus'),
  tabButtons: document.querySelectorAll('.tab-btn'),
  currentPrice: document.querySelector('.current-price'),
  orderSummary: {
    subtotal: document.getElementById('subtotal'),
    discount: document.getElementById('discount'),
    shipping: document.getElementById('shipping'),
    total: document.getElementById('total')
  },
  shippingModal: {
    element: document.getElementById('shippingModal'),
    calculateBtn: document.getElementById('calculate-shipping'),
    countrySelect: document.getElementById('country-select'),
    zipInput: document.getElementById('zip-code'),
    resultDiv: document.getElementById('shipping-result')
  },
  currencySelector: document.getElementById('currency-selector'),
  convertedPrice: document.querySelector('.converted-price'),
  bulkDiscountNotice: document.querySelector('.bulk-discount-notice')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  initLengthSelection();
  initQuantitySelector();
  initTabs();
  initShippingCalculator();
  initCurrencyConverter();
  initBulkDiscounts();
  initCountrySelector();
  startCountdown();
  updateOrderSummary();
});

// ===== CORE FUNCTIONS =====

// 1. Length Selection
function initLengthSelection() {
  dom.lengthOptions.forEach(option => {
    option.addEventListener('click', function() {
      dom.lengthOptions.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      dom.currentPrice.textContent = '$' + this.dataset.price;
      setTimeout(updateOrderSummary, 100);
    });
  });
}

// 2. Quantity Selector
function initQuantitySelector() {
  dom.qtyMinus.addEventListener('click', () => {
    if (parseInt(dom.qtyInput.value) > 1) {
      dom.qtyInput.value = parseInt(dom.qtyInput.value) - 1;
      updateOrderSummary();
    }
  });

  dom.qtyPlus.addEventListener('click', () => {
    dom.qtyInput.value = parseInt(dom.qtyInput.value) + 1;
    updateOrderSummary();
  });

  dom.qtyInput.addEventListener('change', updateOrderSummary);
}

// 3. Tab System
function initTabs() {
  dom.tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active tab
      dom.tabButtons.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Update active content
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(this.dataset.tab).classList.add('active');
    });
  });
}

// 4. Order Summary Calculator
function updateOrderSummary() {
  const price = parseFloat(dom.currentPrice.textContent.replace('$', ''));
  const quantity = parseInt(dom.qtyInput.value);
  const subtotal = price * quantity;
  const discount = calculateDiscount(subtotal);
  const shipping = calculateShipping();
  const total = subtotal - discount + shipping;

  dom.orderSummary.subtotal.textContent = `$${subtotal.toFixed(2)}`;
  dom.orderSummary.discount.textContent = `-$${discount.toFixed(2)}`;
  dom.orderSummary.shipping.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  dom.orderSummary.total.textContent = `$${total.toFixed(2)}`;
}

function calculateDiscount(subtotal) {
  // 10% discount for $1000+ orders
  return subtotal >= 1000 ? subtotal * 0.1 : 0;
}

function calculateShipping() {
  // Check if free shipping applies
  const price = parseFloat(dom.currentPrice.textContent.replace('$', ''));
  const quantity = parseInt(dom.qtyInput.value);
  return (price * quantity) >= 1000 ? 0 : 15.00; // Flat rate otherwise
}

// 5. Shipping Calculator
function initShippingCalculator() {
  dom.shippingModal.calculateBtn.addEventListener('click', calculateShippingRates);
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === dom.shippingModal.element) {
      dom.shippingModal.element.style.display = 'none';
    }
  });
}

function calculateShippingRates() {
  const country = dom.shippingModal.countrySelect.value;
  const zipCode = dom.shippingModal.zipInput.value.trim();
  
  if (!zipCode) {
    dom.shippingModal.resultDiv.innerHTML = `
      <p style="color:#e63946">Please enter your postal code</p>
    `;
    return;
  }

  // Show loading state
  dom.shippingModal.resultDiv.innerHTML = `
    <div class="shipping-loading">
      <i class="fas fa-spinner fa-spin"></i> Calculating...
    </div>
  `;

  // Simulate API call
  setTimeout(() => {
    const rates = getShippingRates(country, zipCode);
    renderShippingOptions(rates, country, zipCode);
  }, 1500);
}

function getShippingRates(country, zipCode) {
  const carriers = {
    standard: { name: 'Standard Shipping', logo: '🚛' },
    express: { name: 'Express Shipping', logo: '✈️' },
    dhl: { name: 'DHL Express', logo: '📦' },
    fedex: { name: 'FedEx Priority', logo: '✈️📦' },
    ghanaPost: { name: 'Ghana Post', logo: '🇬🇭' }
  };

  const rates = {
    'US': [
      { id: 1, carrier: 'standard', price: 15.00, time: '7-14 days', default: true },
      { id: 2, carrier: 'express', price: 25.00, time: '3-5 days' },
      { id: 3, carrier: 'dhl', price: 35.00, time: '2-3 days' }
    ],
    'GH': [
      { id: 4, carrier: 'ghanaPost', price: 45.00, time: '10-21 days', default: true },
      { id: 5, carrier: 'dhl', price: 65.00, time: '5-8 days' }
    ],
    '_default': [
      { id: 99, carrier: 'standard', price: 40.00, time: '12-30 days', default: true },
      { id: 100, carrier: 'dhl', price: 75.00, time: '7-10 days' }
    ]
  };

  // Get country-specific rates or defaults
  const countryRates = rates[country] || rates['_default'];
  
  // Format for display
  return countryRates.map(rate => ({
    ...rate,
    method: `${carriers[rate.carrier].logo} ${carriers[rate.carrier].name}`,
    price: applyZipCodeSurcharge(rate.price, zipCode)
  }));
}

function applyZipCodeSurcharge(basePrice, zipCode) {
  // Example: Add 10% surcharge for remote areas
  if (/^9\d{4}$/.test(zipCode)) return basePrice * 1.1;
  return basePrice;
}

function renderShippingOptions(rates, country, zipCode) {
  dom.shippingModal.resultDiv.innerHTML = `
    <div class="shipping-options">
      <h4>To ${getCountryName(country)} ${zipCode}:</h4>
      ${rates.map(rate => `
        <div class="shipping-option">
          <input type="radio" name="shipping" id="ship${rate.id}" 
                 data-price="${rate.price}" ${rate.default ? 'checked' : ''}>
          <label for="ship${rate.id}">
            <span class="ship-method">${rate.method}</span>
            <span class="ship-price">$${rate.price.toFixed(2)}</span>
            <span class="ship-time">${rate.time}</span>
          </label>
        </div>
      `).join('')}
      <button id="apply-shipping">Apply Shipping</button>
    </div>
  `;

  document.getElementById('apply-shipping').addEventListener('click', function() {
    const selected = document.querySelector('input[name="shipping"]:checked');
    if (selected) {
      dom.orderSummary.shipping.textContent = `$${selected.dataset.price}`;
      dom.shippingModal.element.style.display = 'none';
      updateOrderSummary();
    }
  });
}

// 6. Currency Converter
function initCurrencyConverter() {
  const exchangeRates = {
    'USD': 1,
    'GHS': 12.5,
    'EUR': 0.92,
    'GBP': 0.79,
    'NGN': 1500,
    'ZAR': 18.5
  };

  dom.currencySelector.addEventListener('change', function() {
    const currency = this.value;
    const basePrice = parseFloat(dom.currentPrice.textContent.replace('$', ''));
    const convertedPrice = basePrice * exchangeRates[currency];
    
    dom.convertedPrice.textContent = 
      `${currency} ${convertedPrice.toFixed(2)}`;
  });
}

// 7. Bulk Discounts
function initBulkDiscounts() {
  const bulkTiers = [
    { minQty: 5, discount: 0.05 },  // 5% off
    { minQty: 10, discount: 0.10 }, // 10% off
    { minQty: 20, discount: 0.15 }  // 15% off
  ];

  dom.qtyInput.addEventListener('change', function() {
    const qty = parseInt(this.value);
    const bestTier = bulkTiers.reduce((best, tier) => 
      (qty >= tier.minQty && tier.discount > best.discount) ? tier : best, 
      { discount: 0 }
    );

    if (bestTier.discount > 0) {
      dom.bulkDiscountNotice.innerHTML = `
        <span class="discount-badge">${(bestTier.discount * 100)}% OFF</span>
        Bulk discount applied for ${qty}+ units
      `;
    } else {
      dom.bulkDiscountNotice.innerHTML = '';
    }
  });
}

// 8. Country Selector
function initCountrySelector() {
  const countries = [
    { code: 'US', name: 'United States', flag: 'us.png' },
    { code: 'GH', name: 'Ghana', flag: 'gh.png' },
    { code: 'UK', name: 'United Kingdom', flag: 'uk.png' },
    { code: 'CA', name: 'Canada', flag: 'ca.png' },
    { code: 'AU', name: 'Australia', flag: 'au.png' }
  ];

  const selector = document.getElementById('shipping-country');
  countries.forEach(country => {
    const option = new Option(country.name, country.code);
    option.dataset.flag = country.flag;
    selector.add(option);
  });

  selector.addEventListener('change', function() {
    localStorage.setItem('preferredCountry', this.value);
    updateShippingEstimate(this.value);
  });

  // Set initial country
  const savedCountry = localStorage.getItem('preferredCountry') || 'GH';
  selector.value = savedCountry;
  updateShippingEstimate(savedCountry);
}

// 9. Shipping Countdown Timer
function startCountdown() {
  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;

  function update() {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const diff = endOfDay - now;

    if (diff <= 0) {
      document.querySelector('.timer-text').textContent = 'Orders placed now will dispatch next business day';
      return;
    }

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownEl.textContent = 
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    setTimeout(update, 1000);
  }

  update();
}

// ===== UTILITY FUNCTIONS =====
function getCountryName(code) {
  const countries = {
    'US': 'United States',
    'GH': 'Ghana',
    'UK': 'United Kingdom',
    'CA': 'Canada',
    'AU': 'Australia'
  };
  return countries[code] || code;
}

function updateShippingEstimate(countryCode) {
  // Implementation from previous example
  // Updates the shipping timeline display
}