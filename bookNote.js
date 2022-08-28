class BookNotes extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.getUfBooks = JSON.parse(localStorage.getItem("unfinishedBooks"));
    this.getFBooks = JSON.parse(localStorage.getItem("finishedBooks"));
    this.unfinishedBooks = this.getUfBooks.books;
    this.finishedBooks = this.getFBooks ? this.getFBooks.books : [];

    this.reqId = sessionStorage.getItem("requestBookNotesId");

    this.collection = [...this.unfinishedBooks, ...this.finishedBooks];

    this.theBook = this.collection.find((book) => book.id === this.reqId);

    this.nextPageVal = parseInt(this.theBook.lastRead) + 1;

    this.prevPageVal = parseInt(this.theBook.lastRead) - 1;
    this.theNotes = this.theBook.notes.find(
      (note) => note.page === parseInt(this.theBook.lastRead)
    )
      ? this.theBook.notes.find(
          (note) => note.page === parseInt(this.theBook.lastRead)
        )
      : {
          page: parseInt(this.theBook.lastRead) + 1,
          event: "",
          conflict: "",
          resolution: "",
          impact: "",
          glossary: "",
          character: "",
          timeline: "",
        };
  }

  get pgNum() {
    return this.getAttribute("pgNum");
  }

  set pgNum(val) {
    this.setAttribute("pgNum", val);
  }

  static get observedAttributes() {
    return ["pgNum"];
  }

  saveNotes() {
    const eventBoard = this.shadow.getElementById("eventBoard");
    const conflictBoard = this.shadow.getElementById("conflictBoard");
    const resolutionBoard = this.shadow.getElementById("resolutionBoard");
    const impactBoard = this.shadow.getElementById("impactBoard");
    const glossaryBoard = this.shadow.getElementById("glossaryBoard");
    const charactersNote = this.shadow.getElementById("charactersNote");
    const timelineNote = this.shadow.getElementById("timelineNote");

    let updateInitiate = () => {
      return new Promise((resolve, reject) => {
        if (
          this.theBook.notes.some(
            (book) => book.page === parseInt(this.theBook.lastRead)
          )
        ) {
          resolve("overwrite");
        } else if (
          !this.theBook.notes.some(
            (book) => book.page === parseInt(this.theBook.lastRead)
          )
        ) {
          resolve("create");
        } else {
          reject("CANNOT DEFINE NOTES' EXISTENCE");
        }
      });
    };

    let updateNotes = (cmd) => {
      let rawDate = Date.now();
      let formDate = new Date(rawDate);
      let date = new Date(formDate);
      let dateString = date.toLocaleDateString();
      let timeString = date.toLocaleTimeString();

      let updatedNote = {
        page: parseInt(this.theBook.lastRead),
        event: eventBoard.value,
        conflict: conflictBoard.value,
        resolution: resolutionBoard.value,
        impact: impactBoard.value,
        glossary: glossaryBoard.value,
        character: charactersNote.value,
        timeline: timelineNote.value,
      };
      if (cmd === "overwrite") {
        let excludedNotes = this.theBook.notes.filter(
          (note) => note.page !== parseInt(this.theBook.lastRead)
        );

        let newNotes = excludedNotes.concat(updatedNote);

        let updatedBook = {
          id: this.theBook.id,
          title: this.theBook.title,
          genre: this.theBook.genre,
          author: this.theBook.author,
          realease: this.theBook.realease,
          img: this.theBook.img,
          isFavorite: this.theBook.isFavorite,
          isFinished: this.theBook.isFinished,
          notes: newNotes,
          dateRegistered: this.theBook.dateRegistered,
          dateUpdated: `${dateString},${timeString}`,
          lastModified: new Date().getTime(),
          tag: this.theBook.tag,
          lastRead: parseInt(this.theBook.lastRead),
        };
        return updatedBook;
      } else if (cmd === "create") {
        let updatedBook = {
          id: this.theBook.id,
          title: this.theBook.title,
          genre: this.theBook.genre,
          author: this.theBook.author,
          realease: this.theBook.realease,
          img: this.theBook.img,
          isFavorite: this.theBook.isFavorite,
          isFinished: this.theBook.isFinished,
          notes: this.theBook.notes.concat(updatedNote),
          dateRegistered: this.theBook.dateRegistered,
          dateUpdated: `${dateString},${timeString}`,
          lastModified: new Date().getTime(),
          tag: this.theBook.tag,
          lastRead: parseInt(this.theBook.lastRead),
        };

        return updatedBook;
      } else {
        throw new Error("UPDATE NOTES FAILED");
      }
    };

    let updateStore = (updatedBook) => {
      if (updatedBook.isFinished) {
        let excludedBooks = this.finishedBooks.filter(
          (book) => book.id !== this.reqId
        );
        let updatedCltn = excludedBooks.concat(updatedBook);

        let updatedObj = {
          books: updatedCltn,
        };

        console.log("update finishedBook note");
        localStorage.setItem("finishedBooks", JSON.stringify(updatedObj));
      } else if (updatedBook.isFinished == false) {
        let excludedBooks = this.unfinishedBooks.filter(
          (book) => book.id !== this.reqId
        );
        let updatedCltn = excludedBooks.concat(updatedBook);

        let updatedObj = {
          books: updatedCltn,
        };

        console.log("update unfinishedBook note");
        localStorage.setItem("unfinishedBooks", JSON.stringify(updatedObj));
      } else {
        throw new Error("UPDATE BOOK FAILED");
      }
    };

    updateInitiate()
      .then(updateNotes)
      .then(updateStore)
      .catch((error) => {
        console.log(error.stack);
      });
  }

  navigatePg(cmd) {
    const eventBoard = this.shadow.getElementById("eventBoard");
    const conflictBoard = this.shadow.getElementById("conflictBoard");
    const resolutionBoard = this.shadow.getElementById("resolutionBoard");
    const impactBoard = this.shadow.getElementById("impactBoard");
    const glossaryBoard = this.shadow.getElementById("glossaryBoard");
    const charactersNote = this.shadow.getElementById("charactersNote");
    const timelineNote = this.shadow.getElementById("timelineNote");

    let updateInitiate = () => {
      return new Promise((resolve, reject) => {
        if (
          this.theBook.notes.some(
            (book) => book.page === parseInt(this.theBook.lastRead)
          )
        ) {
          resolve(`overwrite-${cmd}`);
        } else if (
          !this.theBook.notes.some(
            (book) => book.page === parseInt(this.theBook.lastRead)
          )
        ) {
          resolve(`create-${cmd}`);
        } else {
          reject("CANNOT DEFINE NOTES' EXISTENCE");
        }
      });
    };

    let updateNotes = (cmd) => {
      let rawDate = Date.now();
      let formDate = new Date(rawDate);
      let date = new Date(formDate);
      let dateString = date.toLocaleDateString();
      let timeString = date.toLocaleTimeString();

      let updatedNote = {
        page: parseInt(this.theBook.lastRead),
        event: eventBoard.value,
        conflict: conflictBoard.value,
        resolution: resolutionBoard.value,
        impact: impactBoard.value,
        glossary: glossaryBoard.value,
        character: charactersNote.value,
        timeline: timelineNote.value,
      };

      let regEx = /([a-z]+)/g;

      let parseCmd = cmd.match(regEx);

      let method = parseCmd[0];

      if (method === "overwrite") {
        let excludedNotes = this.theBook.notes.filter(
          (note) => note.page !== parseInt(this.theBook.lastRead)
        );

        let newNotes = excludedNotes.concat(updatedNote);

        let updatedBook = {
          id: this.theBook.id,
          title: this.theBook.title,
          genre: this.theBook.genre,
          author: this.theBook.author,
          realease: this.theBook.realease,
          img: this.theBook.img,
          isFavorite: this.theBook.isFavorite,
          isFinished: this.theBook.isFinished,
          notes: newNotes,
          dateRegistered: this.theBook.dateRegistered,
          dateUpdated: `${dateString},${timeString}`,
          lastModified: new Date().getTime(),
          tag: this.theBook.tag,
          lastRead: parseInt(this.theBook.lastRead),
        };

        let actions = {
          book: updatedBook,
          cmd: cmd,
        };

        return actions;
      } else if (method === "create") {
        let updatedBook = {
          id: this.theBook.id,
          title: this.theBook.title,
          genre: this.theBook.genre,
          author: this.theBook.author,
          realease: this.theBook.realease,
          img: this.theBook.img,
          isFavorite: this.theBook.isFavorite,
          isFinished: this.theBook.isFinished,
          notes: this.theBook.notes.concat(updatedNote),
          dateRegistered: this.theBook.dateRegistered,
          dateUpdated: `${dateString},${timeString}`,
          lastModified: new Date().getTime(),
          tag: this.theBook.tag,
          lastRead: parseInt(this.theBook.lastRead),
        };

        let actions = {
          book: updatedBook,
          cmd: cmd,
        };

        return actions;
      } else {
        throw new Error("UPDATE NOTES FAILED");
      }
    };

    let updateStore = (actions) => {
      if (actions.book.isFinished) {
        let excludedBooks = this.finishedBooks.filter(
          (book) => book.id !== this.reqId
        );
        let updatedCltn = excludedBooks.concat(actions.book);

        let updatedObj = {
          books: updatedCltn,
        };

        console.log("update finishedBook note");
        localStorage.setItem("finishedBooks", JSON.stringify(updatedObj));
        return actions;
      } else if (actions.book.isFinished == false) {
        let excludedBooks = this.unfinishedBooks.filter(
          (book) => book.id !== this.reqId
        );
        let updatedCltn = excludedBooks.concat(actions.book);

        let updatedObj = {
          books: updatedCltn,
        };

        console.log("update unfinishedBook note");
        localStorage.setItem("unfinishedBooks", JSON.stringify(updatedObj));
        return actions;
      } else {
        throw new Error("UPDATE BOOK FAILED");
      }
    };

    let updatePage = (actions) => {
      let rawDate = Date.now();
      let formDate = new Date(rawDate);
      let date = new Date(formDate);
      let dateString = date.toLocaleDateString();
      let timeString = date.toLocaleTimeString();

      let cmd = actions.cmd;

      let regEx = /([a-z]+)/g;

      let parseCmd = cmd.match(regEx);

      let navigate = parseCmd[1];

      let updatedBook = {
        id: actions.book.id,
        title: actions.book.title,
        genre: actions.book.genre,
        author: actions.book.author,
        realease: actions.book.realease,
        img: actions.book.img,
        isFavorite: actions.book.isFavorite,
        isFinished: actions.book.isFinished,
        notes: actions.book.notes,
        dateRegistered: actions.book.dateRegistered,
        dateUpdated: `${dateString},${timeString}`,
        lastModified: new Date().getTime(),
        tag: actions.book.tag,
        lastRead: navigate === "next" ? this.nextPageVal : this.prevPageVal,
      };

      try {
        if (updatedBook.isFinished) {
          let excludedBooks = this.finishedBooks.filter(
            (book) => book.id !== updatedBook.id
          );

          let newBooks = excludedBooks.concat(updatedBook);

          let updatedObj = {
            books: newBooks,
          };

          localStorage.setItem("finishedBooks", JSON.stringify(updatedObj));
          console.log("increment page success");
          console.log(updatedBook);

          window.location.reload();
        } else if (updatedBook.isFinished == false) {
          let excludedBooks = this.unfinishedBooks.filter(
            (book) => book.id !== this.reqId
          );

          let newBooks = excludedBooks.concat(updatedBook);

          let updatedObj = {
            books: newBooks,
          };

          localStorage.setItem("unfinishedBooks", JSON.stringify(updatedObj));
          console.log("increment page success");
          console.log(updatedBook);

          window.location.reload();
        } else {
          throw new Error("LAST READ UPDATE FAILED");
        }
      } catch (error) {
        console.log(error.stack);
      }
    };

    updateInitiate()
      .then(updateNotes)
      .then(updateStore)
      .then(updatePage)
      .catch((error) => {
        console.log(error.stack);
      });
  }

  backToCollection() {
    sessionStorage.removeItem("requestBookNotesId");
    if (this.theBook.isFinished) {
      sessionStorage.setItem("currentPage", 2);
      this.saveNotes();

      window.location.reload();
    } else if (this.theBook.isFinished == false) {
      sessionStorage.setItem("currentPage", 1);
      this.saveNotes();

      window.location.reload();
    }
  }

  ctrlBoard(pos) {
    let boardWrp = this.shadow.getElementById("boardWrp");

    let eventLabel = this.shadow.getElementById("eventLabel");
    let conflictLabel = this.shadow.getElementById("conflictLabel");
    let resolutionLabel = this.shadow.getElementById("resolutionLabel");
    let impactLabel = this.shadow.getElementById("impactLabel");
    let glossaryLabel = this.shadow.getElementById("glossaryLabel");

    console.log("boardWrp class updated");
    boardWrp.classList.remove([...boardWrp.classList]);
    boardWrp.classList.add(pos);

    if (pos === "boardWrp") {
      eventLabel.classList.add("selected");
      conflictLabel.classList.remove("selected");
      resolutionLabel.classList.remove("selected");
      impactLabel.classList.remove("selected");
      glossaryLabel.classList.remove("selected");
    } else if (pos === "boardWrp2") {
      eventLabel.classList.remove("selected");
      conflictLabel.classList.add("selected");
      resolutionLabel.classList.remove("selected");
      impactLabel.classList.remove("selected");
      glossaryLabel.classList.remove("selected");
    } else if (pos === "boardWrp3") {
      eventLabel.classList.remove("selected");
      conflictLabel.classList.remove("selected");
      resolutionLabel.classList.add("selected");
      impactLabel.classList.remove("selected");
      glossaryLabel.classList.remove("selected");
    } else if (pos === "boardWrp4") {
      eventLabel.classList.remove("selected");
      conflictLabel.classList.remove("selected");
      resolutionLabel.classList.remove("selected");
      impactLabel.classList.add("selected");
      glossaryLabel.classList.remove("selected");
    } else if (pos === "boardWrp5") {
      eventLabel.classList.remove("selected");
      conflictLabel.classList.remove("selected");
      resolutionLabel.classList.remove("selected");
      impactLabel.classList.remove("selected");
      glossaryLabel.classList.add("selected");
    }
  }

  postRender() {
    const noteBackBtn = this.shadow.getElementById("noteBackBtn");
    const nextPg = this.shadow.getElementById("nextPg");
    const backPg = this.shadow.getElementById("backPg");

    const eventLabel = this.shadow.getElementById("eventLabel");
    const conflictLabel = this.shadow.getElementById("conflictLabel");
    const resolutionLabel = this.shadow.getElementById("resolutionLabel");
    const impactLabel = this.shadow.getElementById("impactLabel");
    const glossaryLabel = this.shadow.getElementById("glossaryLabel");

    const eventBoard = this.shadow.getElementById("eventBoard");
    const conflictBoard = this.shadow.getElementById("conflictBoard");
    const resolutionBoard = this.shadow.getElementById("resolutionBoard");
    const impactBoard = this.shadow.getElementById("impactBoard");
    const glossaryBoard = this.shadow.getElementById("glossaryBoard");
    const charactersNote = this.shadow.getElementById("charactersNote");
    const timelineNote = this.shadow.getElementById("timelineNote");

    eventLabel.classList.add("selected");

    eventLabel.addEventListener("click", () => this.ctrlBoard("boardWrp"));
    conflictLabel.addEventListener("click", () => this.ctrlBoard("boardWrp2"));
    resolutionLabel.addEventListener("click", () =>
      this.ctrlBoard("boardWrp3")
    );
    impactLabel.addEventListener("click", () => this.ctrlBoard("boardWrp4"));
    glossaryLabel.addEventListener("click", () => this.ctrlBoard("boardWrp5"));

    nextPg.addEventListener("click", () => this.navigatePg("next"));
    backPg.addEventListener("click", () => this.navigatePg("back"));

    noteBackBtn.addEventListener("click", () => this.backToCollection());

    eventBoard.value = this.theNotes.event;
    conflictBoard.value = this.theNotes.conflict;
    resolutionBoard.value = this.theNotes.resolution;
    impactBoard.value = this.theNotes.impact;
    glossaryBoard.value = this.theNotes.glossary;
    charactersNote.value = this.theNotes.character;
    timelineNote.value = this.theNotes.timeline;

    if (parseInt(this.theBook.lastRead) > 1) {
      backPg.removeAttribute("disabled");
      console.log("backPg now clickable");
    }
  }

  attributeChangedCallback(prop, newVal, oldVal) {
    if (prop === "pgNum") {
      this.render();
      this.postRender();
    }
  }

  connectedCallback() {
    this.render();
    this.postRender();

    let report = `requestID: ${this.reqId} pgNum: ${parseInt(
      this.theBook.lastRead
    )} `;

    console.log(report);
  }

  render() {
    this.shadow.innerHTML = `
    <style>
    .form,
    .mainForm,
    .subForm {
      margin: 50px 0;
      display: flex;
    }
  
    #conflictLabel,
    #eventLabel,
    #glossaryLabel,
    #impactLabel,
    #resolutionLabel,
    .label,
    .selected {
      transition: 0.3s ease-in-out;
    }
  
    .detailNote,
    .noteBoard {
      font-family: "Times New Roman", Times, serif;
      border: 5px dashed #707070;
      outline: 0;
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
  
    .formWrp,
    .note-pg,
    .noteForm,
    .pgCtrl,
    .pgCtrlWrp {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    #noteBackBtn {
      background-color: transparent;
      border: none;
      outline: 0;
      font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
      font-size: 40px;
      color: #242424;
      position: absolute;
      top: 20px;
      left: 50px;
      cursor: pointer;
      opacity: 0.7;
    }
  
    #noteBackBtn:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  
    .note-pg {
      width: 100vw;
      height: -moz-max-content;
      height: fit-content;
      background-color: red;
      top: -10px;
      left: -8px;
    }
  
    .noteForm,
    .noteWrp {
      background-color: #c7c7c7;
    }
  
    .formGroup {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      top: 0;
    }
  
    .boardScroller,
    .bookTtl,
    .form,
    .mainForm,
    .noteWrp,
    .subForm {
      position: relative;
    }
  
    .form {
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }
  
    .mainForm {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      left: -150px;
    }
  
    .subForm {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  
    .labels {
      display: flex;
      flex-direction: column;
      list-style: none;
      margin-right: 50px;
    }
  
    .boardScroller,
    .noteForm {
      display: flex;
      align-items: center;
    }
  
    #conflictLabel:hover,
    #eventLabel:hover,
    #glossaryLabel:hover,
    #impactLabel:hover,
    #resolutionLabel:hover {
      transform: translate(10px, 0);
      cursor: pointer;
      transition: 0.3s ease-in-out;
      opacity: 0.7;
    }
  
    .label {
      font-size: 30px;
      margin: 40px 0;
      opacity: 0.3;
      cursor: pointer;
    }
  
    .selected {
      transform: translate(10px, 0);
      opacity: 1;
    }
  
    .bookTtl {
      font-family: "Times New Roman", Times, serif;
      font-size: 70px;
      margin-left: 20px;
      left: 0;
      text-align: center;
      top: 100px;
    }
  
    .noteWrp {
      width: 100vw;
      height: 100vh;
      top: -50px;
      left: -20px;
      margin: 0;
    }
  
    .noteForm {
      justify-content: center;
    }
  
    .boardScroller {
      width: 950px;
      height: 480px;
      justify-content: center;
      overflow-y: hidden;
      overflow-x: hidden;
    }
  
    .boardWrp,
    .boardWrp2 {
      display: flex;
      align-items: center;
      position: relative;
    }
  
    .boardWrp {
      justify-content: center;
      flex-direction: column;
      top: 970px;
      transition: 0.3s ease-out;
    }
  
    .boardWrp2 {
      top: 470px;
      justify-content: center;
      flex-direction: column;
      transition: 0.3s ease-out;
    }
  
    .boardWrp3,
    .boardWrp4 {
      display: flex;
      align-items: center;
      transition: 0.3s ease-out;
    }
  
    .boardWrp3 {
      top: 0;
      justify-content: center;
      flex-direction: column;
      position: relative;
    }
  
    .boardWrp4 {
      top: -470px;
      justify-content: center;
      flex-direction: column;
      position: relative;
    }
  
    .boardWrp5,
    .form-detail {
      display: flex;
      align-items: center;
      position: relative;
    }
  
    .boardWrp5 {
      top: -970px;
      justify-content: center;
      flex-direction: column;
      transition: 0.3s ease-out;
    }
  
    .noteBoard {
      font-size: 25px;
      background-color: #fefebc;
      padding: 2em;
      min-width: 800px;
      max-width: 800px;
      min-height: 350px;
      margin: 10px 0;
    }
  
    #conflictBoard {
      background-color: #ea8f8f;
    }
  
    #resolutionBoard {
      background-color: #c4ff8a;
    }
  
    #impactBoard {
      background-color: #7fffd4;
    }
  
    #glossaryBoard {
      background-color: #fff;
    }
  
    .form-detail {
      justify-content: space-between;
      flex-direction: row;
      left: 0;
      margin: 0 50px 0 10px;
    }
  
    .pgCtrl,
    .pgCtrlWrp {
      align-items: center;
      display: flex;
    }
  
    .form-detail>label {
      margin: 0 70px 0 0;
      font-size: 30px;
    }
  
    .detailNote {
      font-size: 25px;
      padding: 1em;
      max-width: 400px;
      min-width: 400px;
    }
  
    .pgCtrlBtn,
    .pgCtrlWrp {
      color: #fff;
      font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
    }
  
    .pgCtrl {
      position: absolute;
      background-color: #1d2a4d;
      width: 280px;
      height: 450px;
      justify-content: center;
      margin-left: 0;
      top: 180px;
      right: -20px;
      margin-right: 0;
    }
  
    .pgCtrlWrp {
      justify-content: center;
      flex-direction: column;
    }
  
    .pgCtrlTtl {
      position: relative;
      top: -30px;
      font-size: 25px;
    }
  
    .pgCtrlBtn-g {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 180px;
      position: relative;
      top: 0;
    }
  
    .pgNumber {
      font-size: 50px;
    }
  
    .pgCtrlBtn {
      border: none;
      outline: 0;
      font-size: 70px;
      background-color: transparent;
    }
  
    .pgCtrlBtn:hover {
      opacity: 0.7;
    }
  
    @media screen and (max-width: 1600px) {
      .formGroup {
        transform: scale(0.87);
      }
    }
  
    @media screen and (max-width: 1366px) {
      .formGroup {
        transform: scale(0.72) translate(0, -150px);
      }
  
      #noteBackBtn {
        font-size: 30px;
      }
  
      .bookTtl {
        font-size: 40px;
        transform: translate(0, 30px);
      }
    }
  
    @media screen and (max-width: 1100px) {
      .formGroup {
        transform: scale(0.52) translate(0, -300px);
      }
    }
  
    @media screen and (max-width: 810px) {
      .formGroup {
        transform: scale(0.76) translate(0, -200px);
      }
  
      .form {
        flex-direction: column;
      }
  
      .labels {
        flex-direction: row;
        margin-bottom: 80px;
      }
  
      .label {
        margin: 0 15px;
      }
  
      .boardScroller,
      .form-detail {
        margin-bottom: 50px;
      }
  
      .pgCtrl {
        position: relative;
        top: -100px;
        width: 90vw;
        height: 300px;
        left: 0;
      }
  
      .pgCtrlBtn-g {
        position: absolute;
        width: 55vw;
        top: 70px;
      }
  
      .detail-labels,
      .subForm {
        display: flex;
        position: relative;
      }
  
      #conflictLabel:hover,
      #eventLabel:hover,
      #glossaryLabel:hover,
      #impactLabel:hover,
      #resolutionLabel:hover {
        transform: translate(0, -10px);
        cursor: pointer;
        transition: 0.3s ease-in-out;
        opacity: 0.7;
      }
  
      .mainForm {
        flex-direction: column;
        left: 0;
      }
  
      .subForm {
        align-items: center;
        flex-direction: column;
        justify-content: center;
        left: 20px;
      }
  
      #noteBackBtn,
      #noteBackBtn:active,
      #noteBackBtn:hover {
        font-size: 25px;
        transform: translate(-20px, 40px);
      }
  
      .selected {
        transform: translate(0, -10px);
        transition: 0.3s ease-in-out;
        opacity: 1;
      }
  
      .form-detail {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
  
      .detail-labels {
        align-items: center;
        justify-content: center;
        padding-bottom: 50px;
        text-align: center;
      }
  
      .detailNote,
      .noteBoard {
        max-width: 90vw;
        min-width: 90vw;
      }
  
      @media screen and (max-width: 580px) {
        .label {
          font-size: 22px;
          margin: 0 10px;
        }
      }
    }
  </style>
  <div class="noteWrp">
    <button id="noteBackBtn" type="button">&lt; Back</button>
    <section class="book-info">
      <h1 class="bookTtl">${this.theBook.title.replaceAll("_", " ")}</h1>
    </section>
    <form class="noteForm" action="">
      <div class="formGroup">
        <div class="form">
          <div class="mainForm">
            <ul class="labels">
              <li id="eventLabel" class="label">
                <label id="eventNote" for="event">Event</label>
              </li>
              <li id="conflictLabel" class="label">
                <label id="conflictNote" for="conflict">Conflict</label>
              </li>
              <li id="resolutionLabel" class="label">
                <label id="resolutionNote" for="resolution">Resolution</label>
              </li>
              <li id="impactLabel" class="label">
                <label id="impactNote" for="impact">Impact</label>
              </li>
              <li id="glossaryLabel" class="label">
                <label id="glossaryNote" for="glossary">Glossary</label>
              </li>
            </ul>
            <div class="boardScroller">
              <div id="boardWrp" class="boardWrp">
                <textarea class="noteBoard" name="event" id="eventBoard" cols="30" rows="10"
                  placeholder="Type a notes here"></textarea>
                <textarea class="noteBoard" name="conflict" id="conflictBoard" cols="30" rows="10"
                  placeholder="Type a notes here"></textarea>
                <textarea class="noteBoard" name="resolution" id="resolutionBoard" cols="30" rows="10"
                  placeholder="Type a notes here"></textarea>
                <textarea class="noteBoard" name="impact" id="impactBoard" cols="30" rows="10"
                  placeholder="Type a notes here"></textarea>
                <textarea class="noteBoard" name="glossary" id="glossaryBoard" cols="30" rows="10"
                  placeholder="Type a notes here"></textarea>
              </div>
            </div>
          </div>
  
          <div class="subForm">
            <div class="form-detail">
              <label class="detail-labels" for="charactersNote">Characters:</label>
              <textarea class="detailNote" name="charactersNote" id="charactersNote" cols="35" rows="5"
                placeholder="Involved Characters"></textarea>
            </div>
            <div class="form-detail">
              <label class="detail-labels" for="timelineNotes">Timeline:</label>
              <textarea class="detailNote" name="timelineNotes" id="timelineNote" cols="35" rows="5"
                placeholder="After ... events || Before ... events"></textarea>
            </div>
          </div>
        </div>
        <div class="pgCtrl">
          <div class="pgCtrlWrp">
            <h3 class="pgCtrlTtl">Page</h3>
            <p class="pgNumber">${parseInt(this.theBook.lastRead)}</p>
            <div class="pgCtrlBtn-g">
              <button disabled type="button" class="pgCtrlBtn" id="backPg">
                -
              </button>
              <button type="button" class="pgCtrlBtn" id="nextPg">+</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
        `;
  }
}

window.customElements.define("book-note", BookNotes);
