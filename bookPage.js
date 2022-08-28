class BookPage extends HTMLElement {
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

  .bookWrp {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 200px;
    background-color: transparent;
    width: 80vw;
    height: 100vh;
    padding-bottom: 500px;
    top: 0px;
  }

  .ufbook {
    position: relative;
    color: #fff;
    font-size: 50px;
    margin-right: 100px;
    top: 0px;
    left: 0px;

  }

  .fbook {
    position: relative;
    color: #fff;
    font-size: 50px;
    margin-left: 100px;
    top: 0px;
    left: 0px;


  }

  .bookShelf {
    background-color: transparent;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }




  @media screen and (max-width: 810px) {


    .bookWrp {
      flex-direction: column;
      height: -moz-max-content;
      height: fit-content;
      padding-bottom: 0px;
      margin-top: 0px;
      top: 0px;
    }

    .ufbook {
      position: relative;
      color: #fff;
      font-size: 50px;
      margin-right: 0px;
      top: 0;
      left: 0;
      transform: translate(0px, 0px);

    }

    .fbook {
      position: relative;
      color: #fff;
      font-size: 50px;
      margin-left: 0px;
      top: 0;
      left: 0;
      transform: translate(0px, 0px);
    }
  }
</style>

<div class="bookWrp">
  <div class="bookShelf">
    <slot name="bookShelfs" />
  </div>
</div>
      `;
  }
}

window.customElements.define("book-page", BookPage);
