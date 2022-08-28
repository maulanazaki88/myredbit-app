class BookShelf extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.getUfBooks = JSON.parse(localStorage.getItem("unfinishedBooks"));
    this.unfinishedBooks = this.getUfBooks ? this.getUfBooks.books : [];
  }

  get book1() {
    return this.getAttribute("book1");
  }

  set book1(val) {
    this.setAttribute("book1", val);
  }

  get book2() {
    return this.getAttribute("book2");
  }

  set book2(val) {
    this.setAttribute("book2", val);
  }

  get book3() {
    return this.getAttribute("book3");
  }

  set book3(val) {
    this.setAttribute("book3", val);
  }

  get book4() {
    return this.getAttribute("book4");
  }

  set book4(val) {
    this.setAttribute("book4", val);
  }

  get status() {
    return this.getAttribute("status");
  }

  set status(val) {
    this.setAttribute("status", val);
  }

  get title() {
    return this.getAttribute("title");
  }

  set title(val) {
    this.setAttribute("title", val);
  }
  get button1() {
    return this.getAttribute("button1");
  }

  set button1(val) {
    this.setAttribute("button1", val);
  }

  get button2() {
    return this.getAttribute("button2");
  }

  set button2(val) {
    this.setAttribute("button2", val);
  }

  get cltn() {
    return this.getAttribute("cltn");
  }

  set cltn(val) {
    this.setAttribute("cltn", val);
  }

  attributesChangedCallback(prop, oldVal, newVal) {
    if (
      prop === "book1" ||
      prop === "book2" ||
      prop === "book3" ||
      prop === "book4" ||
      prop === "status" ||
      prop === "title" ||
      prop === "button1" ||
      prop === "button2" ||
      prop === "cltn"
    ) {
      this.render();
    }
  }

  static get observedAttributes() {
    return [
      "book1",
      "book2",
      "book3",
      "book4",
      "status",
      "title",
      "button1",
      "button2",
      "cltn",
    ];
  }

  jumpToCltn(cltn) {
    window.scrollTo(0, 0);
    try {
      if (cltn == "1" && !this.unfinishedBooks[0]) {
        sessionStorage.setItem("currentPage", 3);
        window.location.reload();
      } else {
        sessionStorage.setItem("currentPage", cltn);
        window.location.reload();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  jumpToRegister() {
    sessionStorage.setItem("currentPage", 3);

    window.location.reload();
  }

  connectedCallback() {
    this.render();
    let openBtn = this.shadow.getElementById("openBtn");
    openBtn.addEventListener("click", () => this.jumpToCltn(this.cltn));
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
  
    h2 {
      cursor: default;
    }
  
    .shelf {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      z-index: 1;
    }
  
    .up,
    .down {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;
    }
  
    .book {
      margin: 20px 20px;
    }
  
    .bookCvr {
      width: 240px;
      opacity: 0.6;
    }
  
    .title {
      position: relative;
      color: #fff;
      font-family: "Times New Roman", Times, serif;
      font-size: 60px;
      width: 412px;
      text-align: left;
      z-index: 2;
      top: 0px;
      left: -100px;
      font-weight: 500;
      transform: translate(150px, 500px);
    }
  
    .iconFg {
      position: relative;
      top: 0px;
      transform: translate(280px, 390px);
      z-index: 2;
    }
  
    .icon {
      position: relative;
      transform: translate(0, -5px);
      width: 50px;
    }
  
    .openBtn {
      position: absolute;
      border: none;
      outline: none;
      width: 295px;
      height: 65px;
      background-color: #16213e;
      color: #e95460;
      font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
      font-size: 26px;
      box-shadow: 0px 3px 7px 0.5px rgba(0, 0, 0, 0.3);
      transition: all 0.15s ease-out;
      transform: translate(5px, 0);
      cursor: pointer;
      top: 650px;
      left: 125px;
      z-index: 20;
  
    }
  
    #openBtn {
      transform: translate(0px, 0);
    }
  
    #openBtn:hover {
      transform: scale(1.1);
    }
  </style>
  <h2 id="title" class="title">${this.title}</h2>
  <button id="openBtn" class="openBtn">${this.button1} ${this.button2}</button>
  <figure class="iconFg">
    <img class="icon" src=${this.status} />
  </figure>
  <div class="shelf">
    <div class="up">
      <div id="b1" class="book">
        <img class="bookCvr" src=${this.book1} alt="book1" />
      </div>
      <div id="b2" class="book">
        <img class="bookCvr" src=${this.book2} alt="book2" />
      </div>
    </div>
    <div id="b3" class="down">
      <div class="book">
        <img class="bookCvr" src=${this.book3} alt="book3" />
      </div>
      <div id="b4" class="book">
        <img class="bookCvr" src=${this.book4} alt="book4" />
      </div>
    </div>
  </div>
    
        `;
    window.scrollTo(0, 0);
  }
}

window.customElements.define("book-shelf", BookShelf);
