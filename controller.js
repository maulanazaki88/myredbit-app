const getUfBooks = JSON.parse(localStorage.getItem("unfinishedBooks"));
const getFBooks = JSON.parse(localStorage.getItem("finishedBooks"));
const keywords = sessionStorage.getItem("keywords");
const getMatchedBooks = JSON.parse(sessionStorage.getItem("matchedBooks"));
const currentGenre = sessionStorage.getItem("currentGenre")
  ? sessionStorage.getItem("currentGenre")
  : "All";

const currentSort = sessionStorage.getItem("currentSort")
  ? sessionStorage.getItem("currentSort")
  : "-";

const currentPage = sessionStorage.getItem("currentPage")
  ? sessionStorage.getItem("currentPage")
  : 0;

const unfinishedBooks = getUfBooks ? getUfBooks.books : [];
const finishedBooks = getFBooks ? getFBooks.books : [];
const collections = [...unfinishedBooks, ...finishedBooks];
const favoriteBooks = collections.filter((book) => book.isFavorite == true);
const matchedBooks = getMatchedBooks ? getMatchedBooks.books : [];

const unfinishedGList = unfinishedBooks.map((book) => {
  return book.genre;
});

const finishedGList = finishedBooks.map((book) => {
  return book.genre;
});

const collectionsGList = collections.map((book) => {
  return book.genre;
});

const unfinishedGSet = new Set(unfinishedGList.flat(1));
const finishedGSet = new Set(finishedGList.flat(1));
const collectionsGSet = new Set(collectionsGList.flat(1));

const selectedBooks = [
  [],
  unfinishedBooks,
  finishedBooks,
  [],
  [],
  favoriteBooks,
  collections,
  matchedBooks,
];

const selectedGSet = [
  [],
  [...unfinishedGSet],
  [...finishedGSet],
  [],
  [],
  [],
  [...collectionsGSet],
  [],
];

const filteredBooks =
  currentGenre == "All"
    ? selectedBooks[currentPage]
    : selectedBooks[currentPage].filter((book) =>
        book.genre.join(" ").includes(currentGenre)
      );

const sortedBooks = () => {
  if (currentSort === "-") {
    const array = filteredBooks;
    return array;
  } else if (currentSort === "Name") {
    const titleArray = filteredBooks.map((book) => {
      return book.title;
    });

    const sortedBooks = titleArray
      .sort()
      .slice(0)
      .reverse()
      .map((title) => {
        let book = filteredBooks.find((book) => book.title === title);
        return book;
      });

    return sortedBooks;
  } else if (currentSort === "Year") {
    const array = () => {
      const initiate = () => {
        if (filteredBooks) {
          return "start";
        } else {
        }
      };

      const formArray = (cmd) => {
        if (cmd === "start") {
          const numbers = filteredBooks.map((book) => {
            return book.realease;
          });
          console.log("numbers created");
          console.log(numbers);
          return numbers;
        } else {
          throw new Error("invalid command");
        }
      };

      const sortArray = (numbers) => {
        if (numbers) {
          const sortedNumbers = numbers.slice(0);
          let newArray;
          let swap;
          do {
            swap = false;
            for (let n = 0; n < sortedNumbers.length; n++) {
              if (sortedNumbers[n] < sortedNumbers[n + 1]) {
                let [a, b] = [sortedNumbers[n], sortedNumbers[n + 1]];
                [sortedNumbers[n], sortedNumbers[n + 1]] = [b, a];

                swap = true;
              } else {
                newArray = sortedNumbers;
              }
            }
          } while (swap);
          console.log("sortArray successful");
          console.log(newArray);
          return newArray;
        } else {
          throw new Error("NUMBERS ARRAY ARE INVALID");
        }
      };

      const populateObj = (newArray) => {
        if (newArray) {
          const objs = newArray.map((number) => {
            let obj = filteredBooks.filter((book) => book.realease === number);
            return obj;
          });
          console.log("populate obj is successful");
          console.log(objs);
          return objs;
        } else {
          throw new Error("SORTED ARRAY ARE INVALID ");
        }
      };

     const flattenArray = (objs) => {
        if (objs) {
         const result = objs.flat(1);
          console.log(result);
          return result;
        } else {
          throw new Error("POPULATED OBJS INVALID");
        }
      };
      try {
       const cmd = initiate();
       const numbers = formArray(cmd);
       const newArray = sortArray(numbers);
       const populatedObj = populateObj(newArray);
       const flatArray = flattenArray(populatedObj);

        return flatArray;
      } catch (error) {
        console.log(error.stack);
      }
    };
    return array();
  } else {
    console.log("currentSort are invalid");
  }
};

const appliedBooks = currentSort !== "-" ? sortedBooks() : filteredBooks;

const booksDisplay = appliedBooks
  .slice(0)
  .reverse()
  .map((book, index) => {
    let template;

    try {
      if (book.title && typeof book.title === "string") {
        const [genre1, genre2, genre3, genre4] = book.genre;

        template = `
          <li><book-card _id=${book.id} img=${book.img} title=${book.title}
           genre1=${genre1} genre2=${genre2} genre3=${genre3} genre4=${genre4}  
           date=${book.realease} author=${book.author} isFavorite=${book.isFavorite} isFinished=${book.isFinished} ></book-card></li>
        `;
      } else {
        throw new Error("book title are not available or not a string");
      }
    } catch (error) {
      console.log(error.message);
    }

    return template;
  });

