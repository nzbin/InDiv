const Utils = require('./Utils');

class Easiest {
  constructor() {
    this.modalList = [];
    this.utils = new Utils();
  }
  use(modal) {
    modal.$use();
    this.modalList.push(modal);
    return this.modalList.findIndex(md => this.utils.isEqual(md, modal));
  }
}

module.exports = Easiest;
