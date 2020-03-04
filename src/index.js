const appEl = document.getElementById("app");
const searchEl = document.getElementById("search");

// Have fun :)
const app = async () => {
  const data = await getData();
  data.forEach(article => renderArticle(article));
};

const getData = async query => {
  try {
    appEl.innerHTML = "Loading...";
    const request = query
      ? await fetch(`https://apodapi.herokuapp.com/search/?number=5&search_query=${query}
    `)
      : await fetch("https://apodapi.herokuapp.com/api/?count=5");
    const data = await request.json();
    appEl.innerHTML = "";
    if (data.error) {
      appEl.innerHTML = data.error;
      return;
    }
    return data;
  } catch (e) {
    console.log(e);
  }
};

const renderArticle = item => {
  const articleEl = document.createElement("article");
  const headerEl = document.createElement("h1");
  const descriptionEl = createDescription(item.description, 300);
  const mediaEl = createMedia(item);

  headerEl.innerText = item.title;
  if (mediaEl) {
    articleEl.appendChild(mediaEl);
  }
  articleEl.appendChild(headerEl);
  articleEl.appendChild(descriptionEl);
  appEl.appendChild(articleEl);
};

const createMedia = item => {
  if (item.media_type === "image") {
    const imgEl = document.createElement("img");
    imgEl.src = item.url;
    lightbox(imgEl);
    return imgEl;
  } else if (item.media_type === "video") {
    const videoEl = document.createElement("iframe");
    videoEl.src = item.url;
    return videoEl;
  }
};
const createDescription = (description, limit) => {
  const descriptionEl = document.createElement("span");
  const smallText =
    description.length > limit
      ? `${description.slice(0, limit)}...`
      : description;
  const morelessEl = document.createElement("span");
  morelessEl.className = "more";
  adjustDescription(smallText, "More", descriptionEl, morelessEl);
  descriptionEl.appendChild(morelessEl);
  let isSmall = true;

  morelessEl.addEventListener("click", () => {
    console.log("more");
    if (isSmall) {
      adjustDescription(description, " (Less)", descriptionEl, morelessEl);
    } else {
      adjustDescription(smallText, " More", descriptionEl, morelessEl);
    }
    isSmall = !isSmall;
  });

  return descriptionEl;
};
const adjustDescription = (
  description,
  buttonText,
  descriptionEl,
  buttonEl
) => {
  descriptionEl.innerHTML = description;
  buttonEl.innerText = buttonText;
  descriptionEl.appendChild(buttonEl);
};
const search = async e => {
  e.preventDefault();
  const query = e.target.elements.query.value;
  const data = await getData(query);
  console.log(data);
  if (data) {
    data.forEach(article => renderArticle(article));
  }
  e.target.reset();
};
const lightbox = imgEl => {
  imgEl.addEventListener("click", () => {
    const imgBig = document.createElement("img");
    imgBig.src = imgEl.src;
    imgBig.className = "lightbox";
    appEl.appendChild(imgBig);
    imgBig.addEventListener("click", e => {
      appEl.removeChild(e.target);
    });
  });
};
searchEl.addEventListener("submit", search);
app();
