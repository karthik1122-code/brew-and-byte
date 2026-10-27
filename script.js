// ===== Event delegation: one listener for every "Add to order" button =====
//
// EVENT BUBBLING: when you click a <button>, the click event fires on the button
// first, then "bubbles" up through every ancestor — article → .menu-grid → section
// → main → body → document. Any ancestor can listen for it.
//
// DELEGATION uses that: instead of attaching one listener per button, we attach ONE
// listener to the parent .menu-grid. event.target tells us what was actually
// clicked, and closest('button') walks up from there to the button (so a click on
// any text/icon inside the button still counts).
//
// Because the listener lives on the grid — not on the buttons — menu items added
// LATER (see "Add today's special" below) work automatically: their clicks bubble
// up to the same grid listener. Per-button listeners would have to be re-attached
// to every new card.

const menuGrid = document.getElementById('menu-grid');
const orderCountEl = document.getElementById('order-count');
const orderList = document.getElementById('order-list');
const orderEmpty = document.getElementById('order-empty');
const orderTotal = document.getElementById('order-total');
const clearBtn = document.getElementById('clear-order');

// one entry per item, e.g. { name: 'Espresso', price: 120, qty: 2 }
let order = [];

function addItem(name, price) {
  const existing = order.find((line) => line.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    order.push({ name, price, qty: 1 });
  }
  renderOrder();
}

function changeQty(name, amount) {
  const line = order.find((l) => l.name === name);
  if (!line) return;
  line.qty += amount;
  // dropping to 0 removes it from the cart
  if (line.qty <= 0) {
    order = order.filter((l) => l.name !== name);
  }
  renderOrder();
}

function removeItem(name) {
  order = order.filter((line) => line.name !== name);
  renderOrder();
}

function renderOrder() {
  const count = order.reduce((sum, line) => sum + line.qty, 0);
  const total = order.reduce((sum, line) => sum + line.qty * line.price, 0);

  orderCountEl.textContent = count;
  orderTotal.textContent = `₹${total}`;
  orderEmpty.hidden = order.length > 0;
  clearBtn.disabled = order.length === 0;

  orderList.innerHTML = order
    .map(
      (line) => `
      <li class="order-line">
        <span class="order-name">${line.name}</span>
        <div class="qty">
          <button type="button" data-action="decrease" data-item="${line.name}" aria-label="Remove one ${line.name}">−</button>
          <span aria-label="Quantity">${line.qty}</span>
          <button type="button" data-action="increase" data-item="${line.name}" aria-label="Add one more ${line.name}">+</button>
        </div>
        <span class="order-price">₹${line.qty * line.price}</span>
        <button type="button" class="remove" data-action="remove" data-item="${line.name}">Remove</button>
      </li>`,
    )
    .join('');
}

menuGrid.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button || !menuGrid.contains(button)) return; // clicked a card, not a button

  const item = button.dataset.item; // reads data-item="..."
  const price = Number(button.dataset.price);
  addItem(item, price);

  button.textContent = 'Added ✓';
  setTimeout(() => {
    button.textContent = 'Add to order';
  }, 900);
});

// Same idea for the cart: the − / + / Remove buttons are re-created on every
// render, so one listener on the list handles all of them.
orderList.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const name = button.dataset.item;
  const action = button.dataset.action;

  if (action === 'increase') changeQty(name, 1);
  if (action === 'decrease') changeQty(name, -1);
  if (action === 'remove') removeItem(name);
});

clearBtn.addEventListener('click', () => {
  order = [];
  renderOrder();
});

// ===== Proves delegation works for items added later =====
const addSpecialBtn = document.getElementById('add-special');

addSpecialBtn.addEventListener('click', () => {
  const card = document.createElement('article');
  card.className = 'menu-card';
  card.innerHTML = `
    <img src="images/espresso.svg" alt="A cup of filter coffee, today's special" width="400" height="260" />
    <h3>Today's Special: Filter Coffee</h3>
    <p>South Indian filter coffee with frothy milk.</p>
    <p class="cost">₹100</p>
    <button type="button" data-item="Filter Coffee" data-price="100">Add to order</button>
  `;
  menuGrid.appendChild(card);
  addSpecialBtn.disabled = true;
  addSpecialBtn.textContent = "Today's special added";
});

// ===== Contact form (front-end only) =====
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

form.addEventListener('submit', (event) => {
  event.preventDefault(); // `required` + type="email" already validated the fields
  const name = form.elements.name.value.trim();
  statusEl.textContent = `Thanks, ${name}! We'll get back to you soon.`;
  form.reset();
});

renderOrder();
