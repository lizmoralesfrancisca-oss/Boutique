// BASE DE DATOS DE EXACTAMENTE 50 PRODUCTOS
const rawCategories = ['maquillaje', 'skincare', 'accesorios', 'fragancias'];
const names = [
  "Paleta Sombras Velvet Lavender", "Serum Hidratante Glow", "Tote Bag Pink Blossom", "Perfume Lilac Dream",
  "Gloss Menta & Rosa", "Mascarilla Humectante", "Espejo Vintage Violet", "Bruma Facial Soft Rose",
  "Labial Mate Cotton Candy", "Tónico Facial Chamomile", "Diadema Perlas Pastel", "Perfume Vanilla Kiss",
  "Rubor Líquido Rosy Glow", "Crema Contorno de Ojos", "Cepillo Facial Silicona", "Agua de Colonia Violeta",
  "Iluminador Pearl Light", "Exfoliante Labial Fresa", "Pinzas Cabello Marble Pink", "Perfume Sweet Peony",
  "Delineador Pastel Purple", "Gel Limpiador Limón", "Bolsa Cosmetiquera Lilac", "Bruma Corporal Berries",
  "Polvo Traslúcido Silk", "Aceite Facial Rosehip", "Set Brochas Pastel Soft", "Perfume Velvet Orchid",
  "Sombra Individual Sparkle", "Serum Ácido Hialurónico", "Lentes Sol Cat Eye Pink", "Perfume Blossom Petals",
  "Bálm Labial Durazno", "Mascarilla Arcilla Rosa", "Scrunchie Seda Purple", "Colonia Soft Cloud",
  "Tinta Labial Cherry Rose", "Crema de Manos Lavanda", "Organizador Acrílico Pink", "Perfume Lavender Fog",
  "Corrector Soft Touch", "Espuma Limpiadora Smooth", "Pulsera Dijes Pastel", "Bruma Fijadora Fix Glow",
  "Base Ligera Hydrating", "Parches Ojeras Collagen", "Esmalte Uñas Lilac Frost", "Perfume Spring Dew",
  "Bronzer Sunkissed Pink", "Mascarilla Nocturna Berry"
];

const sampleImages = [
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80"
];

// GENERAR LISTADO DE 50 PRODUCTOS CON 4 ÁNGULOS CADA UNO
const products = Array.from({ length: 50 }, (_, i) => {
  const catIndex = i % rawCategories.length;
  const baseImg = sampleImages[i % sampleImages.length];
  const altImg1 = sampleImages[(i + 1) % sampleImages.length];
  const altImg2 = sampleImages[(i + 2) % sampleImages.length];
  const altImg3 = sampleImages[(i + 3) % sampleImages.length];

  return {
    id: i + 1,
    title: names[i] || `Producto Chic Pastel ${i + 1}`,
    category: rawCategories[catIndex],
    price: Math.floor(120 + (i * 15) % 350),
    description: `Exclusivo producto Chic & Glow de la colección pastel. Diseñado para realzar tu belleza con una formulación suave, ingredientes de alta calidad y una presentación estética única en tonos morados y rosas.`,
    tag: i % 3 === 0 ? "Bestseller" : (i % 2 === 0 ? "Nuevo" : "Popular"),
    angles: [
      { label: "Frontal", url: baseImg },
      { label: "Ángulo 45°", url: altImg1 },
      { label: "Detalle", url: altImg2 },
      { label: "Empaque", url: altImg3 }
    ]
  };
});

// ESTADO GENERAL
let currentPage = 1;
const itemsPerPage = 12;
let filteredProducts = [...products];
let cart = [];
let activeModalProduct = null;

// ELEMENTOS DOM
const productsGrid = document.getElementById('products-grid');
const paginationContainer = document.getElementById('pagination');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');

// MODAL ELEMENTS
const modalOverlay = document.getElementById('product-modal-overlay');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalMainImg = document.getElementById('modal-main-img');
const modalThumbnails = document.getElementById('modal-thumbnails');
const modalCategory = document.getElementById('modal-category');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDesc = document.getElementById('modal-desc');
const modalAddCartBtn = document.getElementById('modal-add-cart-btn');

// CARRITO ELEMENTS
const cartModal = document.getElementById('cart-modal');
const cartOverlay = document.getElementById('cart-overlay');
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');

