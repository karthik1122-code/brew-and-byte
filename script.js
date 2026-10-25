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
const order = [];

menuGrid.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button || !menuGrid.contains(button)) return; // clicked a card, not a button

  const item = button.dataset.item; // reads data-item="..."
  order.push(item);
  orderCountEl.textContent = order.length;

  button.textContent = 'Added ✓';
  setTimeout(() => {
    button.textContent = 'Add to order';
  }, 900);

  console.log(`Added ${item}. Order:`, order);
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
    <button type="button" data-item="Filter Coffee">Add to order</button>
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
