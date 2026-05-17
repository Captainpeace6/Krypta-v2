// --- MOTION ENGINE ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- NAVIGATION & HEADER ---
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// --- CURSOR ---
const cursor = document.createElement('div');
cursor.id = 'k-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: "power2.out"
  });
});

document.querySelectorAll('a, button, .luxury-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursor, { scale: 3, background: 'rgba(200, 168, 75, 0.2)', border: '1px solid #c8a84b' });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursor, { scale: 1, background: '#c8a84b', border: 'none' });
  });
});

// --- CART LOGIC ---
let cart = JSON.parse(localStorage.getItem('kryptaa_cart') || '[]');

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  renderCartContent();
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

function addToCart(pid, size) {
  const product = typeof getProductById === 'function' ? getProductById(pid) : null;
  if (!product) return;

  const key = `${pid}-${size}`;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      key,
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      size,
      qty: 1
    });
  }

  localStorage.setItem('kryptaa_cart', JSON.stringify(cart));
  renderCartContent();
  openCart();
}

function renderCartContent() {
  const container = document.getElementById('cartItemsList');
  const countNav = document.getElementById('cartCountNav');
  const countDrawer = document.getElementById('cartCount');
  const totalAmount = document.getElementById('cartTotalAmount');

  if (!container) return;

  const totalQty = cart.reduce((acc, i) => acc + i.qty, 0);
  const totalVal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

  if (countNav) countNav.textContent = totalQty;
  if (countDrawer) countDrawer.textContent = totalQty;
  if (totalAmount) totalAmount.textContent = totalVal;

  if (cart.length === 0) {
    container.innerHTML = '<div style="font-family: var(--f-mono); font-size: 0.7rem; color: var(--k-muted); text-align: center; margin-top: 50px;">YOUR BAG IS EMPTY</div>';
    return;
  }

  container.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">SIZE: ${item.size} × ${item.qty}</div>
        <div class="cart-item-meta" style="margin-top: 5px; color: var(--k-gold);">$${item.price * item.qty}.00</div>
      </div>
      <button onclick="removeFromCart(${idx})" style="background: none; border: none; color: var(--k-muted); cursor: pointer; font-size: 0.8rem;">×</button>
    </div>
  `).join('');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('kryptaa_cart', JSON.stringify(cart));
  renderCartContent();
}

// Global expose
window.openCart = openCart;
window.closeCart = closeCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.renderCartContent = renderCartContent;