// RENDERIZAR PRODUCTOS EN EL CATÁLOGO
function renderCatalog() {
  productsGrid.innerHTML = '';
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredProducts.slice(start, end);

  if (pageItems.length === 0) {
    productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No se encontraron productos en esta búsqueda 🌸</p>`;
    paginationContainer.innerHTML = '';
    return;
  }

  pageItems.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img-wrap">
        <span class="product-badge">${product.tag}</span>
        <img src="${product.angles[0].url}" alt="${product.title}">
        <span class="view-angles-hint">🔍 4 Ángulos</span>
      </div>
      <div class="product-details">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-footer">
          <span class="product-price">$${product.price} MXN</span>
          <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${product.id})" aria-label="Agregar">+</button>
        </div>
      </div>
    `;

    // ABRE MODAL MULTI-ÁNGULO AL HACER CLICK EN EL PRODUCTO
    card.addEventListener('click', () => openProductModal(product));
    productsGrid.appendChild(card);
  });

  renderPagination();
}

// RENDERIZAR BOTONES DE PAGINACIÓN
function renderPagination() {
  paginationContainer.innerHTML = '';
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    btn.textContent = i;
    btn.addEventListener('click', () => {
      currentPage = i;
      renderCatalog();
      window.scrollTo({ top: document.getElementById('productos').offsetTop - 80, behavior: 'smooth' });
    });
    paginationContainer.appendChild(btn);
  }
}

// LÓGICA DEL MODAL MULTI-ÁNGULO
function openProductModal(product) {
  activeModalProduct = product;
  modalCategory.textContent = product.category;
  modalTitle.textContent = product.title;
  modalPrice.textContent = `$${product.price} MXN`;
  modalDesc.textContent = product.description;
  
  modalMainImg.src = product.angles[0].url;

  modalThumbnails.innerHTML = product.angles.map((angle, idx) => `
    <button class="thumb-btn ${idx === 0 ? 'active' : ''}" onclick="switchModalAngle('${angle.url}', this)">
      <img src="${angle.url}" alt="${angle.label}">
      <span class="thumb-label">${angle.label}</span>
    </button>
  `).join('');

  modalOverlay.classList.add('open');
}

window.switchModalAngle = function(url, btnElement) {
  modalMainImg.src = url;
  document.querySelectorAll('.thumb-btn').forEach(b => b.classList.remove('active'));
  btnElement.classList.add('active');
};

closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('open'));
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) modalOverlay.classList.remove('open');
});

modalAddCartBtn.addEventListener('click', () => {
  if (activeModalProduct) {
    addToCart(activeModalProduct.id);
    modalOverlay.classList.remove('open');
  }
});

// BÚSQUEDA Y FILTRADO POR CATEGORÍA
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  filteredProducts = products.filter(p => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
  currentPage = 1;
  renderCatalog();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;

    if (cat === 'all') {
      filteredProducts = [...products];
    } else {
      filteredProducts = products.filter(p => p.category === cat);
    }
    currentPage = 1;
    renderCatalog();
  });
});

// LÓGICA DEL CARRITO EN TIEMPO REAL
window.addToCart = function(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.product.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ product, qty: 1 });
  }

  updateCart();
  openCart();
};

window.changeQty = function(id, delta) {
  const item = cart.find(i => i.product.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.product.id !== id);
  }
  updateCart();
};

function updateCart() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalCount;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); margin-top: 40px;">Tu carrito está vacío 🌸</p>`;
    cartTotalPrice.textContent = '$0.00 MXN';
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.product.angles[0].url}" alt="${item.product.title}">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.product.title}</div>
        <div class="cart-item-price">$${item.product.price} MXN</div>
        <div class="cart-qty-controls">
          <button class="cart-qty-btn" onclick="changeQty(${item.product.id}, -1)">-</button>
          <span style="font-size: 0.85rem; font-weight:600;">${item.qty}</span>
          <button class="cart-qty-btn" onclick="changeQty(${item.product.id}, 1)">+</button>
        </div>
      </div>
    </div>
  `).join('');

  const totalSum = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
  cartTotalPrice.textContent = `$${totalSum}.00 MXN`;
}

function openCart() {
  cartModal.classList.add('open');
  cartOverlay.classList.add('active');
}

function closeCart() {
  cartModal.classList.remove('open');
  cartOverlay.classList.remove('active');
}

openCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// INICIALIZACIÓN
renderCatalog();