const genreScroll = ["All"]
  .concat(selectedGSet[currentPage].sort())
  .map((genre, index) => {
    return `<li class="genreItem" ><scrolldown-item id=${index} _id=${genre} list=${genre} ><scrolldown-item></li>`;
  });

let collectionPage = (collection, booksDisplay, filter) => {
  const ufCltnNB = {
    title: `Unfinished Books`,
    message: `You are currently do not have any books on your collection.`,
    guide: `Register Your Book Now!`,
    figure: "",
  };
  const fCltnNB = {
    title: `Finished Books`,
    message: `Oops! You are currently not yet finished any book from your collection.`,
    guide: `Wake up and continue reading!`,
    figure: `<figure>
      <img class="motivation" src="public/images/sleeping-cat.jfif" alt="sleeping cat" />
    </figure>`,
  };
  const favCltnNB = {
    title: `Favorite Books`,
    message: `You are currently do not have favorite books from your collection.`,
    guide: `To set a book to favorite, click Toggle Favorite Button on top-right the book cover.`,
    figure: ``,
  };

  const allCltnNB = {
    title: `All Books`,
    message: `You are currently do not have any books on your collection.`,
    guide: `Register Your Book Now!`,
    figure: ``,
  };

  const srcCltnNB = {
    title: `Search Results`,
    message: `No result for "${keywords}"`,
    guide: `Try search books by another property such as author, genre, or year.`,
    figure: ``,
  };

  const page = () => {
    let obj;
    switch (collection) {
      case "unfinishedBooks":
        obj = ufCltnNB;
        break;
      case "finishedBooks":
        obj = fCltnNB;
        break;
      case "favoriteBooks":
        obj = favCltnNB;
        break;
      case "allBooks":
        obj = allCltnNB;
        break;
      case "searchBooks":
        obj = srcCltnNB;
        break;

      default:
        break;
    }
    return obj;
  };

  return `
  <style>
  .bookCltn,
  .noBooks {
    position: relative;
    display: flex;
    align-items: center
  }

  #cltnWrp,
  .bookCltn,
  .cltnTitle,
  .noBooks {
    position: relative
  }

  .cltnTitle,
  .noBooksGuide,
  .noBooksMessage {
    text-align: center;
    color: #fff
  }

  #backBtn,
  .noBooksGuide:hover {
    opacity: .4
  }

  #backBtn,
  .filterItem,
  .noBooksGuide,
  .noBooksMessage {
    font-family: "Lucida Sans"
  }

  #backBtn,
  #cltnWrp {
    background-color: transparent
  }

  #noBooksGuide,
  .cltnTitle,
  .noBooksGuide {
    text-decoration: underline
  }

  @font-face {
    font-family: "Lucida Sans";
    src: url(public/font/LSANS.TTF)
  }

  @font-face {
    font-family: "i pixel u";
    src: url(public/font/I-PIXEL-U.TTF)
  }

  @font-face {
    font-family: "Segoe UI";
    src: url(public/font/SEGOEUI.TTF)
  }

  #cltnWrp {
    display: grid;
    grid-template-columns: repeat(6, auto);
    margin: 100px 0 500px;
    left: -25px
  }

  .bookCltn {
    justify-content: center;
    flex-direction: column;
    width: 100vw
  }

  .cltnTitle {
    top: 200px;
    left: 0;
    font-size: 70px;
    font-weight: 500
  }

  #backBtn {
    position: absolute;
    outline: 0;
    border: none;
    color: #e94560;
    font-size: 40px;
    top: 120px;
    left: 80px;
    cursor: pointer;
    transition: .15s ease-in-out
  }

  .filterCtn,
  .filterCtnOff {
    border-radius: 30px;
    padding-right: 20px;
    padding-left: 20px;
    background-color: #0f3460
  }

  #backBtn:hover {
    opacity: 1;
    transform: scale(1.1)
  }

  #backBtn:action {
    transform: scale(.87);
    color: red
  }

  .noBooks {
    justify-content: center;
    flex-direction: column;
    top: 200px;
    margin-bottom: 500px
  }

  .filter,
  .filterCtn {
    display: flex;
    align-items: center;
    position: relative
  }

  .noBooksMessage {
    font-size: 30px
  }

  .noBooksGuide {
    font-size: 25px;
    cursor: pointer
  }

  .filter {
    justify-content: center;
    top: 200px
  }

  .filterCtn {
    justify-content: center
  }

  .filterCtnOff {
    position: relative;
    display: none;
    align-items: center;
    justify-content: center
  }

  .filterWrp {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    width: 100%
  }

  .filterItem {
    font-size: 40px;
    color: #fff;
    margin: 0 20px
  }

  .filterVal {
    color: gold;
    cursor: pointer
  }

  #noBooksGuide,
  .scrolldownItem {
    color: #fff;
    font-family: "Lucida Sans";
    text-align: center
  }

  .filterVal:hover {
    color: gold;
    cursor: pointer;
    opacity: .7
  }

  .scrolldown {
    position: absolute;
    display: none;
    align-items: center;
    justify-content: center;
    background-color: #0f3460;
    height: -moz-max-content;
    height: fit-content;
    width: 300px;
    padding-top: 20px;
    padding-bottom: 80px;
    z-index: 20;
    box-shadow: 0 3px 7px .5px rgba(0, 0, 0, .3);
    border-radius: 20px;
    top: 550px;
  }

  .scrolldownWrp {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    list-style: none;
    font-size: 0px;
    position: relative;
    left: -10px
  }

  .scrolldownItem {
    font-size: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 2px solid #fff;
    height: 100px;
    transition: .1s ease-in;
    width: 180px;
    cursor: pointer;
    z-index: 99
  }

  .scrolldownItem:hover {
    color: gold;
    width: 200px
  }

  #genreScrolldown {
    transform: translate(-120px, 0px);
    height: 500px;
    overflow-x: hidden;
    overflow-y: scroll;
    align-items: baseline
  }

  #genreScrolldown::-webkit-scrollbar {
    width: .3em
  }

  #genreScrolldown::-webkit-scrollbar-track {
    width: 20px;
    background-color: transparent;
    border-radius: 100vw;
    margin-block: 1em
  }

  #genreScrolldown::-webkit-scrollbar-thumb {
    background-color: #fff;
    border-radius: 100vw;
    width: auto
  }

  #genreScrolldownWrp {
    transform: translate(0, 0)
  }

  #sortScrolldown {
    transform: translate(120px, -0px);
    z-index: 99
  }

  #sortScrolldownWrp {
    position: relative;
    left: -20px
  }

  .backdrop {
    display: none;
    background-color: #000;
    opacity: .2;
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 19;
    top: 0;
    left: 0
  }

  .motivation {
    width: 720px;
    border: 20px solid #e94560
  }

  #noBooksGuide {
    font-size: 40px;
    cursor: default
  }

  @media screen and (max-width:1280px) {
    #cltnWrp {
      grid-template-columns: repeat(4, auto);
      transform: translate(60px, 0)
    }

    .filter {
      transform: scale(.67)
    }

    .cltnTitle {
      font-size: 55px
    }

    .filterItem,
    .filterVal {
      font-size: 30px
    }

    #noBooksGuide,
    .noBooksMessage {
      font-size: 30px;
      width: 70vw
    }

    #genreScrolldown {
      transform: translate(-80px, -200px) scale(.72)
    }

    #sortScrolldown {
      transform: translate(80px, -150px) scale(.72)
    }

    .motivation {
      width: 612px
    }

    @media screen and (max-width:810px) {
      #cltnWrp {
        margin-top: 0;
        transform: translate(10px, 0)
      }

      #backBtn {
        left: 20px;
        font-size: 30px
      }

      .cltnTitle {
        font-size: 45px
      }

      #noBooksGuide,
      .noBooksMessage {
        font-size: 20px;
        width: 70vw
      }

      #noBooksGuide {
        text-align: center
      }

      .motivation {
        width: 360px
      }

      #genreScrolldown {
        transform: translate(-80px, -200px) scale(.72)
      }

      #sortScrolldown {
        transform: translate(80px, -150px) scale(.72)
      }
    }

    @media screen and (max-width:600px) {
      #cltnWrp {
        grid-template-columns: repeat(2, auto);
        left: 10px
      }

      #genreScrolldown {
        transform: translate(-80px, -200px) scale(.72)
      }

      #sortScrolldown {
        transform: translate(80px, -180px) scale(.72)
      }
    }
  }
</style>
<section id="allBookCltn" class="bookCltn">
  <h1 class="cltnTitle">${page().title}</h1>
  <button id="backBtn"> &lt; Back</button>
  ${
    booksDisplay[0]
      ? `
  <div id="genreScrolldown" class="scrolldown">
    <ul id="genreScrolldownWrp" class="scrolldownWrp">${genreScroll}</ul>
  </div>
  <div id="sortScrolldown" class="scrolldown">
    <ul id="sortScrolldownWrp" class="scrolldownWrp">
      <li id="byName" class="scrolldownItem">
        Name
      </li>
      <li id="byYear" class="scrolldownItem">
        Year
      </li>
    </ul>
  </div>
  <div id="backdrop" class="backdrop"></div>
  <div class="filter">
    <div class=${filter ? "filterCtn" : "filterCtnOff"}>
      <ul class="filterWrp">
        <li class="filterItem" id="f-genre">Genre : <span id="genreVal" class="filterVal">${currentGenre}</span></li>
        <li class="filterItem" id="f-sort">Sort by : <span id="sortVal" class="filterVal">${currentSort}</span></li>
      </ul>
    </div>
  </div>
  <book-collection>
    <div id="cltnWrp" slot="collection">${booksDisplay}</div>
  </book-collection>`
      : `<div class="noBooks">
    <h2 class="noBooksMessage">${page().message}</h2><br />
    ${page().figure}
    <h3 id="noBooksGuide" class="noAllGuide">${page().guide}</h3>
  </div>`
  }
</section>`;
};

