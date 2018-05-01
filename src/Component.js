class Component extends Lifecycle {
  constructor(declareTemplateName, props) {
    super();
    this.declareTemplateName = declareTemplateName;
    this.props = props;
    this.declareTemplate = '';
    this.state = {};
  }

  $beforeInit() {
    this.watcher = new Watcher(this.state, this.$watchState.bind(this), this.$renderDOM.bind(this));
  }

  $renderDOM() {
    const dom = document.getElementById(`component_${this.declareTemplateName}`);
    if (dom.hasChildNodes()) {
      let childs = dom.childNodes;
      for (let i = childs.length - 1; i >= 0; i--) {
        dom.removeChild(childs.item(i));
      }
      if (this.$onDestory) this.$onDestory();
    }
    dom.innerHTML = this.declareTemplate;
  }
}
