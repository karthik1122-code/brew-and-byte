const user = {
  name: 'Asha',
  regular() {
    return this.name;
  },
  arrow: () => this.name,
};
console.log(user.regular(), user.arrow());