const pages = [
  `
  <style>
  .ldg-pg, .ldgWrp {
  position: relative;
  width: 100vw;
  display: flex
}

@font-face {
  font-family: "Lucida Sans";
  src: url(public/font/LSANS.TTF)
}

@font-face {
  font-family: "i pixel u";
  src: url(public/font/I-PIXEL-U.TTF)
}

@font-face {
  font-family: "Segoe UI";
  src: url(public/font/SEGOEUI.TTF)
}

.ldgWrp {
  align-items: center;
  justify-content: center;
  flex-direction: column
}

.ldg-pg {
  z-index: 10;
  height: 100vh;
  align-items: center;
  justify-content: center;
  top: 80px
}

.book-pg, .btnGroup {
  flex-direction: row;
  background-color: transparent;
  display: flex
}

.btnGroup {
  position: absolute;
  justify-content: space-between;
  width: 1230px;
  top: 550px;
  z-index: 20;
  transform: translate(300px, 1580px)
}

.book-pg {
  position: relative;
  align-items: center;
  justify-content: center;
  top: 300px;
  left: 0;
  margin: 0
}

.shelfsWrp {
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 1500px;
  margin: 0
}

#shelf1, #shelf2 {
  position: relative;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 800px;
  left: 0
}

.midLine {
  position: relative;
  top: 180px
}

.spacer {
  aspect-ratio: 960/300;
  width: 105%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  transform: translate(0, 100px)
}

.layer1 {
  background-image: url(public/svg/SVG/wave-intro.svg)
}

@media screen and (max-width:1500px) {
  .shelfsWrp {
    transform: scale(.87)
  }
}

@media screen and (max-width:1366px) {
  .shelfsWrp {
    transform: scale(.61)
  }
}

@media screen and (max-width:960px) {
  .shelfsWrp {
    transform: scale(.5)
  }
}

@media screen and (max-width:810px) {
  .shelfsWrp {
    position: relative;
    margin-bottom: 600px;
    margin-top: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    transform: scale(.87)
  }

  #shelf1 {
    margin-bottom: 300px
  }

  .midLine {
    display: none
  }
}

@media screen and (max-width:510px) {
  .shelfsWrp {
    margin-bottom: 200px;
    margin-top: -250px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    transform: scale(.67)
  }

  #shelf1 {
    margin-bottom: 300px
  }

  .midLine {
    display: none
  }
}
</style>
<div class="ldgWrp">
  <section class="ldg-pg">
    <intro-section>
      <intro-section>
  </section>
  <div class="spacer layer1"></div>
  <section id="book-pg" class="book-pg">
    <book-page>
      <div class="shelfsWrp" slot="bookShelfs">
        <div id="shelf1">
          <book-shelf cltn="1" button1=${
            unfinishedBooks[0] ? "Continue" : "Register"
          } button2=${unfinishedBooks[0] ? "Read" : "Book"} book1=${
    unfinishedBooks[unfinishedBooks.length - 1]
      ? unfinishedBooks[unfinishedBooks.length - 1].img
      : "public/svg/SVG/dash-outline.svg"
  }
            book2="public/svg/SVG/blank-book.svg" book3=${
              unfinishedBooks[unfinishedBooks.length - 3]
                ? unfinishedBooks[unfinishedBooks.length - 3].img
                : "public/svg/SVG/dash-outline.svg"
            } book4=${
    unfinishedBooks[unfinishedBooks.length - 2]
      ? unfinishedBooks[unfinishedBooks.length - 2].img
      : "public/svg/SVG/dash-outline.svg"
  } status="public/pngs/continue-pink.png"
            title="Unfinished Book Collection"></book-shelf>
        </div>
        <figure class="mdLine">
          <img class="midLine" src="public/svg/SVG/line.svg" alt="line" />
        </figure>
        <div id="shelf2">
          <book-shelf cltn="2" button1=${
            finishedBooks[0] ? "Refresh" : "Open"
          } button2=${finishedBooks[0] ? "Memories" : "Collection"} book1=${
    finishedBooks[finishedBooks.length - 1]
      ? finishedBooks[finishedBooks.length - 1].img
      : "public/svg/SVG/dash-outline.svg"
  } book2=${
    finishedBooks[finishedBooks.length - 4]
      ? finishedBooks[finishedBooks.length - 4].img
      : "public/svg/SVG/dash-outline.svg"
  } book3=${
    finishedBooks[finishedBooks.length - 3]
      ? finishedBooks[finishedBooks.length - 3].img
      : "public/svg/SVG/dash-outline.svg"
  } book4=${
    finishedBooks[finishedBooks.length - 2]
      ? finishedBooks[finishedBooks.length - 2].img
      : "public/svg/SVG/dash-outline.svg"
  } status="public/pngs/finished-pink.png"
            title="Finished Book Collection"></book-shelf>
        </div>
      </div>
    </book-page>
  </section>
</div>    
  `,

  collectionPage("unfinishedBooks", booksDisplay, true),
  collectionPage("finishedBooks", booksDisplay, true),
  `
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

  .registerBook {
    position: relative;
    overflow-y: hidden;
    overflow-x: hidden;
    top: 0px;
    left: -5px;
    width: 100vw;
    height: 98vh;
    margin: 0;
  }
</style>
<section class="registerBook">
  <register-page></register-page>
</section>
`,
  `<section class="notes-page">
  <book-note></book-note>
</section>
  `,
  collectionPage("favoriteBooks", booksDisplay, false),
  collectionPage("allBooks", booksDisplay, true),
  collectionPage("searchBooks", booksDisplay, false),
];

