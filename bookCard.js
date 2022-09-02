class BookCard extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.getUfBooks = JSON.parse(localStorage.getItem("unfinishedBooks"));
    this.getFBooks = JSON.parse(localStorage.getItem("finishedBooks"));

    this.unfinishedBooks = this.getUfBooks.books;
    this.finishedBooks = this.getFBooks ? this.getFBooks.books : [];
    this.collections = [...this.unfinishedBooks, ...this.finishedBooks];

    this.markFinishedMessage = `
    <p class="message">Do you wish to mark <span id= "popBTtl">${this.title.replaceAll(
      "_",
      " "
    )}</span> as finished?</p>
    `;

    this.rereadBookMessage = `
    <p class="message">Do you wish to re-read <span id= "popBTtl">${this.title.replaceAll(
      "_",
      " "
    )} </span>?</p>
    `;

    this.deleteBookMessage = `
    <p class="message" >Do you wish to remove <span id= "popBTtl">${this.title.replaceAll(
      "_",
      " "
    )} </span> from your collection? </p>
    `;
  }

  get img() {
    return this.getAttribute("img");
  }

  set img(val) {
    this.setAttribute("img", val);
  }

  get title() {
    return this.getAttribute("title");
  }

  set title(val) {
    this.setAttribute("title", val);
  }

  get genre1() {
    return this.getAttribute("genre1");
  }

  set genre1(val) {
    this.setAttribute("genre1", val);
  }

  get genre2() {
    return this.getAttribute("genre2");
  }

  set genre2(val) {
    this.setAttribute("genre2", val);
  }

  get genre3() {
    return this.getAttribute("genre3");
  }

  set genre3(val) {
    this.setAttribute("genre3", val);
  }

  get genre4() {
    return this.getAttribute("genre4");
  }

  set genre4(val) {
    this.setAttribute("genre4", val);
  }

  get date() {
    return this.getAttribute("date");
  }

  set date(val) {
    this.setAttribute("date", val);
  }

  get author() {
    return this.getAttribute("author");
  }

  set author(val) {
    this.setAttribute("author", val);
  }

  get isFavorite() {
    return this.getAttribute("isFavorite");
  }

  set isFavorite(val) {
    this.setAttribute("isFavorite", val);
  }

  get isFinished() {
    return this.getAttribute("isFinished");
  }

  set isFinished(val) {
    this.setAttribute("isFinished", val);
  }

  get _id() {
    return this.getAttribute("_id");
  }

  set _id(val) {
    this.setAttribute("_id", val);
  }

  static get observedAttributes() {
    return [
      "img",
      "title",
      "genre1",
      "genre2",
      "genre3",
      "genre4",
      "date",
      "author",
      "isFinished",
      "isFavorite",
      "_id",
    ];
  }

  toggleFav(id) {
    let rawDate = Date.now();
    let dateForm = new Date(rawDate);
    let date = new Date(dateForm);
    let dateString = date.toLocaleDateString();
    let timeString = date.toLocaleTimeString();

    try {
      let book = this.collections.find((book) => book.id === id);
      if (book) {
        let updatedBook = {
          id: book.id,
          title: book.title,
          genre: book.genre,
          author: book.author,
          realease: book.realease,
          img: book.img,
          isFavorite: !book.isFavorite,
          isFinished: book.isFinished,
          notes: book.notes,
          dateRegistered: book.dateRegistered,
          dateUpdated: `${dateString},${timeString}`,
          lastModified: new Date().getTime(),
          tag: book.tag,
          lastRead: book.lastRead,
        };

        if (updatedBook && book.isFinished == true) {
          let excludeCltn = this.finishedBooks.filter((book) => book.id !== id);
          let updatedCltn = excludeCltn.concat(updatedBook);

          let updatedObj = {
            books: updatedCltn,
          };

          console.log(updatedBook);

          localStorage.setItem("finishedBooks", JSON.stringify(updatedObj));

          window.location.reload();
        } else if (updatedBook && book.isFinished == false) {
          let excludeCltn = this.unfinishedBooks.filter(
            (book) => book.id !== id
          );
          let updatedCltn = excludeCltn.concat(updatedBook);

          console.log(updatedBook);

          let updatedObj = {
            books: updatedCltn,
          };
          localStorage.setItem("unfinishedBooks", JSON.stringify(updatedObj));

          window.location.reload();
        } else {
          throw new Error("updatedBook is invalid");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  toggleFinishedStatus(id) {
    const collections = [...this.finishedBooks, ...this.unfinishedBooks];

    const rawDate = Date.now();
    const dateForm = new Date(rawDate);
    const date = new Date(dateForm);
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString();

    try {
      let book = collections.find((book) => book.id === id);
      console.log(book);
      if (book) {
        let updatedBook = {
          id: book.id,
          title: book.title,
          genre: book.genre,
          author: book.author,
          realease: book.realease,
          img: book.img,
          isFavorite: book.isFavorite,
          isFinished: !book.isFinished,
          notes: book.notes,
          dateRegistered: book.dateRegistered,
          dateUpdated: `${dateString}, ${timeString}`,
          lastModif: new Date().getTime(),
          tag: book.tag,
          lastRead: book.lastRead,
        };
        if (this.isFinished === "false") {
          let updatedUfCltn = this.unfinishedBooks.filter(
            (book) => book.id !== id
          );

          let updatedFCltn = this.finishedBooks.concat(updatedBook);

          let updatedUfObj = {
            books: updatedUfCltn,
          };

          let updatedFObj = {
            books: updatedFCltn,
          };

          console.log(updatedBook);

          localStorage.setItem("unfinishedBooks", JSON.stringify(updatedUfObj));
          localStorage.setItem("finishedBooks", JSON.stringify(updatedFObj));

          if (this.unfinishedBooks.length == 1) {
            sessionStorage.setItem("currentPage", 0);
            window.location.reload();
          } else {
            window.location.reload();
          }
        } else if (this.isFinished === "true") {
          let updatedFCltn = this.finishedBooks.filter(
            (book) => book.id !== id
          );

          let updatedUfCltn = this.unfinishedBooks.concat(updatedBook);

          let updatedUfObj = {
            books: updatedUfCltn,
          };

          let updatedFObj = {
            books: updatedFCltn,
          };

          console.log(updatedBook);

          localStorage.setItem("unfinishedBooks", JSON.stringify(updatedUfObj));
          localStorage.setItem("finishedBooks", JSON.stringify(updatedFObj));

          window.location.reload();
        }
      } else if (!book) {
        throw new Error("Book is invalid");
      } else {
        throw new Error("System Failure");
      }
    } catch (error) {
      console.log(error.stack);
    }
  }

  deleteBook(id) {
    const collections = [...this.unfinishedBooks, ...this.finishedBooks];

    const book = collections.find((book) => book.id == id);
    console.log(book);
    try {
      if (book.isFinished == true) {
        const updatedBooks = this.finishedBooks.filter((book) => book.id !== id);

        const updatedObj = {
          books: updatedBooks,
        };

        localStorage.setItem("finishedBooks", JSON.stringify(updatedObj));
        console.log(updatedBooks);
        console.log(id);
        console.log(book);
        console.log("remove book from finishedBooks");
        window.location.reload();
      } else if (book.isFinished == false) {
        const updatedBooks = this.unfinishedBooks.filter(
          (book) => book.id !== id
        );

        const updatedObj = {
          books: updatedBooks,
        };

        localStorage.setItem("unfinishedBooks", JSON.stringify(updatedObj));
        console.log(updatedBooks);
        console.log(id);
        console.log(book);
        console.log("remove book from unfinishedBooks");
        if (this.unfinishedBooks.length == 1) {
          sessionStorage.setItem("currentPage", 0);
          window.location.reload();
        } else {
          window.location.reload();
        }
      } else {
        throw new Error("book status are invalid");
      }
    } catch (error) {
      console.log(error.stack);
    }
  }

  closePopUp() {
    const popUp = document.getElementById("popUp");
    const backdrop = document.getElementById("backdrop");
    backdrop.style.display = "none";

    const hidePopUp = () => {
      popUp.style.display = "none";

      return new Promise((resolve, reject) => {
        if (popUp.style.display === "none") {
          resolve("click");
        } else {
          reject("popUp cant be hidden");
        }
      });
    };

    const removeListener = (cmd) => {
      if (cmd === "click") {
        const cancelPopBtn = document.getElementById("cancelPopBtn");
        const confirmPopBtn = document.getElementById("confirmPopBtn");

        cancelPopBtn.removeEventListener(cmd, () => this.closePopUp());
        confirmPopBtn.removeEventListener(cmd, () => this.markFinishedAlert());

        return "";
      } else {
        throw new Error("cant hide popUp");
      }
    };

    const clearPopUp = (clear) => {
      if (clear === "") {
        const popUp = document.getElementById("popUp");
        popUp.innerHTML = clear;
        console.log("popUp closed");
      } else {
        throw new Error("cant clear popUp");
      }
    };

    hidePopUp()
      .then(removeListener)
      .then(clearPopUp)
      .catch((error) => console.log(error.stack));
  }

  popUpAlert(cmd) {
    const popUp = document.getElementById("popUp");

    let message;

    if (cmd === "toggleFinished") {
      message =
        this.isFinished === "true"
          ? this.rereadBookMessage
          : this.markFinishedMessage;
    } else if (cmd === "delete") {
      message = this.deleteBookMessage;
    }

    let injectElement = () => {
      popUp.innerHTML = `
    <section class="popUp" >
    <div class="popUpWrp">
      <div class="popContainer">
        <div class="popContentWrp">
          ${message}
          <div class="popBtnGroup">
            <button id="cancelPopBtn" class="popBtn">Cancel</button>
            <button id="confirmPopBtn" class="popBtn">Confirm</button>
          </div>
        </div>
      </div>
      <div id="backdrop" class="backdrop" ></div>
    </div>
  </section>
    `;

      return new Promise((resolve, reject) => {
        if (cmd === "toggleFinished") {
          resolve("toggle");
        } else if (cmd === "delete") {
          resolve("delete");
        }
        reject("popUpWrp are unaccessible");
      });
    };

    const makePopBtnListen = (cmd) => {
      if (cmd === "toggle") {
        const cancelPopBtn = document.getElementById("cancelPopBtn");
        const confirmPopBtn = document.getElementById("confirmPopBtn");
        const backdrop = document.getElementById("backdrop");

        cancelPopBtn.addEventListener("click", () => this.closePopUp());
        confirmPopBtn.addEventListener("click", () =>
          this.toggleFinishedStatus(this._id)
        );
        backdrop.style.display = "block";
        backdrop.addEventListener("click", () => this.closePopUp());

        return "flex";
      } else if (cmd === "delete") {
        const cancelPopBtn = document.getElementById("cancelPopBtn");
        const confirmPopBtn = document.getElementById("confirmPopBtn");
        const backdrop = document.getElementById("backdrop");

        cancelPopBtn.addEventListener("click", () => this.closePopUp());
        confirmPopBtn.addEventListener("click", () =>
          this.deleteBook(this._id)
        );
        backdrop.addEventListener("click", () => this.closePopUp());

        return "flex";
      } else {
        throw new Error("popBtn are unaccessible");
      }
    };

    let showPopWrp = (display) => {
      if (display === "flex") {
        popUp.style.display = display;
        console.log("Alert is popping");
      } else {
        throw new Error("display is invalid");
      }
    };

    injectElement()
      .then(makePopBtnListen)
      .then(showPopWrp)
      .catch((error) => {
        console.log(error.stack);
      });
  }

  openNotes(id) {
    window.scrollTo(0, 0);
    sessionStorage.removeItem("currentSort");
    sessionStorage.removeItem("currentGenre");
    sessionStorage.setItem("requestBookNotesId", id);
    sessionStorage.setItem("currentPage", 4);

    window.location.reload();
  }

  editBook() {
    const thisBook = this.collections.find((book) => book.id == this._id);
    window.scrollTo(0, 0);
    sessionStorage.removeItem("currentSort");
    sessionStorage.removeItem("currentGenre");
    sessionStorage.setItem("editRequest", JSON.stringify(thisBook));
    sessionStorage.setItem("currentPage", 3);
    console.log("editBook executed");
    window.location.reload();
  }

  attributeChangedCallback(prop, oldVal, newVal) {
    if (
      prop === "img" ||
      prop === "title" ||
      prop === "genre1" ||
      prop === "genre2" ||
      prop === "genre3" ||
      prop === "genre4" ||
      prop === "date" ||
      prop === "author" ||
      prop === "finish" ||
      prop === "fav" ||
      prop === "_id"
    ) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();

    try {
      const markFinishedBtn = this.shadow.getElementById("markFinishedBtn");
      const bFav = this.shadow.getElementById("bFav");
      const continueBtn = this.shadow.getElementById("continueBtn");
      const deleteBtn = this.shadow.getElementById("deleteBtn");
      const editIcon = this.shadow.getElementById("editIcon");

      if (markFinishedBtn && bFav && continueBtn && deleteBtn && editIcon) {
        markFinishedBtn.addEventListener("click", () =>
          this.popUpAlert("toggleFinished")
        );
        bFav.addEventListener("click", () => this.toggleFav(this._id));

        continueBtn.addEventListener("click", () => this.openNotes(this._id));

        deleteBtn.addEventListener("click", () => this.popUpAlert("delete"));

        editIcon.addEventListener("click", () => this.editBook(this._id));

        console.log(
          "bFav, continueBtn, and markFinishedBtn start listening....."
        );
      } else if (!markFinishedBtn) {
        throw new Error("markFinishedBtn are unaccessible");
      } else if (!bFav) {
        throw new Error("bFav are unaccessible");
      } else if (!continueBtn) {
        throw new Error("continueBtn are unaccessible");
      } else if (!deleteBtn) {
        throw new Error("deleteBtn are unaccessible");
      } else if (!editIcon) {
        throw new Error("editIcon are unaccessible");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  render() {
    const title = this.title.replaceAll("_", " ");
    const author = this.author.replaceAll("_", " ");
    this.shadow.innerHTML = `
    <style>
    .category,
    .date,
    .title {
      color: #fff;
      background-color: transparent;
    }
  
    .bookCvr,
    .category,
    .date,
    .info,
    .title {
      background-color: transparent;
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
  
    .book {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 100px;
      left: 80px;
    }
  
    .bookCvr,
    .bookWrp {
      display: flex;
      align-items: center;
      position: relative;
    }
  
    .bookWrp {
      justify-content: center;
      flex-direction: column;
    }
  
    .bookCvr {
      justify-content: center;
      margin: 0;
    }
  
    #bFav,
    #bStatus,
    .cvr {
      display: block;
    }
  
    .cvr {
      width: 300px;
      box-shadow: 0 3px 7px 0.5px rgba(0, 0, 0, 0.3);
      margin: 17px 0;
      transition: 0.3s ease-out;
    }
  
    .btnGroup,
    .editBtn,
    .info {
      display: flex;
    }
  
    .cvr:hover {
      opacity: 0.3;
    }
  
    .info {
      position: relative;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin: 0;
      left: 0;
    }
  
    .title {
      font-family: "Times New Roman", Times, serif;
      font-size: 30px;
      margin: 17px 0;
      font-weight: 500;
    }
  
    .category,
    .date {
      font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
      font-size: 20px;
      opacity: 0.5;
      margin: 8px 0;
    }
  
    .btnGroup {
      position: relative;
      flex-direction: column;
      align-items: center;
      margin-top: 30px;
    }
  
    .bBtnB,
    .bBtnT,
    .vbBtnB {
      aspect-ratio: 315/64;
      width: 250px;
      font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
      font-size: 20px;
      box-shadow: 0 3px 7px 0.5px rgba(0, 0, 0, 0.3);
      transition: 0.3s ease-out;
      margin: 13px 0;
      border: none;
      outline: 0;
    }
  
    .bBtnB,
    .vbBtnB {
      background-color: #16213e;
      color: #e94560;
      cursor: pointer;
    }
  
    .bBtnB:hover,
    .vbBtnB:hover {
      color: #c73b52;
    }
  
    .bBtnT {
      color: #16213e;
      background-color: #e94560;
      cursor: pointer;
    }
  
    .bFav,
    .bStatus {
      width: 50px;
      position: absolute;
      cursor: pointer;
    }
  
    .bBtnT:hover {
      background-color: #c73b52;
    }
  
    .bStatus {
      top: 350px;
      left: 10px;
    }
  
    .bFav {
      top: 30px;
      left: 250px;
    }
  
    #editIcon:hover,
    .bFav:hover,
    .bStatus:hover {
      opacity: 0.4;
    }
  
    .editBtn {
      position: absolute;
      background-color: transparent;
      border: none;
      outline: 0;
      align-items: center;
      justify-content: center;
      top: 360px;
      left: 240px;
      z-index: 30;
    }
  
    #editIcon {
      width: 30px;
      opacity: 1;
      cursor: pointer;
    }
  
    @media screen and (max-width: 1280px) {
      .book {
        transform: scale(0.87);
        margin-bottom: 50px;
        left: 10px;
      }
    }
  
    @media screen and (max-width: 810px) {
      .book {
        transform: scale(0.67);
        margin-bottom: -200px;
        left: 0;
      }
    }
  
    @media screen and (max-width: 600px) {
      .book {
        left: 10px;
      }
    }
  </style>
  <div class="book" id="${this._id}">
    <div class="bookWrp">
      <button class="editBtn" id="editBtn">
        <img id="editIcon" src="public/svg/SVG/edit-pink.svg" alt="edit" title="Edit Book Info" />
      </button>
      <figure class="bookCvr">
        <img id="cvr" class="cvr" src="${this.img}" alt="image" />
        <img id="bStatus" src=${
          this.isFinished === "true"
            ? "public/pngs/finished-pink.png"
            : "public/pngs/continue-pink.png"
        } alt="unfinished" class="bStatus" title=${
      this.isFinished === "true" ? "Finished Book" : "On-read Book"
    }> <img id="bFav" src=${
      this.isFavorite === "true"
        ? "public/pngs/bookmark-gold.png"
        : "public/pngs/bookmarkOutline-gold.png"
    } alt="favorite" class="bFav"
          title="Toggle Favorite">
      </figure>
  
      <article class="info">
        <h3 id="title" class="title">${title}</h3>
        <p id="category" class="category">
          ${this.genre1}${
      this.genre2 === "undefined" || !this.genre2 ? "" : ", " + this.genre2
    }${this.genre3 === "undefined" || !this.genre3 ? "" : ", " + this.genre3}${
      this.genre4 === "undefined" || !this.genre4 ? "" : ", " + this.genre4
    }
        </p>
        <p id="date" class="date">${this.date}</p>
        <p id="author" class="date">${author}</p>
      </article>
      <div class="btnGroup">
        <button id="continueBtn" class="bBtnT" type="button">
          ${this.isFinished === "true" ? "Notes" : "Continue"}
        </button>
        <button id="markFinishedBtn" class="bBtnB" type="button">
          ${this.isFinished === "true" ? "Re-read Book" : "Mark as finished"}
        </button>
        <button id="deleteBtn" class="vbBtnB" type="button">Delete</button>
      </div>
    </div>
  </div>
        `;
  }
}

window.customElements.define("book-card", BookCard);
