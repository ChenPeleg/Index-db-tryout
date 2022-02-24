class ToolTip extends HTMLElement {
  constructor() {
    super();
    this.textContent = "Hi there"

  }
}

customElements.define('tool-tip', ToolTip);
