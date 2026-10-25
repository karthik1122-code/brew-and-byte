# Brew & Byte — Café Landing Page + JS Drill

A one-page, responsive and keyboard-accessible website for the neighbourhood café **Brew & Byte**, plus a JavaScript output drill.

Built with plain HTML, CSS and JavaScript — no frameworks, no build step.

- **Live site:** https://brew-and-byte-omega.vercel.app
- **Documentation:** https://brew-and-byte-omega.vercel.app/docs.html

## Run it

```bash
# Website: just open the file
open index.html            # or double-click it / use VS Code Live Server

# JS drill
cd snippets
for f in *.js; do echo "== $f"; node "$f"; done
```

## Project structure

```
brew-and-byte/
├── index.html        # semantic page: header, nav, main, sections, articles, footer
├── styles.css        # Flexbox nav, Grid menu, sticky header, badge, 768px media query
├── script.js         # one delegated click listener for all "Add to order" buttons
├── images/           # menu + hero images (SVG)
├── snippets/         # 11 JS files for the output drill (#5 has var + let versions)
├── PREDICTIONS.md    # prediction → real output → why, for every snippet
└── README.md
```

## What's covered

| Task | Where |
| --- | --- |
| Semantic HTML (`header`, `nav`, `main`, `section`, `article` per item, `footer`) | `index.html` |
| Alt text on every image, labelled form with `type="email"` + `required` | `index.html` |
| Visible focus styles + skip link, everything reachable with Tab | `styles.css` (`:focus-visible`) |
| Flexbox nav / Grid menu with `repeat(auto-fit, minmax(220px, 1fr))` + comments on why | `styles.css` |
| `rem` for fonts/spacing, `%` for widths, stacked nav at `max-width: 768px` | `styles.css` |
| Sticky header, absolute **Bestseller** badge inside a relative card | `styles.css` |
| One delegated listener, `closest('button')`, `data-item`, live "Items in order: N" | `script.js` |
| Bubbling + delegation explained, with a button that adds a menu item later to prove it | `script.js` |

---

## Task 3 — Specificity

```html
<p id="price" class="amount">…</p>   <!-- placed inside <section class="menu"> -->
```

```css
#price        { color: green; }
.menu .amount { color: red; }
p.amount      { color: blue; }
```

**Prediction:** green. **Result in the browser:** green.

**Why:** when several rules match the same element, the browser compares specificity as (IDs, classes, elements):

| Selector | IDs | Classes | Elements | Score |
| --- | --- | --- | --- | --- |
| `#price` | 1 | 0 | 0 | **(1, 0, 0)** |
| `.menu .amount` | 0 | 2 | 0 | (0, 2, 0) |
| `p.amount` | 0 | 1 | 1 | (0, 1, 1) |

The columns are compared left to right, and the first difference decides. `#price` has an ID and the others don't, so it wins no matter how many classes the others stack. Source order only matters when specificity is exactly equal. (Between the two losers, `.menu .amount` beats `p.amount` because 2 classes > 1 class, so if the ID rule were removed the text would be red.)

## Task 3 — `box-sizing: border-box`

Take a card with `width: 300px; padding: 20px; border: 2px solid`.

- **Default (`content-box`):** `width` sets only the content. The rendered card is `300 + 20 + 20 + 2 + 2 = 344px` wide. Padding and border are added on top, so cards overflow their grid columns and widths are hard to reason about.
- **With `border-box`:** `width` includes padding and border. The rendered card is exactly **300px**; the content area shrinks to `300 − 40 − 4 = 256px`.

That's why the stylesheet sets `*, *::before, *::after { box-sizing: border-box; }`: a `width: 100%` card with padding fits its grid cell exactly instead of spilling out.

---

## JS output drill

All 10 snippets (and both versions of #5) are in [`snippets/`](snippets/), with predictions, real Node output and explanations in **[PREDICTIONS.md](PREDICTIONS.md)**.
