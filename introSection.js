class IntroSection extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  jumpToRegister() {
    sessionStorage.removeItem("currentPage");
    sessionStorage.removeItem("currentSort");
    sessionStorage.setItem("currentPage", 3);
    window.location.reload();
  }

  connectedCallback() {
    this.render();
    const regBtn = this.shadow.getElementById("regBtn");

    regBtn.addEventListener("click", () => this.jumpToRegister());
  }

  render() {
    this.shadow.innerHTML = `
    <style>
    .ldg-pg,
    .ldgWrp {
      background-color: #16213e;
      overflow-y: hidden;
      display: flex;
    }
  
    .brandBig,
    .ldg-pg,
    .ldgDsc,
    .ldgWrp {
      display: flex;
    }
  
    .brandBig,
    .brandFB1,
    .brandFB2,
    .ldg-pg,
    .ldgWrp {
      top: 0;
      position: relative;
    }
  
    .brandBig,
    .subTtl,
    .ttlDsc {
      text-align: center;
    }
  
    @font-face {
      font-family: "Lucida Sans";
      src: url(public/font/LSANS.TTF);
    }
  
    @font-face {
      font-family: "I pixel u";
      src: url(public/font/I-PIXEL-U.TTF);
    }
  
    @font-face {
      font-family: "Segoe UI";
      src: url(public/font/SEGOEUI.TTF);
    }
  
    .ldg-pg {
      left: -100px;
      padding-bottom: 300px;
      align-items: center;
      justify-content: center;
    }
  
    .ldgWrp {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      left: -10px;
      height: 100vh;
      width: 100vw;
      overflow-x: hidden;
      padding-bottom: 100px;
    }
  
    .brandBig {
      flex-direction: row;
      font-size: 80px;
      margin: 0;
      width: 353px;
      height: 220px;
      transform: translate(50px, 0);
    }
  
    .brandFB1 {
      left: 0;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      color: #707070;
    }
  
    .brandFB2 {
      left: 0;
      font-family: "I pixel u", Tahoma, Geneva, Verdana, sans-serif;
      color: #e95460;
      transform: translate(12.5px, 5px);
    }
  
    .ldgDsc {
      position: relative;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      top: -80px;
    }
  
    .ldgBkdrop,
    .ldgFg {
      position: relative;
      align-items: center;
      display: flex;
    }
  
    .subTtl {
      position: relative;
      color: #e95460;
      font-family: I pixel u;
      font-size: 30px;
      top: 30px;
      letter-spacing: 0;
      margin-top: 10px;
    }
  
    .ttlDsc {
      position: relative;
      color: #a2a2a2;
      font-family: "Times New Roman", Times, serif;
      font-size: 25px;
      top: 20px;
      width: 700px;
      margin-top: 0;
    }
  
    .ldgFg {
      justify-content: center;
      margin-top: 42px;
      left: 0;
      top: -100px;
    }
  
    .ilus {
      width: 354px;
    }
  
    .brandBig,
    .ldgDsc,
    .ldgFg,
    .ldgReg {
      z-index: 5;
    }
  
    .ldgBkdrop {
      z-index: 1;
      opacity: 0.1;
      justify-content: center;
      top: -300px;
    }
  
    #regBtn,
    .bkdrop {
      position: absolute;
    }
  
    .bkdrop {
      width: 900px;
    }
  
    #regBtn {
      z-index: 999;
      aspect-ratio: 27/8;
      width: 270px;
      background-color: #e89c39;
      outline: 0;
      border: none;
      font-family: Lucida Sans;
      font-size: 30px;
      color: #141f3b;
      transition: 0.3s ease-out;
      cursor: pointer;
      top: -80px;
    }
  
    #regBtn:hover {
      background-color: #ffd092;
    }
  
    .btnWrp {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      top: 0;
    }
  
    @media screen and (max-width: 1366px) {
      .bkdrop {
        width: 750px;
      }
    }
  
    @media screen and (max-width: 1080px) {
      .bkdrop {
        width: 600px;
      }
  
      #regBtn {
        width: 200px;
        font-size: 20px;
      }
    }
  
    @media screen and (max-width: 810px) {
      .ilus {
        width: 250px;
      }
  
      .brandBig {
        font-size: 60px;
        left: 30px;
      }
  
      .ttlDsc {
        width: 60vw;
        font-size: 20px;
      }
  
      #regBtn {
        width: 150px;
        font-size: 18px;
      }
    }
  </style>
  <div class="ldgWrp">
    <div class="brandBig">
      <p class="brandFB1">Red</p>
      <p class="brandFB2">Bit</p>
    </div>
    <article class="ldgDsc">
      <h2 class="subTtl">MY NEW READING HABIT</h2>
      <p class="ttlDsc">
        Improve your reading quality by starts a new habit to taking notes the
        events, it's settings, the involved characters, the conflicts, the
        resolution, and more.
      </p>
    </article>
    <figure class="ldgFg">
      <img class="ilus" src="public/svg/SVG/pinkbook1.svg" alt="ilus-book" />
    </figure>
    <div class="btnWrp">
      <button id="regBtn">Register Book</button>
      <div>
        <figure class="ldgBkdrop">
          <img class="bkdrop" src="public/svg/SVG/pinkbook1.svg" alt="ilus-book" />
        </figure>
      </div>
    </div>
  </div>
        `;
  }
}

window.customElements.define("intro-section", IntroSection);
