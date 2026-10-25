function makeCounter() {
  let count = 0;
  return () => ++count;
}
const c = makeCounter();
c();
c();
console.log(c());
