// How the "Add to order" buttons work:
// When you click a button, the click event first fires on the button and then
// bubbles up through its parents (the article, then the menu grid, and so on).
// So instead of adding a listener to every button, I add one listener to the
// menu grid and check which button was clicked using event.target.closest().
// This also works for cards added later (like today's special), because their
// clicks bubble up to the same grid listener. No need to attach anything new.

const menuGrid = document.getElementById('menu-grid');
const orderCountEl = document.getElementById('order-count');
const orderList = document.getElementById('order-list');
const orderEmpty = document.getElementById('order-empty');
const orderTotal = document.getElementById('order-total');
const clearBtn = document.getElementById('clear-order');

// each item looks like { name: 'Espresso', price: 120, qty: 2 }
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
  if (!button) return; // clicked somewhere on the card, not the button

  const item = button.dataset.item;
  const price = Number(button.dataset.price);
  addItem(item, price);

  button.textContent = 'Added ✓';
  setTimeout(() => {
    button.textContent = 'Add to order';
  }, 900);
});

// same trick for the cart - its buttons get re-created every render,
// so one listener on the list handles all of them
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

// adds a new card after the page has loaded (to test delegation)
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

// contact form (no backend yet, just shows a thank-you message)
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = form.elements.name.value.trim();
  statusEl.textContent = `Thanks, ${name}! We'll get back to you soon.`;
  form.reset();
});

renderOrder();
