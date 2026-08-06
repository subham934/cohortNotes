// State variables
let cart = [];
const products = {
  1: {
    name: "Sand Oversized Hoodie",
    price: 120.0,
    image: "images/oversized_hoodie.png",
  },
  2: {
    name: "Olive Linen Resort Shirt",
    price: 85.0,
    image: "images/linen_shirt.png",
  },
  3: {
    name: "Charcoal Cropped Trousers",
    price: 95.0,
    image: "images/cropped_trousers.png",
  },
  4: {
    name: "Obsidian Windbreaker Jacket",
    price: 145.0,
    image: "images/windbreaker_jacket.png",
  },
  5: {
    name: "Off-White Pique Polo",
    price: 75.0,
    image: "images/pique_polo.png",
  },
  6: {
    name: "Sand Cargo Shorts",
    price: 80.0,
    image: "images/cargo_shorts.png",
  },
  7: {
    name: "Charcoal Wool Sweater",
    price: 135.0,
    image: "images/wool_sweater.png",
  },
  8: {
    name: "Tan Technical Trench Coat",
    price: 195.0,
    image: "images/trench_coat.png",
  },
};

const fallbackUrls = {
  1: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
  2: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
  3: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80",
  4: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80",
  5: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80",
  6: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80",
  7: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=600&q=80",
  8: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80"
};

// DOM elements
let filterTabs, navLinks, productCards, cartBtn, cartDrawer, cartOverlay, closeCartBtn, shopNowCartBtn, cartItemsContainer, cartTotalSpan, cartCountBadge, cartDrawerCount, checkoutBtn, toastContainer;

// Initial setup
document.addEventListener("DOMContentLoaded", () => {
  // Bind DOM elements after page renders
  filterTabs = document.querySelectorAll(".filter-tab");
  navLinks = document.querySelectorAll(".nav-link");
  productCards = document.querySelectorAll(".product-card");
  cartBtn = document.getElementById("cartBtn");
  cartDrawer = document.getElementById("cartDrawer");
  cartOverlay = document.getElementById("cartOverlay");
  closeCartBtn = document.getElementById("closeCartBtn");
  shopNowCartBtn = document.getElementById("shopNowCartBtn");
  cartItemsContainer = document.getElementById("cartItems");
  cartTotalSpan = document.getElementById("cartTotal");
  cartCountBadge = document.querySelector(".cart-count");
  cartDrawerCount = document.getElementById("cartDrawerCount");
  checkoutBtn = document.querySelector(".checkout-btn");
  toastContainer = document.getElementById("toastContainer");

  initFilters();
  initCartEvents();
  initQuickAdd();
  initAnimations();
  initCursorTracker();
  initMagneticElements();
  initCardTiltParallax();
});

// 1. Custom Liquid Follower Cursor
function initCursorTracker() {
  let mouseX = 0, mouseY = 0;
  let followX = 0, followY = 0;
  const follower = document.querySelector('.cursor-follower');
  if (!follower) return;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.set('.cursor-dot', { x: mouseX, y: mouseY });
  });

  // Smooth lag follower loop
  gsap.ticker.add(() => {
    followX += (mouseX - followX) * 0.15;
    followY += (mouseY - followY) * 0.15;
    gsap.set('.cursor-follower', { x: followX, y: followY });
  });

  // Dynamic hover scale/morph states
  const refreshCursorHovers = () => {
    const links = document.querySelectorAll('a, button, .filter-tab, .qty-btn, .close-btn, .icon-btn');
    links.forEach(el => {
      // Avoid double binding
      el.removeEventListener('mouseenter', onLinkEnter);
      el.removeEventListener('mouseleave', onLinkLeave);
      el.addEventListener('mouseenter', onLinkEnter);
      el.addEventListener('mouseleave', onLinkLeave);
    });

    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(el => {
      el.removeEventListener('mouseenter', onSizeEnter);
      el.removeEventListener('mouseleave', onSizeLeave);
      el.addEventListener('mouseenter', onSizeEnter);
      el.addEventListener('mouseleave', onSizeLeave);
    });

    productCards.forEach(card => {
      card.removeEventListener('mouseenter', onCardEnter);
      card.removeEventListener('mouseleave', onCardLeave);
      card.addEventListener('mouseenter', onCardEnter);
      card.addEventListener('mouseleave', onCardLeave);
    });
  };

  function onLinkEnter() { follower.classList.add('hover-link'); }
  function onLinkLeave() { follower.classList.remove('hover-link'); }
  
  function onSizeEnter() {
    follower.classList.add('hover-link');
    follower.textContent = "ADD";
    gsap.to(follower, { color: 'rgba(26, 26, 26, 0.7)', duration: 0.2 });
  }
  function onSizeLeave() {
    follower.classList.remove('hover-link');
    follower.textContent = "";
  }

  function onCardEnter() {
    follower.classList.add('hover-card');
    follower.textContent = "VIEW";
  }
  function onCardLeave() {
    follower.classList.remove('hover-card');
    follower.textContent = "";
  }

  refreshCursorHovers();
  // Expose global binding refresher
  window.refreshCursorBindings = refreshCursorHovers;
}

