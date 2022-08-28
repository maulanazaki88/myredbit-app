class BookCollection extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
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
      
        .cltnWrp {
          list-style: none;
          color: transparent;
          font-size: 0 ;
          grid-template-columns: repeat(6, auto);
          position: relative;
          background-color: transparent;
          top: 200px;
          left: 0px;
          width: 100vw;
      
        }
      
        @media screen and (max-width:1280px) {
          .cltnWrp {
            grid-template-columns: repeat(4, auto);
          }
        }
      </style>
      <ul class="cltnWrp">
        <slot name="collection" />
      </ul>
        `;
  }
}

window.customElements.define("book-collection", BookCollection);
