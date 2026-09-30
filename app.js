const products = [
  { name: 'Cherry Pop Claw', type: 'clips', price: 149, note: 'Cherry red · glossy finish', tag: 'bestie pick', image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=80' },
  { name: 'Genda Phool Hoops', type: 'jewellery', price: 199, note: 'Gold tone · lightweight', tag: 'new in', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=700&q=80' },
  { name: 'Lilac Bow Clip', type: 'clips', price: 99, note: 'Soft satin · 1 piece', tag: 'under ₹100', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80' },
  { name: 'Mango Mini Potli', type: 'bags', price: 299, note: 'Handwoven · cotton', tag: 'desi fave', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=80' },
  { name: 'Nazar Bead Bracelet', type: 'jewellery', price: 129, note: 'Glass beads · adjustable', tag: 'good vibes', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=700&q=80' },
  { name: 'Mogra Scrunchie', type: 'clips', price: 119, note: 'Floral print · soft hold', tag: 'everyday', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80' },
  { name: 'Rani Heart Ring Set', type: 'jewellery', price: 179, note: 'Set of 3 · adjustable', tag: 'trending', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80' },
  { name: 'Jalebi Zip Pouch', type: 'bags', price: 249, note: 'Quilted · fits your extras', tag: 'new in', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80' }
];

const grid = document.querySelector('#productGrid');
const bagCount = document.querySelector('#bagCount');
const bagItems = new Map();

function render(filter = 'all') {
  grid.innerHTML = products.filter((product) => filter === 'all' || product.type === filter).map((product) => `
    <article class="product-card"><div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy"><span class="product-tag">${product.tag}</span><button class="add-button" data-add="${product.name}" aria-label="Add ${product.name} to bag">+</button></div>
    <div class="product-info"><h3>${product.name}</h3><p>${product.note}</p><span class="price">₹${product.price}</span></div></article>`).join('');
}
render();

function setCategory(filter) {
  document.querySelector('.category.active')?.classList.remove('active');
  const category = document.querySelector(`.category[data-filter="${filter}"]`);
  category?.classList.add('active');
  render(filter);
}

document.querySelectorAll('.category').forEach((button) => button.addEventListener('click', () => setCategory(button.dataset.filter)));

document.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', () => {
  const label = link.textContent.trim();
  if (label === 'New in') {
    setCategory('all');
    requestAnimationFrame(() => document.querySelectorAll('.product-card').forEach((card) => {
      card.hidden = !card.querySelector('.product-tag').textContent.includes('new in');
    }));
  } else if (label === 'Accessories') {
    setCategory('all');
  }
  document.querySelector('.nav-links').classList.remove('mobile-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const menuToggle = document.createElement('button');
menuToggle.className = 'menu-toggle';
menuToggle.type = 'button';
menuToggle.setAttribute('aria-label', 'Open navigation menu');
menuToggle.setAttribute('aria-expanded', 'false');
menuToggle.textContent = '☰';
document.querySelector('.top-actions').prepend(menuToggle);
menuToggle.addEventListener('click', () => {
  const open = document.querySelector('.nav-links').classList.toggle('mobile-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
});

const bagOverlay = document.createElement('div');
bagOverlay.className = 'bag-overlay';
bagOverlay.setAttribute('aria-hidden', 'true');
const bagDrawer = document.createElement('aside');
bagDrawer.className = 'bag-drawer';
bagDrawer.setAttribute('aria-label', 'Shopping bag');
bagDrawer.innerHTML = '<div class="bag-title"><h2>Your bag</h2><button class="bag-close" aria-label="Close bag">×</button></div><div class="bag-items"></div><div class="bag-summary"><div class="bag-total"><span>Subtotal</span><span class="bag-total-value">₹0</span></div><button class="bag-checkout">Continue to checkout</button></div>';
document.body.append(bagOverlay, bagDrawer);

function updateBag() {
  const items = [...bagItems.entries()];
  const count = items.reduce((total, [, quantity]) => total + quantity, 0);
  bagCount.textContent = count;
  const itemArea = bagDrawer.querySelector('.bag-items');
  itemArea.innerHTML = items.length ? items.map(([name, quantity]) => {
    const product = products.find((entry) => entry.name === name);
    return `<article class="bag-line"><img src="${product.image}" alt=""><div><strong>${product.name}</strong><small>₹${product.price} each</small><div class="bag-qty"><button data-qty="-1" data-product="${name}" aria-label="Remove one ${name}">−</button><span>${quantity}</span><button data-qty="1" data-product="${name}" aria-label="Add one ${name}">+</button></div><button class="bag-remove" data-remove="${name}">Remove</button></div><b>₹${product.price * quantity}</b></article>`;
  }).join('') : '<p class="bag-empty">Your bag is waiting for a little sparkle.<br>Pick something lovely from the edit.</p>';
  const subtotal = items.reduce((total, [name, quantity]) => total + products.find((entry) => entry.name === name).price * quantity, 0);
  bagDrawer.querySelector('.bag-total-value').textContent = `₹${subtotal}`;
}

function openBag() {
  updateBag();
  bagOverlay.classList.add('open');
  bagDrawer.classList.add('open');
  bagOverlay.setAttribute('aria-hidden', 'false');
}

function closeBag() {
  bagOverlay.classList.remove('open');
  bagDrawer.classList.remove('open');
  bagOverlay.setAttribute('aria-hidden', 'true');
}

document.querySelector('.bag-button').addEventListener('click', openBag);
bagOverlay.addEventListener('click', closeBag);
bagDrawer.querySelector('.bag-close').addEventListener('click', closeBag);
bagDrawer.addEventListener('click', (event) => {
  const quantityButton = event.target.closest('[data-qty]');
  const removeButton = event.target.closest('[data-remove]');
  if (quantityButton) {
    const name = quantityButton.dataset.product;
    const quantity = (bagItems.get(name) || 0) + Number(quantityButton.dataset.qty);
    if (quantity > 0) bagItems.set(name, quantity);
    else bagItems.delete(name);
    updateBag();
  }
  if (removeButton) {
    bagItems.delete(removeButton.dataset.remove);
    updateBag();
  }
});
bagDrawer.querySelector('.bag-checkout').addEventListener('click', () => {
  const toast = document.querySelector('#toast');
  toast.textContent = bagItems.size ? 'Checkout is coming soon ✦' : 'Your bag is empty ✦';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
});

grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  bagItems.set(button.dataset.add, (bagItems.get(button.dataset.add) || 0) + 1);
  updateBag();
  const toast = document.querySelector('#toast');
  toast.textContent = `${button.dataset.add} added to your bag ✦`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
});

const panel = document.querySelector('#chatPanel');
const messages = document.querySelector('#chatMessages');
const input = document.querySelector('#chatInput');
const status = document.querySelector('#chatStatus');
const conversation = [{ role: 'system', content: 'You are Gulabo, a warm Indian accessories shopping assistant. Answer the customer question directly and concisely. Recommend only products from this catalog: Cherry Pop Claw ₹149, Genda Phool Hoops ₹199, Lilac Bow Clip ₹99, Mango Mini Potli ₹299, Nazar Bead Bracelet ₹129, Mogra Scrunchie ₹119, Rani Heart Ring Set ₹179, Jalebi Zip Pouch ₹249. Ask one follow-up only when it helps.' }];
document.querySelector('#chatLauncher').onclick = () => panel.classList.add('open');
document.querySelector('#chatClose').onclick = () => panel.classList.remove('open');

function addMessage(text, kind) {
  const message = document.createElement('div');
  message.className = `message ${kind}`;
  message.textContent = text;
  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
}

function fallback(text) {
  const query = text.toLowerCase();
  const budget = Number(query.match(/(?:under|below|budget|₹|rs\.?\s*)(\d{2,4})/)?.[1]);
  const matches = products.filter((product) => !budget || product.price <= budget);
  if (query.includes('gift')) return `Gift idea: ${matches.find((product) => product.type === 'jewellery')?.name || 'Genda Phool Hoops'} is a sweet pick${budget ? ` under ₹${budget}` : ''}. Add a ${matches.find((product) => product.type === 'clips')?.name || 'Lilac Bow Clip'} for a little set.`;
  if (query.includes('college') || query.includes('everyday') || query.includes('daily')) return `For everyday college wear, I’d pick ${matches.find((product) => product.type === 'clips')?.name || 'Mogra Scrunchie'}; it’s easy to style and costs ₹${(matches.find((product) => product.type === 'clips') || products[5]).price}.`;
  if (query.includes('ring')) return 'The Rani Heart Ring Set is ₹179, adjustable, and comes as a set of three. It’s a cute pick for stacking.';
  if (query.includes('bracelet')) return 'The Nazar Bead Bracelet is ₹129 and adjustable, so it’s an easy everyday jewellery pick.';
  if (query.includes('clip') || query.includes('hair')) return 'For hair accessories, the Lilac Bow Clip is ₹99, the Mogra Scrunchie is ₹119, and the Cherry Pop Claw is ₹149.';
  if (query.includes('bag') || query.includes('pouch')) return 'The Mango Mini Potli is ₹299 for a festive touch, while the Jalebi Zip Pouch is ₹249 for everyday bits.';
  if (query.includes('shipping') || query.includes('delivery')) return 'We offer free shipping on orders above ₹499. Add a couple of favourites to reach the free-shipping minimum.';
  if (budget) return matches.length ? `For under ₹${budget}, you can choose ${matches.slice(0, 3).map((product) => `${product.name} (₹${product.price})`).join(', ')}. What kind of accessory are you after?` : `Nothing in the current edit is under ₹${budget}; our lowest-priced find is the Lilac Bow Clip at ₹99.`;
  if (query.includes('thank')) return 'You’re so welcome! I’m here for outfit ideas, gifting help, and finding a cute pick within your budget. 💗';
  return 'I can help with gift ideas, college-friendly picks, jewellery, clips, bags, shipping, or finding something under a price. What are you shopping for?';
}

async function askLlama(text) {
  status.textContent = 'Llama assistant · thinking...';
  try {
    conversation.push({ role: 'user', content: text });
    const response = await fetch('http://localhost:11434/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'llama3.2', stream: false, messages: conversation }) });
    if (!response.ok) throw new Error('offline');
    const data = await response.json();
    const reply = data.message?.content || fallback(text);
    conversation.push({ role: 'assistant', content: reply });
    addMessage(reply, 'bot');
    status.textContent = 'Connected to Llama · local mode';
  } catch {
    addMessage(fallback(text), 'bot');
    status.textContent = 'Llama offline · Gulabo guide active';
  }
}

document.querySelector('#chatForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  input.value = '';
  askLlama(text);
});
document.querySelectorAll('.quick-prompts button').forEach((button) => button.addEventListener('click', () => {
  input.value = button.textContent;
  document.querySelector('#chatForm').requestSubmit();
}));

const reviewsSection = document.createElement('section');
reviewsSection.className = 'reviews-section';
reviewsSection.innerHTML = '<div class="reviews-head"><div><p class="eyebrow">little love notes</p><h2>Customer reviews</h2></div><div class="reviews-average"><strong>4.9 <span class="review-stars">★★★★★</span></strong>Demo reviews</div></div><div class="review-grid"><article class="review-card"><div class="review-stars">★★★★★</div><blockquote>“The clip is so cute and actually stays put all day.”</blockquote><p>Cherry Pop Claw · Review shown as demo content.</p><span class="review-author">A happy Gulabo shopper <span class="verified">Sample</span></span></article><article class="review-card"><div class="review-stars">★★★★★</div><blockquote>“Got the hoops for my sister and she wore them to a family dinner.”</blockquote><p>Genda Phool Hoops · Review shown as demo content.</p><span class="review-author">A happy Gulabo shopper <span class="verified">Sample</span></span></article><article class="review-card"><div class="review-stars">★★★★★</div><blockquote>“Such a sweet little find for the price. Ordering another colour!”</blockquote><p>Lilac Bow Clip · Review shown as demo content.</p><span class="review-author">A happy Gulabo shopper <span class="verified">Sample</span></span></article></div>';
document.querySelector('#story').before(reviewsSection);