// 2. Magnetic Interactive Physics
function initMagneticElements() {
  const magnetics = document.querySelectorAll('[data-magnetic]');

  magnetics.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const bound = el.getBoundingClientRect();
      const x = e.clientX - (bound.left + bound.width / 2);
      const y = e.clientY - (bound.top + bound.height / 2);

      gsap.to(el, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.35,
        ease: "power2.out"
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.65,
        ease: "elastic.out(1.1, 0.4)"
      });
    });
  });
}

// 3. 3D Card Tilt & Interior Image Parallax
function initCardTiltParallax() {
  productCards.forEach(card => {
    const image = card.querySelector('.product-image');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xc = rect.width / 2;
      const yc = rect.height / 2;

      // Tilt limit degrees (+- 9 deg)
      const tiltX = ((yc - y) / yc) * 9;
      const tiltY = ((x - xc) / xc) * 9;

      gsap.to(card, {
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 1000,
        ease: "power2.out",
        duration: 0.4
      });

      // Offset inner image opposite to create parallax depth
      const imgMoveX = ((xc - x) / xc) * 9;
      const imgMoveY = ((yc - y) / yc) * 9;

      gsap.to(image, {
        x: imgMoveX,
        y: imgMoveY,
        scale: 1.08,
        ease: "power2.out",
        duration: 0.4
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        ease: "power3.out",
        duration: 0.8
      });
      gsap.to(image, {
        x: 0,
        y: 0,
        scale: 1,
        ease: "power3.out",
        duration: 0.8
      });
    });
  });
}

// 4. Filtering Logic with Staggered Grid Transitions
function initFilters() {
  const handleFilter = (filterValue) => {
    // Update active classes on filter tabs
    filterTabs.forEach((tab) => {
      if (tab.getAttribute("data-filter") === filterValue) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    // Update active classes on nav links
    navLinks.forEach((link) => {
      if (link.getAttribute("data-filter") === filterValue) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    const hiddenCards = [];
    const visibleCards = [];

    productCards.forEach((card) => {
      const category = card.getAttribute("data-category");
      if (filterValue === "all" || category === filterValue) {
        visibleCards.push(card);
      } else {
        hiddenCards.push(card);
      }
    });

    // GSAP Exit Stagger
    if (hiddenCards.length > 0) {
      gsap.to(hiddenCards, {
        scale: 0.92,
        autoAlpha: 0,
        y: 12,
        duration: 0.35,
        stagger: 0.04,
        ease: "power2.inOut",
        onComplete: () => {
          hiddenCards.forEach(c => c.style.display = "none");
        }
      });
    }

    // GSAP Entrance Stagger
    visibleCards.forEach(c => {
      if (c.style.display === "none") {
        c.style.display = "flex";
        gsap.set(c, { scale: 0.92, autoAlpha: 0, y: 12 });
      }
    });

    gsap.to(visibleCards, {
      scale: 1,
      autoAlpha: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.06,
      ease: "power3.out",
      delay: hiddenCards.length > 0 ? 0.28 : 0
    });
  };

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      handleFilter(tab.getAttribute("data-filter"));
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      handleFilter(link.getAttribute("data-filter"));
    });
  });
}

