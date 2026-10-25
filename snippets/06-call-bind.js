function intro(city) {
  return `${this.name} from ${city}`;
}
console.log(intro.call({ name: 'Ravi' }, 'Pune'), intro.bind({ name: 'Meena' })('Delhi'));