const template = document.createElement("template");

template.innerHTML = pages[currentPage];

class DisplayController extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.genreScrolldownState = false;
    this.sortScrolldownState = false;
  }

  jumpToUfCltn() {
    window.scrollTo(0, 0);
    try {
      if (currentPage != 1) {
        sessionStorage.setItem("currentPage", 1);

        window.location.reload();
      } else {
        throw new Error(" ufCltn PAGE UPDATE FAILED");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  jumpToFCltn() {
    window.scrollTo(0, 0);
    try {
      if (currentPage != 2) {
        sessionStorage.setItem("currentPage", 2);

        window.location.reload();
      } else {
        throw new Error(" fCltn PAGE UPDATE FAILED");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  jumpToHome() {
    window.scrollTo(0, 0);
    sessionStorage.removeItem("matchedBooks");
    sessionStorage.removeItem("currentSort");
    sessionStorage.removeItem("currentGenre");
    try {
      if (currentPage != 0) {
        sessionStorage.setItem("currentPage", 0);

        window.location.reload();
      } else {
        throw new Error("home PAGE UPDATE FAILED");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  jumpToRegBook() {
    sessionStorage.removeItem("matchedBooks");
    sessionStorage.removeItem("currentSort");
    sessionStorage.removeItem("currentGenre");
    try {
      if (currentPage != 3) {
        sessionStorage.setItem("currentPage", 3);

        window.location.reload();
      } else {
        throw new Error("register PAGE UPDATE FAILED");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  jumpToFavPage() {
    sessionStorage.removeItem("matchedBooks");
    sessionStorage.removeItem("currentSort");
    sessionStorage.removeItem("currentGenre");
    window.scrollTo(0, 0);
    try {
      if (currentPage != 5) {
        sessionStorage.setItem("currentPage", 5);
        window.location.reload();
      }
    } catch (error) {
      throw new Error("Favorite PAGE UPDATE FAILED");
    }
  }

  jumpToAllPage() {
    sessionStorage.removeItem("matchedBooks");
    sessionStorage.removeItem("currentSort");
    sessionStorage.removeItem("currentGenre");
    window.scrollTo(0, 0);
    try {
      if (currentPage != 6) {
        sessionStorage.setItem("currentPage", 6);
        window.location.reload();
      }
    } catch (error) {
      throw new Error("all PAGE UPDATE FAILED");
    }
  }

  showGenreScrolldown() {
    const genreScrolldown = this.shadowRoot.getElementById("genreScrolldown");
    const sortScrolldown = this.shadowRoot.getElementById("sortScrolldown");
    const backdrop = this.shadowRoot.getElementById("backdrop");
    genreScrolldown.scrollTo(0, 0);

    if (!this.genreScrolldownState) {
      genreScrolldown.style.display = "flex";
      sortScrolldown.style.display = "none";
      backdrop.style.display = "flex";
      this.genreScrolldownState = true;
      this.sortScrolldownState = false;
      console.log("genreScrolldown showed");
    } else if (this.genreScrolldownState) {
      genreScrolldown.style.display = "none";
      sortScrolldown.style.display = "none";
      backdrop.style.display = "none";
      this.genreScrolldownState = false;
      this.sortScrolldownState = false;
      console.log("genreScrolldown showed");
    } else {
    }
  }

  showSortScrolldown() {
    const genreScrolldown = this.shadowRoot.getElementById("genreScrolldown");
    const sortScrolldown = this.shadowRoot.getElementById("sortScrolldown");
    const backdrop = this.shadowRoot.getElementById("backdrop");
    if (!this.sortScrolldownState) {
      sortScrolldown.style.display = "flex";
      genreScrolldown.style.display = "none";
      backdrop.style.display = "flex";
      this.sortScrolldownState = true;
      this.genreScrolldownState = false;
      console.log("sortScrolldown showed");
    } else if (!this.sortScrolldownState) {
      genreScrolldown.style.display = "none";
      sortScrolldown.style.display = "none";
      backdrop.style.display = "none";
      this.sortScrolldownState = false;
      this.genreScrolldownState = false;
      console.log("sortScrolldown showed");
    } else {
    }
  }

  closeAllScrollMenu() {
    const genreScrolldown = this.shadowRoot.getElementById("genreScrolldown");
    const sortScrolldown = this.shadowRoot.getElementById("sortScrolldown");
    const backdrop = this.shadowRoot.getElementById("backdrop");
    genreScrolldown.scrollTo(0, 0);
    genreScrolldown.style.display = "none";
    sortScrolldown.style.display = "none";
    backdrop.style.display = "none";

    this.sortScrolldownState = false;
    this.genreScrolldownState = false;
  }

  searchBook() {
    sessionStorage.removeItem("currentSort");
    sessionStorage.removeItem("currentGenre");
    window.scrollTo(0, 0);
    const srchInpVal = document.getElementById("srchInp").value;
    let results = [];

    try {
      if (srchInpVal) {
       const keywords = srchInpVal.split(" ");
        for (let book of collections) {
          let bookTags = book.tag;
          let arrayScores = [];
          for (let n = 0; n < bookTags.length; n++) {
            let tag = bookTags[n];
            let scores = () => {
              return 5 - n;
            };

            for (let keyword of keywords) {
              let isInclude = tag.includes(keyword);
              if (isInclude) {
                let matchScore = scores();
                arrayScores.push(matchScore);
              } else {
                arrayScores.push(0);
              }
            }
          }
          let totalScores = arrayScores.reduce((cumulated, score) => {
            let total = cumulated + score;
            return total;
          }, 0);
          if (totalScores > 0) {
            let scoredBook = Object.assign(
              { ...book, mScore: totalScores },
              book
            );
            results.push(scoredBook);
          } else {
          }
        }
      } else {
        throw new Error("INVALID INPUT");
      }
      sessionStorage.setItem(
        "matchedBooks",
        JSON.stringify({ books: results })
      );
      console.log("data matching resolved");
      sessionStorage.setItem("currentPage", 7);
      sessionStorage.setItem("keywords", srchInpVal);

      window.location.reload();
    } catch (error) {
      console.log(error.stack);
    }
  }

  enterInpMode() {
    if (window.innerWidth <= 810) {
      const initial = () => {
        return new Promise((resolve, reject) => {
          resolve("flip");
        });
      };

      const flipNavbar = (cmd) => {
        if (cmd === "flip") {
          const navMid = document.getElementById("navMid");
          const navRight = document.getElementById("navRight");
          const navLeft = document.getElementById("navLeft");

          navLeft.style.display = "none";
          navRight.style.display = "none";
          navMid.style.display = "flex";
          console.log("Navbar flipped successfully");
          return "srchInp";
        } else {
          throw new Error("NAVBAR CONTENT UNACCESSIBLE");
        }
      };

      const focus = (elem) => {
        if (elem) {
          const inp = document.getElementById(elem);
          inp.focus();
        } else {
          throw new Error("INPUT ELEMENT UNACCESSIBLE");
        }
      };

      initial()
        .then(flipNavbar)
        .then(focus)
        .catch((error) => console.log(error.message));
    }
  }

  closeInpMode() {
    if (window.innerWidth <= 810) {
      const navMid = document.getElementById("navMid");
      const navRight = document.getElementById("navRight");
      const navLeft = document.getElementById("navLeft");

      navLeft.style.display = "flex";
      navRight.style.display = "flex";
      navMid.style.display = "none";
    }
  }

  showMenu() {
    const sideMenu = document.getElementById("sideMenu");
    const dotMenu = document.getElementById("dotMenu");
    const closeMenu = document.getElementById("closeMenu");
    const backdrop = document.getElementById("backdrop");

    backdrop.style.display = "block";
    backdrop.addEventListener("click", () => this.closeMenu());

    dotMenu.classList.add("ctrlOff");
    setTimeout(() => {
      dotMenu.style.display = "none";
      closeMenu.style.display = "block";
      closeMenu.classList.remove("ctrlOff");
    }, 150);
    sideMenu.classList.remove("SMOff");
  }

  closeMenu() {
   const sideMenu = document.getElementById("sideMenu");
   const dotMenu = document.getElementById("dotMenu");
   const closeMenu = document.getElementById("closeMenu");
   const backdrop = document.getElementById("backdrop");

    backdrop.style.display = "none";
    closeMenu.classList.add("ctrlOff");
    setTimeout(() => {
      dotMenu.style.display = "block";
      closeMenu.style.display = "none";
      dotMenu.classList.remove("ctrlOff");
    }, 150);
    sideMenu.classList.add("SMOff");
  }

  mobileMode() {
    if (window.innerWidth <= 810) {
      const navWrp = document.getElementById("navWrp");
     const initial = () => {
        return new Promise((resolve, reject) => {
          resolve("inject");
        });
      };

     const injectHtml = (cmd) => {
        if (cmd === "inject") {
          navWrp.innerHTML = `
        <section id="navLeft" class="nav-left" >
          <div id="menuCtrl" class="menuCtrl" >
            <button type="button" class="ctrlIcons" >
              <img id="dotMenu" class="ctrlIcon" src="public/svg/SVG/menu-white.svg" alt="dot" title="menu" />
              <img id="closeMenu" class="ctrlIcon ctrlOff" src="public/svg/SVG/back-white.svg" alt="back" title="close" />
            </button>
          </div>
          <aside id="sideMenu" class="sideMenu SMOff">
            <div class="sideMenuWrp">
              <ul class="sideMenuList">
                <li id="SMAllBooks" class="sideMenuItems">
                  <img class="mIcons" src="public/pngs/list-pink.png" />
                  <h3 class="sideMenuItem">All Books</h3>
                </li>
                <li id="SMFavBooks" class="sideMenuItems">
                  <img class="mIcons" src="public/pngs/bookmark-gold.png" />
                  <h3 class="sideMenuItem">Favorite Books</h3>
                </li>
              </ul>
              <div class="sideMenuFooter">
                <section class="SMcpyrg">
                  <div class="SMcpyrgWrp">
                    <div class="SMbrandF">
                      <p class="SMbrandFF1">Red</p>
                      <p class="SMbrandFF2">Bit</p>
                    </div>
                    <div class="SMcpyrgTxt">Copyrights 2022 &copy; Maulana Zaki</div>
                    <ul class="SMfIconList">
                      <li class="SMfIconItem">
                        <img
                          class="SMfIcon"
                          src="public/pngs/facebook-white.png"
                          alt="SMFacebook"
                          title="Facebook"
                        />
                      </li>
                      <li class="SMfIconItem">
                        <img
                          class="SMfIcon"
                          src="public/pngs/gmail-white.png"
                          alt="SMEmail"
                          title="Email"
                        />
                      </li>
                      <li class="SMfIconItem">
                        <img
                          class="SMfIcon"
                          src="public/pngs/instagram-white.png"
                          alt="SMInstagram"
                          title="Instagram"
                        />
                      </li>
                      <li class="SMfIconItem">
                        <img
                          class="SMfIcon"
                          src="public/pngs/twitter-white.png"
                          alt="Twitter"
                          title="Twitter"
                        />
                      </li>
                    </ul>
                  </div>
                </section>
              </div>
            </div>
          </aside>
          <div id="backdrop" class="backdrop" ></div>
          <div class="brand">
              <p class="brandF1">Red</p>
              <p class="brandF2">Bit</p>
          </div>
        </section>
        <section id="navRight" class="nav-right" >
        <button id="srchBtn" type="submit" class="srchBtn">
          <img
            class="mobSrcIcon"
            src="public/svg/SVG/search-white.svg"
            alt="search"
          />
        </button>
        </section>
        <section id="navMid" class="nav-mid">
        <button id="inpBackBtn" class="inpBackBtn" >
          <img id="inpBackIcon" class="ctrlIcon" src="public/svg/SVG/back-white.svg" alt="back" title="back" />
        </button>
        <form class="srchForm">
          <input
            id="srchInp"
            class="srchInp"
            type="text"
            placeholder="Search book"
          />
          <button id="inpSrchBtn" type="submit" class="srchBtn">
            <img
              class="srcIcon"
              src="public/pngs/search-black.png"
              alt="search"
            />
          </button>
        </form>
      </section>
        
      `;
          const buttons = [
            "dotMenu",
            "closeMenu",
            "srchBtn",
            "inpBackBtn",
            "inpSrchBtn",
            "SMAllBooks",
            "SMFavBooks",
          ];
          return buttons;
        } else {
          throw new Error("MOBILE NAVBAR INJECT ELEMENT FAILED");
        }
      };

      const listen = (buttons) => {
        if (buttons) {
          const [
            dotMenu,
            closeMenu,
            srchBtn,
            inpBackBtn,
            inpSrchBtn,
            SMAllBooks,
            SMFavBooks,
          ] = buttons;
          const menu = document.getElementById(dotMenu);
          const close = document.getElementById(closeMenu);
          const opsrch = document.getElementById(srchBtn);
          const allBooks = document.getElementById(SMAllBooks);
          const favBooks = document.getElementById(SMFavBooks);
          const backBtn = document.getElementById(inpBackBtn);
          const srch = document.getElementById(inpSrchBtn);

          allBooks.addEventListener("click", () => this.jumpToAllPage());
          favBooks.addEventListener("click", () => this.jumpToFavPage());

          backBtn.addEventListener("click", () => this.closeInpMode());
          srch.addEventListener("click", () => this.searchBook());
          console.log("INPUT mode buttons start listen...");

          menu.addEventListener("click", () => this.showMenu());
          close.addEventListener("click", () => this.closeMenu());
          opsrch.addEventListener("click", () => this.enterInpMode());
          console.log("NORMAL mode buttons start listen");
        } else if (buttons && this.inputMode) {
        } else {
          throw new Error("MODE UNDEFINED OR BUTTON UNAVAILABLE");
        }
      };

      initial()
        .then(injectHtml)
        .then(listen)
        .catch((error) => console.log(error.message));
    } else {
    }
  }

  connectedCallback() {
    this.mobileMode();
    window.addEventListener("resize", () => window.location.reload());
    console.log(collections.some((book) => book.isFavorite == true));
    const favPage = document.getElementById("favPage");
    const allPage = document.getElementById("allPage");
    const srchBtn = document.getElementById("srchBtn");

    favPage.addEventListener("click", () => this.jumpToFavPage());
    allPage.addEventListener("click", () => this.jumpToAllPage());
    srchBtn.addEventListener("click", () => this.searchBook());

    if (currentPage == 0) {
      const navBar = document.querySelector("header");
      const footer = document.querySelector("footer");
      const spacer = document.getElementsByClassName("spacer")[0];

      navBar.style.display = "flex";
      footer.style.display = "flex";
      spacer.style.display = "block";
    } else if (currentPage == 1 || (currentPage == 2 && finishedBooks[0])) {
      const backBtn = this.shadowRoot.getElementById("backBtn");
      const navBar = document.getElementById("header");
      const footer = document.getElementById("footer");
      const genreVal = this.shadowRoot.getElementById("genreVal");
      const sortVal = this.shadowRoot.getElementById("sortVal");
      const byName = this.shadowRoot.getElementById("byName");
      const byYear = this.shadowRoot.getElementById("byYear");
      const backdrop = this.shadowRoot.getElementById("backdrop");
      const spacer = document.getElementsByClassName("spacer")[0];
      const noBooksGuide = this.shadowRoot.getElementById("noBooksGuide");

      navBar.style.display = "flex";
      footer.style.display = "flex";
      spacer.style.display = "block";

      try {
        if (backBtn) {
          console.log("noBooksGuide listen...");
          backBtn.addEventListener("click", () => this.jumpToHome());
          genreVal.addEventListener("click", () => this.showGenreScrolldown());
          sortVal.addEventListener("click", () => this.showSortScrolldown());
          backdrop.addEventListener("click", () => this.closeAllScrollMenu());
          byName.addEventListener("click", () => {
            sessionStorage.setItem("currentSort", "Name");
            window.location.reload();
          });
          noBooksGuide.addEventListener("click", () => this.jumpToRegBook());
          byYear.addEventListener("click", () => {
            sessionStorage.setItem("currentSort", "Year");
            window.location.reload();
          });
          console.log("backBtn are listening");
        } else {
          throw new Error("backBtn are unaccessible");
        }
      } catch (error) {
        console.log(error.message);
      }
    } else if (currentPage == 3) {
      const navBar = document.querySelector("header");
      const footer = document.querySelector("footer");
      const spacer = document.getElementsByClassName("spacer")[0];

      try {
        if (navBar && footer) {
          navBar.style.display = "none";
          footer.style.display = "none";
          spacer.style.display = "none";
        } else {
          throw new Error("unable to reach footer, navbar, regBackBtn");
        }
      } catch (error) {
        console.log(error.message);
      }
    } else if (currentPage == 2 && !finishedBooks[0]) {
      const noBooksGuide = this.shadowRoot.getElementById("noBooksGuide");
      const backBtn = this.shadowRoot.getElementById("backBtn");
      const navBar = document.querySelector("header");
      const footer = document.querySelector("footer");
      const spacer = document.getElementsByClassName("spacer")[0];

      backBtn.addEventListener("click", () => this.jumpToHome());

      navBar.style.display = "flex";
      footer.style.display = "flex";
      spacer.style.display = "block";

      try {
        if (noBooksGuide && !unfinishedBooks[0]) {
          noBooksGuide.addEventListener("click", () => this.jumpToHome());
          console.log("noBooksGuide and backBtn start listening");
        } else if (noBooksGuide && unfinishedBooks[0]) {
          noBooksGuide.addEventListener("click", () => this.jumpToUfCltn());
          console.log("noBooksGuide start listening");
        } else {
          throw new Error("noBooksGuide are unaccessible");
        }
      } catch (error) {
        console.log(error.message);
      }
    } else if (currentPage == 4) {
      const navBar = document.querySelector("header");
      const footer = document.querySelector("footer");
      const body = document.querySelector("body");
      const spacer = document.getElementsByClassName("spacer")[0];

      body.style.backgroundColor = "#c7c7c7";
      spacer.style, (display = "none");
      navBar.style.display = "none";
      footer.style.display = "none";
    } else if (currentPage == 5) {
      const navBar = document.querySelector("header");
      const footer = document.querySelector("footer");
      const favPage = document.getElementById("favPage");
      const backBtn = this.shadowRoot.getElementById("backBtn");
      const spacer = document.getElementsByClassName("spacer")[0];

      console.log(collections);

      try {
        if (navBar && footer && favPage && backBtn) {
          backBtn.addEventListener("click", () => this.jumpToHome());
          spacer.style.display = "block";
          navBar.style.display = "flex";
          footer.style.display = "flex";
          favPage.style.backgroundColor = "#0e1529";
          favPage.removeEventListener("click", () => this.jumpToFavPage());
        }
      } catch (error) {
        console.log(error.stack);
      }
    } else if (currentPage == 6) {
      const navBar = document.querySelector("header");
      const footer = document.querySelector("footer");
      const backBtn = this.shadowRoot.getElementById("backBtn");
      const noBooksGuide = this.shadowRoot.getElementById("noBooksGuide");
      const genreVal = this.shadowRoot.getElementById("genreVal");
      const sortVal = this.shadowRoot.getElementById("sortVal");
      const byName = this.shadowRoot.getElementById("byName");
      const byYear = this.shadowRoot.getElementById("byYear");
      const backdrop = this.shadowRoot.getElementById("backdrop");
      const allPage = document.getElementById("allPage");
      const spacer = document.getElementsByClassName("spacer")[0];

      backBtn.addEventListener("click", () => this.jumpToHome());
      spacer.style.display = "block";
      navBar.style.display = "flex";
      footer.style.display = "flex";
      allPage.style.backgroundColor = "#0e1529";
      allPage.removeEventListener("click", () => this.jumpToAllPage());

      genreVal.addEventListener("click", () => this.showGenreScrolldown());
      sortVal.addEventListener("click", () => this.showSortScrolldown());
      backdrop.addEventListener("click", () => this.closeAllScrollMenu());

      byName.addEventListener("click", () => {
        sessionStorage.setItem("currentSort", "Name");
        window.location.reload();
      });
      byYear.addEventListener("click", () => {
        sessionStorage.setItem("currentSort", "Year");
        window.location.reload();
      });

      console.log(filteredBooks);
      console.log(currentGenre);
      console.log(currentSort);

      if (!collections[0]) {
        noBooksGuide.addEventListener("click", () => this.jumpToRegBook());
      } else if (collections[0] && !sessionStorage.getItem("currentGenre")) {
        sessionStorage.setItem("currentGenre", "All");
      } else if (currentSort != "-") {
        console.log("sortedBooks");
        console.log(sortedBooks());
        console.log("appliedBooks");
        console.log(appliedBooks);
      }
    } else if (currentPage == 7) {
      const srchInp = document.getElementById("srchInp");
      const backBtn = this.shadowRoot.getElementById("backBtn");
      const header = document.querySelector("header");
      const footer = document.querySelector("footer");
      const spacer = document.getElementsByClassName("spacer")[0];

      spacer.style.display = "block";
      header.style.display = "flex";
      footer.style.display = "flex";

      srchInp.value = sessionStorage.getItem("keywords");

      backBtn.addEventListener("click", () => this.jumpToHome());
    }
  }
}

window.customElements.define("display-controller", DisplayController);