// 5. Cart Sidebar Drawer Dynamic Timeline
let cartDrawerTimeline = null;
function initCartEvents() {
  const toggleCart = (openState) => {
    const isOpen = typeof openState === 'boolean' ? openState : !cartDrawer.classList.contains('open');

    if (cartDrawerTimeline) cartDrawerTimeline.kill();
    cartDrawerTimeline = gsap.timeline();

    if (isOpen) {
      document.body.classList.add("cart-open");
      cartDrawer.classList.add("open");
      cartOverlay.classList.add("open");

      cartDrawerTimeline.fromTo(cartDrawer,
        { x: "100%" },
        { x: "0%", duration: 0.6, ease: "power3.out" }
      );

      cartDrawerTimeline.fromTo(cartOverlay,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.45 },
        0
      );

      // Stagger cart items reveal
      const cartItems = document.querySelectorAll(".cart-item");
      if (cartItems.length > 0) {
        cartDrawerTimeline.fromTo(cartItems,
          { x: 35, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" },
          0.15
        );
      }
    } else {
      cartDrawerTimeline.to(cartDrawer, {
        x: "100%",
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          document.body.classList.remove("cart-open");
          cartDrawer.classList.remove("open");
          cartOverlay.classList.remove("open");
        }
      });

      cartDrawerTimeline.to(cartOverlay, {
        autoAlpha: 0,
        duration: 0.4
      }, 0);
    }
  };

  cartBtn.addEventListener("click", () => toggleCart(true));
  closeCartBtn.addEventListener("click", () => toggleCart(false));
  cartOverlay.addEventListener("click", () => toggleCart(false));
  shopNowCartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleCart(false);
  });
}

// 6. Add to Cart Logic & Size Selector Listeners
function initQuickAdd() {
  const sizeBtns = document.querySelectorAll(".size-btn");

  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const card = btn.closest(".product-card");
      const productId = card.getAttribute("data-id");
      const size = btn.getAttribute("data-size");

      addToCart(productId, size, card);
    });
  });
}

// Entrance Hero & Product animations
function initAnimations() {
  gsap.from(".logo", {
    y: -26,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });
  gsap.from(".nav-link", {
    y: -18,
    opacity: 0,
    duration: 0.7,
    stagger: 0.08,
    ease: "power3.out",
    delay: 0.15,
  });
  gsap.from(".icon-btn", {
    y: -10,
    opacity: 0,
    duration: 0.6,
    stagger: 0.08,
    ease: "power3.out",
    delay: 0.18,
  });
  gsap.from(
    ".hero-subtitle, .hero-badge, .hero-title, .hero-description, .hero-stats, .filter-container",
    {
      y: 30,
      opacity: 0,
      duration: 0.95,
      ease: "power3.out",
      stagger: 0.12,
      delay: 0.22,
    }
  );
  gsap.fromTo(".product-card",
    {
      opacity: 0,
      y: 36,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.95,
      ease: "power3.out",
      stagger: 0.08,
      delay: 0.55,
    }
  );
}

