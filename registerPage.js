let images = [
  "public/images/cover0.jpg",
  "public/images/cover1.png",
  "public/images/cover2.png",
  "public/images/cover3.jpg",
  "public/images/cover4.jpg",
  "public/images/cover5.jpg",
  "public/images/cover6.jpg",
  "public/images/cover7.jpg",
  "public/images/cover8.jpg",
  "public/images/cover9.jpg",
  "public/images/cover10.jpg",
  "public/images/cover11.jpg",
  "public/images/cover12.jpg",
  "public/images/cover13.jpg",
  "public/images/cover14.jpg",
  "public/images/cover15.jpg",
  "public/images/cover16.jpg",
  "public/images/cover17.jpg",
  "public/images/cover18.jpg",
  "public/images/cover19.jpg",
];

class RegisterPage extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    this.ttlMessages = `This field can't be empty`;
    this.genreMessages = (err) => {
      if (err === "empty") {
        return `This field can't be empty`;
      } else if (err === "space") {
        return `To add multiple genre, please to separate it only with comma without space`;
      } else if (err === "over") {
        return `Sorry, but you can add multiple genre up to four only.`;
      }
    };
    this.authMessages = `This field can't be empty`;
    this.rlsMessages = `This field can't be empty`;
    this.getGenreStore = JSON.parse(localStorage.getItem("genreStore"));
    this.genreStore = this.getGenreStore ? this.getGenreStore.genres : [];
    this.editRequest = JSON.parse(sessionStorage.getItem("editRequest"));
  }

  idGenerator(ttl, gen, aut, rls) {
    let rawDate = Date.now();
    let dateForm = new Date(rawDate);
    let date = new Date(dateForm);
    let dateString = date.toLocaleDateString();
    let timeString = date.toLocaleTimeString();

    let regExD = /([0-9]+)\/([0-9]+)\/([0-9]+)/;
    let regExT = /([0-9]+)\:([0-9]+)\:([0-9]+)/;

    let matchD = dateString.match(regExD);
    let matchT = timeString.match(regExT);

    let genre = gen.split(",");

    let appliedD = `${matchD[1]}${matchD[2]}${matchD[3]}`;
    let appliedT = `${matchT[1]}${matchT[2]}${matchT[3]}`;

    let raw_id = `${ttl[0]}${ttl.split(" ").length}$${genre[0][0]}${
      genre[1] ? genre[1][0] : ""
    }&${aut[0]}${rls}${appliedD}#${appliedT}`;

    let id = raw_id.replaceAll(" ", "");

    return id;
  }

  tagGenerator(inpTtl, inpGen, inpAuth, inpRls) {
    let genres = inpGen.split(",");
    let appliedG = genres.join(" ");

    try {
      if (genres && inpAuth && inpTtl && inpRls) {
        let tag1 = `${inpTtl} ${inpAuth} ${appliedG} ${inpRls} `;

        let regEx = /\s?\w+\s?/g;

        let exTag = tag1.match(regEx);
        console.log(exTag);

        let tag1Low = tag1.toLowerCase();
        let tag1Up = tag1.toUpperCase();
        let tag2 = tag1.replaceAll(" ", "s").toLowerCase();
        let tag3 = tag1.replaceAll(" ", "S").toUpperCase();

        if ((tag1, tag1Low, tag1Up, tag2, tag3)) {
          let tags = [tag1, tag1Low, tag1Up, tag2, tag3];
          return tags;
        } else if (!tag1) {
          throw new Error("tag1 are invalid");
        } else if (!tag2) {
          throw new Error("tag2 are invalid");
        } else if (!tag3) {
          throw new Error("tag3 are invalid");
        } else if (!tag1Low) {
          throw new Error("tag1Low are invalid");
        } else if (!tag1Up) {
          throw new Error("tag1Up are invalid");
        }
      } else {
        throw new Error("cant reach input value");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  registerNewBook() {
    let inpTtlVal = this.shadow.getElementById("inpTtl").value;
    let inpGenVal = this.shadow.getElementById("inpGen").value;
    let inpAuthVal = this.shadow.getElementById("inpAuth").value;
    let inpRlsVal = this.shadow.getElementById("inpRls").value;
    let bookCvr = this.shadow.getElementById("bookCvr");

    let cvrImg = bookCvr.getAttribute("src");

    let rawDate = Date.now();
    let dateForm = new Date(rawDate);
    let date = new Date(dateForm);
    let dateString = date.toLocaleDateString();
    let timeString = date.toLocaleTimeString();

    try {
      if (inpTtlVal && inpAuthVal && inpGenVal && inpRlsVal && cvrImg) {
        let title = inpTtlVal.replaceAll(" ", "_");
        let author = inpAuthVal.replaceAll(" ", "_");
        let genres = inpGenVal.split(",");
        if (!this.editRequest) {
          let newBook = {
            id: this.idGenerator(inpTtlVal, inpGenVal, inpAuthVal, inpRlsVal),
            title: title,
            genre: [...genres],
            author: author,
            realease: inpRlsVal,
            img: cvrImg,
            isFavorite: false,
            isFinished: false,
            notes: [
              {
                page: 1,
                event: "",
                conflict: "",
                resolution: "",
                impact: "",
                glossary: "",
                character: "",
                timeline: "",
              },
            ],

            dateRegistered: `${dateString}, ${timeString}`,
            dateUpdated: `${dateString}, ${timeString}`,
            lastModified: new Date().getTime(),
            tag: this.tagGenerator(inpTtlVal, inpGenVal, inpAuthVal, inpRlsVal),
            lastRead: 1,
          };
          let bookStorage = JSON.parse(localStorage.getItem("unfinishedBooks"));
          let bookArray = bookStorage ? bookStorage.books : [];
          let newBookArray = bookArray.concat(newBook);
          let updatedObject = {
            books: newBookArray,
          };
          let updatedGenre = this.genreStore.concat(genres);
          let setUpdatedGenre = new Set(updatedGenre);

          let updatedGArray = [...setUpdatedGenre];

          localStorage.setItem(
            "genreStore",
            JSON.stringify({ genres: updatedGArray.sort(), initial: ["All"] })
          );

          localStorage.setItem(
            "unfinishedBooks",
            JSON.stringify(updatedObject)
          );
          console.log("register book succeed");
          sessionStorage.setItem("currentPage", 1);
          window.location.reload();
        } else if (this.editRequest) {
          let newBook = {
            id: this.editRequest.id,
            title: title,
            genre: [...genres],
            author: author,
            realease: inpRlsVal,
            img: cvrImg,
            isFavorite: this.editRequest.isFavorite,
            isFinished: this.editRequest.isFinished,
            notes: this.editRequest.notes,
            dateRegistered: this.editRequest.dateRegistered,
            dateUpdated: `${dateString}, ${timeString}`,
            lastModified: new Date().getTime(),
            tag: this.tagGenerator(inpTtlVal, inpGenVal, inpAuthVal, inpRlsVal),
            lastRead: this.editRequest.lastRead,
          };
          let bookStatus = this.editRequest.isFinished;
          let bookStorage = JSON.parse(
            localStorage.getItem(
              bookStatus == true ? "finishedBooks" : "unfinishedBooks"
            )
          );
          let filterBookStorage = bookStorage.books.filter(
            (book) => book.id != this.editRequest.id
          );
          let updatedBooks = filterBookStorage.concat(newBook);
          let updatedObject = {
            books: updatedBooks,
          };
          let updatedGenre = this.genreStore.concat(genres);
          let setUpdatedGenre = new Set(updatedGenre);

          let updatedGArray = [...setUpdatedGenre];

          localStorage.setItem(
            "genreStore",
            JSON.stringify({ genres: updatedGArray.sort(), initial: ["All"] })
          );

          localStorage.setItem(
            bookStatus == true ? "finishedBooks" : "unfinishedBooks",
            JSON.stringify(updatedObject)
          );
          console.log("register book succeed");
          sessionStorage.setItem("currentPage", bookStatus ? 2 : 1);
          sessionStorage.removeItem("editRequest");
          window.location.reload();
        }
      } else {
        throw new Error("input value cannot be reached");
      }
    } catch (error) {
      console.log(error.stack);
    }
  }

  resetError(id) {
    let holder = this.shadow.getElementById(id);

    holder.innerHTML = `${" "}<br/>${" "}`;

    console.log(`${id} error message reset`);
  }

  slideToAutRls() {
    let regForm = this.shadow.getElementById("regForm");
    let formWrapper = this.shadow.getElementById("formWrapper");
    let progress = this.shadow.getElementById("progress");
    let fill2 = this.shadow.getElementById("f2");
    let fill3 = this.shadow.getElementById("f3");
    let crF = this.shadow.getElementById("crF");
    let crB = this.shadow.getElementById("crB");

    let inpTtl = this.shadow.getElementById("inpTtl");
    let inpGen = this.shadow.getElementById("inpGen");

    let genErr = this.shadow.getElementById("genErr");
    let ttlErr = this.shadow.getElementById("ttlErr");

    let genrePass = inpGen.value && inpGen.value.includes(" ");

    try {
      if (
        regForm &&
        inpGen.value !== "" &&
        inpTtl !== "" &&
        genrePass === false &&
        inpGen.value.split(",").length <= 4
      ) {
        console.log("regForm are accessible");
        regForm.classList.remove("regForm");
        regForm.classList.remove("regForm3");
        regForm.classList.add("regForm2");

        progress.classList.remove("progress");
        progress.classList.remove("progress3");
        progress.classList.add("progress2");

        setTimeout(() => {
          fill2.classList.remove("fillOff");
          fill2.classList.add("fill");
        }, 300);

        fill3.classList.remove("fill");
        fill3.classList.add("fillOff");

        crF.classList.remove("crF");
        crF.classList.remove("crF3");
        crF.classList.add("crF2");

        crB.classList.remove("crB");
        crB.classList.remove("crB3");
        crB.classList.add("crB2");

        formWrapper.classList.remove("formWrapper2");
        formWrapper.classList.add("formWrapper");
      } else if (!regForm) {
        throw new Error("regForm are unaccessible");
      } else if (inpGen.value === "" && inpTtl.value === "") {
        genErr.innerText = this.genreMessages("empty");
        console.log("gen error show");

        ttlErr.innerText = this.ttlMessages;
        console.log("title error show");

        setTimeout(() => this.resetError("genErr"), 5000);
        setTimeout(() => this.resetError("ttlErr"), 5000);
        throw new Error(this.ttlMessages);
      } else if (inpGen.value === "") {
        genErr.innerText = this.genreMessages("empty");
        console.log("gen error show");

        setTimeout(() => this.resetError("genErr"), 5000);

        throw new Error("genre field not fulfilled");
      } else if (inpGen.value.split(",").length > 4) {
        genErr.innerText = this.genreMessages("over");
        setTimeout(() => this.resetError("genErr"), 5000);
      } else if (inpTtl.value === "") {
        ttlErr.innerText = this.ttlMessages;
        console.log("title error show");

        setTimeout(() => this.resetError("ttlErr"), 5000);

        throw new Error("title field not fulfilled");
      } else if (genrePass === true) {
        genErr.innerText = this.genreMessages("space");
        console.log("gen error show");

        setTimeout(() => this.resetError("genErr"), 5000);

        throw new Error("genre field contain space");
      } else {
        throw new Error("form failure");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  slideToCnfrm() {
    let regForm = this.shadow.getElementById("regForm");
    let progress = this.shadow.getElementById("progress");
    let fill3 = this.shadow.getElementById("f3");
    let crF = this.shadow.getElementById("crF");
    let crB = this.shadow.getElementById("crB");

    let inpAuth = this.shadow.getElementById("inpAuth");
    let inpRls = this.shadow.getElementById("inpRls");

    let authErr = this.shadow.getElementById("authErr");
    let rlsErr = this.shadow.getElementById("rlsErr");

    try {
      if (regForm && inpAuth.value !== "" && inpRls.value !== "") {
        console.log("regForm are accessible");
        regForm.classList.remove("regForm2");
        regForm.classList.add("regForm3");
        progress.classList.remove("progress2");
        progress.classList.add("progress3");

        crF.classList.remove("crF2");
        crF.classList.add("crF3");

        crB.classList.remove("crB2");
        crB.classList.add("crB3");

        setTimeout(() => {
          fill3.classList.remove("fillOff");
          fill3.classList.add("fill");
        }, 300);

        console.log("class now regForm3");
      } else if (inpAuth.value === "" && inpRls.value === "") {
        authErr.innerText = this.authMessages;
        rlsErr.innerText = this.rlsMessages;

        setTimeout(() => this.resetError("authErr"), 5000);
        setTimeout(() => this.resetError("rlsErr"), 5000);

        throw new Error("author and realease are empty");
      } else if (inpAuth.value === "") {
        authErr.innerText = this.authMessages;
        setTimeout(() => this.resetError("authErr"), 5000);
      } else if (inpRls.value === "") {
        rlsErr.innerText = this.rlsMessages;
        setTimeout(() => this.resetError("rlsErr"), 5000);
      } else if (!regForm) {
        throw new Error("form failure");
      }
    } catch (error) {
      console.log(error.stack);
    }
  }

  slideToTitGen() {
    let regForm = this.shadow.getElementById("regForm");
    let formWrapper = this.shadow.getElementById("formWrapper");
    let progress = this.shadow.getElementById("progress");
    let fill2 = this.shadow.getElementById("f2");
    let fill3 = this.shadow.getElementById("f3");

    let crF = this.shadow.getElementById("crF");
    let crB = this.shadow.getElementById("crB");

    try {
      if (regForm) {
        console.log("regForm are accessible");
        regForm.classList.remove("regForm2");
        regForm.classList.add("regForm");
        console.log("class now regForm");
        progress.classList.remove("progress2");
        progress.classList.add("progress");

        fill2.classList.remove("fill");
        fill2.classList.add("fillOff");
        fill3.classList.remove("fill");
        fill3.classList.add("fillOff");

        crF.classList.remove("crF2");
        crF.classList.add("crF");
        crB.classList.remove("crB2");
        crB.classList.add("crB");

        formWrapper.classList.remove("formWrapper2");
        formWrapper.classList.add("formWrapper");
      } else {
        throw new Error("regForm are unaccessible");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  inpMirror() {
    const inpTtlMirr = this.shadow.getElementById("inpTtlMirr");
    const inpGenMirr = this.shadow.getElementById("inpGenMirr");
    const inpAuthMirr = this.shadow.getElementById("inpAuthMirr");
    const inpRlsMirr = this.shadow.getElementById("inpRlsMirr");

    const inpTtl = this.shadow.getElementById("inpTtl").value;
    const inpGen = this.shadow.getElementById("inpGen").value;
    const inpAuth = this.shadow.getElementById("inpAuth").value;
    const inpRls = this.shadow.getElementById("inpRls").value;

    try {
      if (
        inpTtl &&
        inpGen &&
        inpAuth &&
        inpRls &&
        inpTtlMirr &&
        inpGenMirr &&
        inpAuthMirr &&
        inpRlsMirr
      ) {
        inpTtlMirr.innerText = inpTtl;
        inpGenMirr.innerText = inpGen.replaceAll(",", " || ");
        inpAuthMirr.innerText = inpAuth;
        inpRlsMirr.innerText = inpRls;
      } else {
        throw new Error("inp and inpMirr unaccessible");
      }
    } catch (error) {
      console.log(error.stack);
    }
  }

  backToHome() {
    sessionStorage.removeItem("editRequest");
    sessionStorage.setItem("currentPage", 0);
    window.location.reload();
  }

  connectedCallback() {
    this.render();
    const titGenNBtn = this.shadow.getElementById("titGenNBtn");
    const autRlsNBtn = this.shadow.getElementById("autRlsNBtn");
    const autRlsBBtn = this.shadow.getElementById("autRlsBBtn");
    const cnfrmBack = this.shadow.getElementById("cnfrmBack");
    const cnfrmOk = this.shadow.getElementById("cnfrmOk");
    const body = document.querySelector("body");
    const regBackBtn = this.shadow.getElementById("regBackBtn");

    const inpTtl = this.shadow.getElementById("inpTtl");
    const inpGen = this.shadow.getElementById("inpGen");
    const inpAuth = this.shadow.getElementById("inpAuth");
    const inpRls = this.shadow.getElementById("inpRls");

    const inpTtlMirr = this.shadow.getElementById("inpTtlMirr");
    const inpGenMirr = this.shadow.getElementById("inpGenMirr");
    const inpAuthMirr = this.shadow.getElementById("inpAuthMirr");
    const inpRlsMirr = this.shadow.getElementById("inpRlsMirr");

    regBackBtn.addEventListener("click", () => this.backToHome());

    body.style.backgroundColor = "#c7c7c7";

    try {
      if (
        titGenNBtn &&
        autRlsBBtn &&
        autRlsNBtn &&
        inpTtl &&
        inpGen &&
        inpAuth &&
        inpRls &&
        !this.editRequest
      ) {
        console.log("regButtons are listening");
        titGenNBtn.addEventListener("click", () => this.slideToAutRls());
        autRlsNBtn.addEventListener("click", () => this.slideToCnfrm());
        autRlsBBtn.addEventListener("click", () => this.slideToTitGen());
        cnfrmBack.addEventListener("click", () => this.slideToAutRls());
        cnfrmOk.addEventListener("click", () => this.registerNewBook());

        inpTtl.addEventListener("keyup", () => this.inpMirror());
        inpGen.addEventListener("keyup", () => this.inpMirror());
        inpAuth.addEventListener("keyup", () => this.inpMirror());
        inpRls.addEventListener("keyup", () => this.inpMirror());
      } else if (
        titGenNBtn &&
        autRlsBBtn &&
        autRlsNBtn &&
        inpTtl &&
        inpGen &&
        inpAuth &&
        inpRls &&
        this.editRequest
      ) {
        console.log("regButtons are listening");
        titGenNBtn.addEventListener("click", () => this.slideToAutRls());
        autRlsNBtn.addEventListener("click", () => this.slideToCnfrm());
        autRlsBBtn.addEventListener("click", () => this.slideToTitGen());
        cnfrmBack.addEventListener("click", () => this.slideToAutRls());
        cnfrmOk.addEventListener("click", () => this.registerNewBook());

        inpTtl.addEventListener("keyup", () => this.inpMirror());
        inpGen.addEventListener("keyup", () => this.inpMirror());
        inpAuth.addEventListener("keyup", () => this.inpMirror());
        inpRls.addEventListener("keyup", () => this.inpMirror());

        inpTtl.value = this.editRequest.title.replaceAll("_", " ");
        inpGen.value = this.editRequest.genre.join(",");
        inpAuth.value = this.editRequest.author.replaceAll("_", " ");
        inpRls.value = this.editRequest.realease;

        inpTtlMirr.value = this.editRequest.title;
        inpGenMirr.value = this.editRequest.genre.join(",");
        inpAuthMirr.value = this.editRequest.author;
        inpRlsMirr.value = this.editRequest.realease;
      } else if (!titGenNBtn) {
        throw new Error("titGenNBtn are unaccessible");
      } else if (!autRlsNBtn) {
        throw new Error("autRlsNBtn are unaccessible");
      } else if (!autRlsBBtn) {
        throw new Error("autRlsBBtn are unaccessible");
      } else {
        throw new Error("DOM reference are invalid");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  render() {
    this.shadow.innerHTML = `
    <style>
    .background,
    .regPg {
      display: flex;
      height: 100vh
    }
  
    .fill,
    .fillOff {
      transition: .3s ease-out
    }
  
    .background,
    .formWrapper {
      overflow-x: hidden;
      overflow-y: hidden
    }
  
    .regBackBtn,
    button {
      cursor: pointer
    }
  
    @font-face {
      font-family: "Lucida Sans";
      src: url(public/font/LSANS.TTF)
    }
  
    @font-face {
      font-family: "I pixel u";
      src: url(public/font/I-PIXEL-U.TTF)
    }
  
    @font-face {
      font-family: "Segoe UI";
      src: url(public/font/SEGOEUI.TTF)
    }
  
    @font-face {
      font-family: "Vladimir Script";
      src: url(public/font/VLADIMIR.TTF)
    }
  
    .regPg {
      flex-direction: column;
      align-items: center;
      justify-content: center
    }
  
    .background {
      position: relative;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #c7c7c7;
      width: 100vw;
      padding-top: 20px;
      top: -10px;
      left: -10px;
      margin: 0
    }
  
    .circle,
    .progressWrp {
      height: 50px;
      display: flex;
      z-index: 10
    }
  
    .progressWrp {
      background-color: transparent;
      position: absolute;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 325px;
      top: 40px
    }
  
    .circle,
    .fill,
    .fillOff {
      border-radius: 50%;
      position: relative
    }
  
    .circle {
      width: 50px;
      background-color: #0f3460;
      align-items: center;
      justify-content: center;
      margin: 0 30px
    }
  
    #f1,
    #f2,
    #f3,
    .fill,
    .fillOff {
      background-color: #e94560
    }
  
    .formWrapper,
    .progressGroup {
      display: flex;
      align-items: center
    }
  
    .fill,
    .fillOff {
      width: 35px;
      height: 35px
    }
  
    .formCard,
    .regInp {
      border-radius: 30px
    }
  
    .formWrapper,
    .progressBar,
    .progressGroup,
    .regTitle {
      position: absolute
    }
  
    .fillOff {
      width: 0;
      height: 0
    }
  
    .progressGroup {
      justify-content: flex-start;
      left: 20px
    }
  
    .progressBar {
      height: 15px;
      width: 255px;
      background-color: #0f3460;
      left: 10px;
      z-index: 5
    }
  
    .progress,
    .progress2,
    .progress3 {
      position: absolute;
      height: 15px;
      background-color: #e94560;
      left: 10px;
      z-index: 6;
      transition: .5s ease-out
    }
  
    .formWrapper,
    .regForm {
      background-color: transparent
    }
  
    .progress {
      width: 2px
    }
  
    .progress2 {
      width: 125px
    }
  
    .progress3 {
      width: 225px
    }
  
    .regTitle {
      font-family: "Vladimir Script";
      color: #a4a4a4;
      font-size: 70px;
      top: 80px;
      z-index: 99;
      text-align: center
    }
  
    .regInp,
    .regLabel {
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif
    }
  
    .infItem,
    .infTtl,
    .infTxt,
    .regBack,
    .regInp,
    .regLabel {
      color: #fff
    }
  
    .formWrapper {
      margin-top: 100px;
      justify-content: center;
      flex-direction: column;
      width: 750px;
      z-index: 50;
      top: 100px;
      transition: .3s ease-out
    }
  
    .regForm,
    .regForm2 {
      position: relative;
      display: flex;
      align-items: center
    }
  
    .regForm {
      justify-content: center;
      flex-direction: row;
      top: 0;
      left: 1025px;
      transition: .3s ease-out
    }
  
    .regForm2,
    .regForm3 {
      background-color: transparent;
      left: 1175px;
      transition: .3s ease-out;
      top: 0
    }
  
    .regForm2 {
      justify-content: center;
      flex-direction: row;
      transform: translate(-900px, 0)
    }
  
    .regForm3,
    .ttlNgen {
      display: flex;
      align-items: center;
      position: relative
    }
  
    .regForm3 {
      justify-content: center;
      flex-direction: row;
      transform: translate(-1935px, 0)
    }
  
    .ttlNgen {
      justify-content: center;
      flex-direction: column;
      left: -220px
    }
  
    .formCard,
    .inpGroup {
      display: flex;
      align-items: center
    }
  
    .formCard {
      position: relative;
      justify-content: center;
      flex-direction: column;
      background-color: #1e1e34;
      width: 700px;
      height: 650px;
      z-index: 10
    }
  
    .inpGroup {
      justify-content: center;
      flex-direction: column;
      margin: 0;
      position: relative;
      top: 0
    }
  
    .autNrls,
    .formBtnGroup {
      position: relative;
      display: flex;
      align-items: center
    }
  
    .regLabel {
      font-size: 30px;
      margin-bottom: 25px
    }
  
    .regInp {
      width: 550px;
      height: 55px;
      background-color: #0f3460;
      border: none;
      outline: 0;
      padding-left: 20px;
      padding-right: 20px;
      font-size: 28px
    }
  
    .regBack,
    .regNext {
      width: 190px;
      height: 65px;
      font-size: 30px;
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
      box-shadow: 0 3px 7px .5px rgba(0, 0, 0, .3);
      border: none;
      outline: 0
    }
  
    .formBtnGroup {
      justify-content: center;
      top: 30px
    }
  
    .regNext {
      background-color: #e94560
    }
  
    .regNext:hover {
      background-color: #ac3347
    }
  
    .regBack {
      background-color: #2a2a4e
    }
  
    .drpfg,
    .infTtl,
    .infTxt,
    .regBackBtn {
      background-color: transparent
    }
  
    .regBack:hover {
      background-color: #19192e
    }
  
    .autNrls {
      justify-content: center;
      flex-direction: column;
      top: 35px;
      left: -250px
    }
  
    .cnfrm,
    .cnfrmWrp {
      align-items: center;
      display: flex;
      position: relative
    }
  
    #inpGroup2 {
      transform: translate(0, -35px)
    }
  
    #autRlsBBtn,
    #autRlsNBtn {
      transform: translate(0, -150px);
      margin: 0 120px;
      z-index: 11
    }
  
    .cnfrm {
      justify-content: center
    }
  
    #cnfrmCard {
      width: 750px;
      left: -20px
    }
  
    .cnfrmWrp {
      flex-direction: column;
      justify-content: center
    }
  
    .cnfrmContent {
      position: absolute;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      transform: translate(0, -80px)
    }
  
    .infList {
      list-style: none;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      position: relative;
      flex-direction: column;
      width: 60%;
      transform: translate(-50px, 0)
    }
  
    .cnfrmBtnGroup,
    .infItem {
      align-items: center;
      position: relative;
      display: flex
    }
  
    .infItem {
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
      justify-content: flex-start;
      margin: -10px 0;
      width: 80%;
      padding: 0
    }
  
    .infTtl {
      opacity: 1;
      border: none;
      outline: 0;
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
      font-size: 25px;
      width: 100%
    }
  
    .infTxt {
      opacity: .5;
      border: none;
      outline: 0;
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
      font-size: 20px;
      width: 80%
    }
  
    .errMessage,
    .regBackBtn {
      font-family: "Lucida Sans"
    }
  
    .cnfrmBtnGroup {
      justify-content: space-between;
      width: 650px;
      top: 200px
    }
  
    .bookCvr {
      position: relative;
      width: 270px;
      box-shadow: 0 3px 7px .5px rgba(0, 0, 0, .3)
    }
  
    .drpfg {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100vw;
      height: 100vh;
      z-index: 2
    }
  
    .crF,
    .crF2,
    .crF3 {
      position: absolute;
      z-index: 5;
      opacity: .4;
      transition: .6s ease-out;
      width: 70vw;
      top: 500px
    }
  
    .lineGr {
      transform: translate(0, 200px);
      width: 400px
    }
  
    .crF {
      transform: scale(1) rotate(0);
      opacity: .4
    }
  
    .crF2 {
      transform: scale(.9) rotate(15deg);
      opacity: .3
    }
  
    .crF3 {
      transform: scale(.84) rotate(30deg);
      opacity: .2
    }
  
    .crB,
    .crB2,
    .crB3 {
      position: absolute;
      z-index: 5;
      opacity: .8;
      transition: .8s ease-out;
      top: 300px;
      width: 150vw
    }
  
    .crB {
      transform: scale(1) rotate(0);
      opacity: .8
    }
  
    .crB2 {
      transform: scale(.92) rotate(15deg);
      opacity: .6
    }
  
    .crB3 {
      transform: scale(.87) rotate(30deg);
      opacity: .4
    }
  
    .errMessage {
      font-size: 15px;
      color: gold;
      position: relative;
      text-align: center
    }
  
    .regBackBtn {
      position: absolute;
      z-index: 99;
      border: none;
      outline: 0;
      font-size: 40px;
      color: #16213e;
      transition: .15s ease-out;
      top: 60px;
      left: 60px;
      opacity: .7
    }
  
    .regBackBtn:active,
    .regBackBtn:hover {
      opacity: 1;
      transform: scale(1.1)
    }
  
    @media screen and (max-width:1600px) {
      .formWrapper {
        transform: scale(.9) translate(0, -100px)
      }
  
      .regTitle {
        font-size: 35px;
        transform: translate(0, 0)
      }
    }
  
    @media screen and (max-width:1366px) {
      .formWrapper {
        transform: scale(.75) translate(0, -175px)
      }
    }
  
    @media screen and (max-width:1280px) {
      .formWrapper {
        transform: scale(.7) translate(0, -250px)
      }
    }
  
    @media screnn and (max-width:960px) {
      .formWrapper {
        transform: scale(.6) translate(0, -350px)
      }
    }
  
    @media screen and (max-width:810px) {
      .formWrapper {
        transform: scale(.5) translate(10px, -450px)
      }
  
      .crB,
      .crB2,
      .crB3 {
        position: absolute;
        z-index: 5;
        opacity: .8;
        transition: .8s ease-out;
        top: 130px;
        width: 150vw
      }
  
      .crF,
      .crF2,
      .crF3 {
        position: absolute;
        z-index: 5;
        opacity: .4;
        transition: .6s ease-out;
        width: 70vw;
        top: 400px
      }
  
      .regTitle {
        font-size: 40px;
        transform: translate(0, -20px)
      }
  
      .regBackBtn,
      .regBackBtn:active,
      .regBackBtn:hover {
        transform: translate(-50px, -10px)
      }
  
      .regBackBtn {
        font-size: 25px
      }
  
      .progressWrp {
        transform: scale(.67) translate(0, -40px)
      }
    }
  </style>
  
  <section id="regPg">
    <div class="background">
      <button id="regBackBtn" class="regBackBtn"> &lt; Back </button>
      <div class="progressWrp">
        <div class="circle" id="cr1">
          <div class="fill" id="f1"></div>
        </div>
        <div class="circle" id="cr2">
          <div class="fillOff" id="f2"></div>
        </div>
        <div class="circle" id="cr3">
          <div class="fillOff" id="f3"></div>
        </div>
        <div class="progressGroup">
          <div class="progressBar"></div>
          <div id="progress" class="progress"></div>
        </div>
      </div>
      <h1 class="regTitle">${this.editRequest ? "Edit" : "Book"} ${
      this.editRequest ? "Book" : "Registration"
    }</h1>
      <div id="formWrapper" class="formWrapper">
        <form id="regForm" class="regForm">
          <section class="ttlNgen">
            <div class="formCard">
              <div id="inpGroup1" class="inpGroup">
                <label class="regLabel" for="title">Book Title</label>
                <input class="regInp" type="text" name="title" id="inpTtl" required />
                <p id="ttlErr" class="errMessage">${" "}<br />${" "}</p>
              </div>
              <div id="inpGroup1" class="inpGroup">
                <label class="regLabel" for="genre">Genre</label>
                <input class="regInp" type="text" name="genre" id="inpGen" required />
                <p id="genErr" class="errMessage">${" "}<br />${" "}</p>
              </div>
              <div class="formBtnGroup">
                <button type="button" class="regNext" id="titGenNBtn">Next</button>
              </div>
            </div>
          </section>
          <section class="autNrls">
            <div class="formCard">
              <div id="inpGroup2" class="inpGroup">
                <label class="regLabel" for="author">Author</label>
                <input class="regInp" type="text" name="author" id="inpAuth" required />
                <p id="authErr" class="errMessage">${" "}<br />${" "}</p>
              </div>
              <div id="inpGroup2" class="inpGroup">
                <label class="regLabel" for="realese">Realease Year</label>
                <input class="regInp" type="number" name="realease" id="inpRls" required />
                <p id="rlsErr" class="errMessage">${" "}<br />${" "}</p>
              </div>
            </div>
            <div class="formBtnGroup">
              <button type="button" class="regBack" id="autRlsBBtn">Back</button>
              <button type="button" class="regNext" id="autRlsNBtn">Next</button>
            </div>
          </section>
          <section class="cnfrm">
            <div class="formCard" id="cnfrmCard">
              <div class="cnfrmWrp">
                <div class="cnfrmContent">
                  <figure class="cvrFg">
                    <img id="bookCvr" class="bookCvr" src=${
                      this.editRequest
                        ? this.editRequest.img
                        : images[Math.ceil(Math.random() * 100) % 20]
                    } alt="bookCover">
                  </figure>
                  <ul class="infList">
                    <li class="infItem">
                      <p class="infTtl" id="inpTtlMirr"></p>
                    </li>
                    <li class="infItem">
                      <p class="infTxt" id="inpGenMirr"></p>
                    </li>
                    <li class="infItem">
                      <p class="infTxt" id="inpAuthMirr"></p>
                    </li>
                    <li class="infItem">
                      <p class="infTxt" id="inpRlsMirr"></p>
                    </li>
                  </ul>
                </div>
                <figure class="lineFg">
                  <img class="lineGr" src="public/svg/SVG/dblLine.svg" alt="dblLine" srcset="">
                </figure>
                <div class="cnfrmBtnGroup">
                  <button type="button" class="regBack" id="cnfrmBack">Back</button>
                  <button type="button" class="regNext" id="cnfrmOk">Confirm</button>
                </div>
              </div>
            </div>
        </form>
      </div>
      <figure class="drpfg">
        <img id="crF" class="crF" src="public/svg/SVG/circle.svg" alt="circle" srcset="">
        <img id="crB" class="crB" src="public/svg/SVG/circle.svg" alt="circle" srcset="">
      </figure>
    </div>
  </section>
      `;
  }
}

window.customElements.define("register-page", RegisterPage);
