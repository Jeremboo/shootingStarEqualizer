class Switcher {
  constructor(element) {
    this.element = element;
    this.switcher = this.element.getElementsByClassName('switcher')[0];
  }

  rotate(action) {
    this.switcher.classList.add(action);
  }
  rebase(action) {
    this.switcher.classList.remove(action);
  }
}

module.exports = Switcher;