// 7. Dynamic flying item particle to cart
function triggerFlyToCartAnimation(cardElement) {
  const imgElement = cardElement.querySelector('.product-image');
  const cartBadge = document.querySelector('#cartBtn');

  if (!imgElement || !cartBadge) return;

  const startRect = imgElement.getBoundingClientRect();
  const endRect = cartBadge.getBoundingClientRect();

  // Spawn absolute clone
  const particle = document.createElement('img');
  particle.src = imgElement.src;
  particle.className = 'floating-cart-particle';
  
  // Set fallback just in case clone source is broken
  particle.onerror = function() {
    this.onerror = null;
    const prodId = cardElement.getAttribute('data-id');
    this.src = fallbackUrls[prodId];
  };
  
  // Position at original image bounds
  particle.style.left = startRect.left + 'px';
  particle.style.top = startRect.top + 'px';
  particle.style.width = startRect.width + 'px';
  particle.style.height = startRect.height + 'px';

  document.body.appendChild(particle);

  const deltaX = (endRect.left + endRect.width / 2) - (startRect.left + startRect.width / 2);
  const deltaY = (endRect.top + endRect.height / 2) - (startRect.top + startRect.height / 2);

  const flyTL = gsap.timeline({
    onComplete: () => {
      particle.remove();
      
      // Pop badge scale bounce
      gsap.fromTo(cartCountBadge,
        { scale: 1 },
        { scale: 1.35, duration: 0.22, ease: "back.out(2.5)", yoyo: true, repeat: 1 }
      );
    }
  });

  // X movement linear
  flyTL.to(particle, {
    x: deltaX,
    duration: 0.85,
    ease: "power1.inOut"
  }, 0);

  // Y movement arching upward then dropping down
  flyTL.to(particle, {
    y: deltaY - 140, // peak upward arc height
    duration: 0.38,
    ease: "power2.out"
  }, 0);
  flyTL.to(particle, {
    y: deltaY,
    duration: 0.47,
    ease: "power2.in"
  }, 0.38);

  // Resize and spin details
  flyTL.to(particle, {
    scale: 0.12,
    rotation: 720,
    opacity: 0.45,
    duration: 0.85,
    ease: "power1.in"
  }, 0);
}

function addToCart(productId, size, cardElement) {
  const product = products[productId];
  if (!product) return;

  const existingItem = cart.find(
    (item) => item.id === productId && item.size === size,
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size,
      quantity: 1,
    });
  }

  updateCartUI();

  // Play Flying Arc Animation
  if (cardElement) {
    triggerFlyToCartAnimation(cardElement);
  }

  showToast(`Added ${product.name} (Size ${size}) to your cart.`);

  // Open drawer after flight completes
  setTimeout(() => {
    if (!cartDrawer.classList.contains("open")) {
      const openCartBtn = document.getElementById("cartBtn");
      if (openCartBtn) openCartBtn.click();
    }
  }, 900);
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountBadge.textContent = totalItems;
  cartDrawerCount.textContent = totalItems;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
                  <div class="cart-empty-message">
                      <p>Your cart is empty.</p>
                      <a href="#" class="shop-now-btn" onclick="document.getElementById('closeCartBtn').click();">Continue Shopping</a>
                  </div>
              `;
    cartTotalSpan.textContent = "$0.00";
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;
  let totalCost = 0;

  cartItemsContainer.innerHTML = cart
    .map((item, index) => {
      const itemTotal = item.price * item.quantity;
      totalCost += itemTotal;

      return `
                  <div class="cart-item" data-index="${index}">
                      <img src="${item.image}" onerror="this.onerror=null; this.src='${fallbackUrls[item.id]}';" alt="${item.name}" class="cart-item-img">
                      <div class="cart-item-details">
                          <h4 class="cart-item-title">${item.name}</h4>
                          <span class="cart-item-size">Size: ${item.size}</span>
                          <div class="cart-item-qty-row">
                              <div class="qty-selector">
                                  <button class="qty-btn minus" onclick="changeQty(${index}, -1)">–</button>
                                  <span class="qty-val">${item.quantity}</span>
                                  <button class="qty-btn plus" onclick="changeQty(${index}, 1)">+</button>
                              </div>
                              <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
                          </div>
                      </div>
                      <button class="cart-item-remove" onclick="removeFromCart(${index})" aria-label="Remove item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                  </div>
              `;
    })
    .join("");

  cartTotalSpan.textContent = `$${totalCost.toFixed(2)}`;
  
  // Re-bind cursor hovers for dynamically created cart buttons
  if (window.refreshCursorBindings) {
    window.refreshCursorBindings();
  }
}

window.changeQty = function (index, delta) {
  const item = cart[index];
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
};

window.removeFromCart = function (index) {
  const itemElement = document.querySelector(`.cart-item[data-index="${index}"]`);
  if (itemElement) {
    // Elegant stagger removal
    gsap.to(itemElement, {
      x: 40,
      autoAlpha: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        cart.splice(index, 1);
        updateCartUI();
      }
    });
  } else {
    cart.splice(index, 1);
    updateCartUI();
  }
};

// Toast Notification Popup Builder
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
              <div class="toast-body">
                  <svg class="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>${message}</span>
              </div>
          `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, 3000);
}
