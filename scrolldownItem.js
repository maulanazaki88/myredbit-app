class scrolldownItem extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.getUfBooks = JSON.parse(localStorage.getItem("unfinishedBooks"));
    this.getFBooks = JSON.parse(localStorage.getItem("finishedBooks"));

    this.unfinishedBooks = this.getUfBooks ? this.getUfBooks.books : [];
    this.finishedBooks = this.getFBooks ? this.getFBooks.books : [];
    this.collections = [...this.unfinishedBooks, ...this.finishedBooks];
  }

  get list() {
    return this.getAttribute("list");
  }

  set list(val) {
    this.setAttribute("list", val);
  }

  get _id() {
    return this.getAttribute("_id");
  }

  set _id(val) {
    this.setAttribute("_id", val);
  }

  static get observedAttributes() {
    return ["list", "_id"];
  }

  attributeChangedCallback(prop, newVal, oldVal) {
    if (prop === "list" || prop === "_id") {
      this.render();
    }
  }

  updateCurrentGen(genre) {
    sessionStorage.setItem("currentGenre", genre);
    window.location.reload();
  }

  connectedCallback() {
    this.render();

    let scrolldownItem = this.shadow.getElementById("scrolldownItem");
    scrolldownItem.addEventListener("click", () =>
      this.updateCurrentGen(this._id)
    );
  }

  render() {
    this.shadow.innerHTML = `
    <style>
    @font-face {
      font-family: "Lucida Sans";
      src: url(public/font/LSANS.TTF)
    }
  
    @font-face {
      font-family: "I pixel u";
      src: url(public/font/I-PIXEL-U.TTF);
    }
  
    @font-face {
      font-family: "Segoe UI";
      src: url(public/font/SEGOEUI.TTF);
    }
  
    .scrolldownItem {
      font-family: "Lucida Sans";
      color: #fff;
      font-size: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      border-bottom: 2px solid #fff;
      height: 100px;
      transition: all 0.1s ease-in;
      width: 180px;
      cursor: pointer;
    }
  
    .scrolldownItem:hover {
  
      color: gold;
      width: 200px;
  
    }
  </style>
  <div id="scrolldownItem" class="scrolldownItem">
    ${this.list}
  </div>
        `;
  }
}

window.customElements.define("scrolldown-item", scrolldownItem);
