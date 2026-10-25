# JS Output Drill — Predictions

Each snippet lives in its own file in [`snippets/`](snippets/) and was run with `node <file>` (Node v22).
Format: **prediction first**, then the **real output**, then **why**.

Run them all:

```bash
cd snippets
for f in *.js; do echo "== $f"; node "$f"; done
```

---

### 1 · `var` hoisting — `01-var-hoisting.js`

```js
console.log(a); var a = 5;
```

- **Prediction:** `undefined`
- **Real output:** `undefined`
- **Why:** `var a` is hoisted to the top of the scope and initialised to `undefined`; the `= 5` assignment only happens on line 2.

---

### 2 · `let` and the TDZ — `02-let-tdz.js`

```js
console.log(b); let b = 5;
```

- **Prediction:** `ReferenceError`
- **Real output:** `ReferenceError: Cannot access 'b' before initialization`
- **Why:** `let` is hoisted too, but stays in the Temporal Dead Zone (uninitialised) until its declaration line runs, so reading it earlier throws.

---

### 3 · Function declaration hoisting — `03-function-hoisting.js`

```js
sayHi(); function sayHi() { console.log('hi'); }
```

- **Prediction:** `hi`
- **Real output:** `hi`
- **Why:** Function declarations are hoisted with their full body, so they can be called before the line they're written on.

---

### 4 · Closure counter — `04-closure-counter.js`

```js
const c = makeCounter(); c(); c(); console.log(c()); // makeCounter returns () => ++count
```

- **Prediction:** `3`
- **Real output:** `3`
- **Why:** The returned arrow function closes over the same `count` variable, which survives between calls: 1, 2, then the logged call returns 3.

---

### 5a · `setTimeout` in a `var` loop — `05a-loop-var.js`

```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));
```

- **Prediction:** `3` `3` `3`
- **Real output:**
  ```
  3
  3
  3
  ```
- **Why:** `var` is function-scoped, so all three callbacks share ONE `i`; they run after the loop ends, when `i` is already 3.

### 5b · Same loop with `let` — `05b-loop-let.js`

```js
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i));
```

- **Prediction:** `0` `1` `2`
- **Real output:**
  ```
  0
  1
  2
  ```
- **Why:** `let` is block-scoped and the loop creates a fresh `i` binding per iteration, so each callback captures its own value.

---

### 6 · `call` and `bind` — `06-call-bind.js`

```js
function intro(city) { return `${this.name} from ${city}`; }
console.log(intro.call({ name: 'Ravi' }, 'Pune'), intro.bind({ name: 'Meena' })('Delhi'));
```

- **Prediction:** `Ravi from Pune Meena from Delhi`
- **Real output:** `Ravi from Pune Meena from Delhi`
- **Why:** `call` invokes immediately with `this` set to the first argument; `bind` returns a new function with `this` permanently fixed, which we then call.

---

### 7 · Regular method vs arrow function — `07-this-arrow.js`

```js
const user = { name: 'Asha', regular() { return this.name; }, arrow: () => this.name };
console.log(user.regular(), user.arrow());
```

- **Prediction:** `Asha undefined`
- **Real output:** `Asha undefined`
- **Why:** A regular method gets `this` from the call site (`user`), but an arrow function has no own `this` — it uses the outer scope's `this` (in a Node module that's `module.exports`, `{}`), which has no `name`.

---

### 8 · Loose vs strict equality — `08-equality.js`

```js
console.log(0 == '0', 0 === '0', null == undefined, [] == false);
```

- **Prediction:** `true false true true`
- **Real output:** `true false true true`
- **Why:** `==` coerces types (`'0'` → 0; `[]` → `''` → 0 and `false` → 0), `===` doesn't, and `null == undefined` is a special-cased `true`.

---

### 9 · Truthy and falsy — `09-truthiness.js`

```js
console.log([!!'', !!'0', !![], !!{}, !!NaN]);
```

- **Prediction:** `[ false, true, true, true, false ]`
- **Real output:** `[ false, true, true, true, false ]`
- **Why:** Only `''`, `0`, `NaN`, `null`, `undefined`, `false` (and `0n`) are falsy; `'0'` is a non-empty string and every object/array — even empty — is truthy.

---

### 10 · `filter` → `map` → `reduce` — `10-filter-map-reduce.js`

```js
console.log([1, 2, 3, 4].filter((n) => n % 2).map((n) => n * 10).reduce((a, b) => a + b, 0));
```

- **Prediction:** `40`
- **Real output:** `40`
- **Why:** `n % 2` keeps odd numbers `[1, 3]`, `map` gives `[10, 30]`, and `reduce` sums them to `40`.
