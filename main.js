// import "./style.css";
import { log, log_err, toString, toObject, getElement, save_to_storage, get_from_storage } from "./utils.js"

// DOM stuff
const input = getElement("textarea");
const submit = getElement("input[type=submit]");
const text = getElement("div#text");
const previewLink = getElement("p#previewlink"); //will be used later
const errortext = getElement("h3#error");
const hashStr = getElement("h1#hash");
const search = getElement('p#search')
const floatingWindow = getElement('div#floating')

const validateURL = (url) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i", // fragment locator
  );
  return !!pattern.test(url);
};

const createData = (generated_hash, content, type) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const userLocale = navigator.languages != undefined
    ? navigator.language
    : "en-US";

  list.push({
    "id": localStorage.length + 1,
    "hash": generated_hash,
    "content": content,
    "type": type,
    "date": new Date().toLocaleDateString(userLocale, options),
    "time": `${new Date().getHours()} : ${new Date().getMinutes()}`,
  });
  return list
};

const handleInput = (generated_hash, content) => {
  if (validateURL(input.value)) {
    save_to_storage(
      "list",
      toString(createData(generated_hash, content, "link")),
    );
    text.innerHTML =
      `<a href="${input.value}" target="_blank">${input.value}</a>`;
  } else {
    save_to_storage(
      "list",
      toString(createData(generated_hash, content, "text")),
    );
    text.innerHTML = `<h3>${input.value}</h3>`;
  }
};

const hash = () => (Math.random() + 1).toString(36).substring(7).toUpperCase();

// Start main here
const disable_on_keyup = () => submit.disabled = true;
const show_err = (error) => errortext.textContent = error;

const placeholder = "Start pasting and tagging";

let generate_hash = "";

let list = []

input.value = placeholder;
submit.disabled = true;

input.onfocus = () => {
  if (input.value == placeholder) return input.value = "";
  if (input.value != placeholder && input.value != "") return;
  show_err("");
};

input.onblur = (e) => e.target.value == "" ? input.value = placeholder : null;

input.onkeyup = (e) => {
  e.target.value == "" ? submit.disabled = true : submit.disabled = false;

  for (let i = 0; i <= 100; i++) clearInterval(i);
};

submit.onclick = () => {
  generate_hash = hash();

  handleInput(generate_hash, input.value);

  input.value = placeholder;

  hashStr.textContent = "#" + generate_hash;

  setInterval(disable_on_keyup, 100);
};

// Search functionality
// add later
search.onclick = e => {
  floatingWindow.classList.add('search-window')
  floatingWindow.innerHTML = 
    `
    <div>
      <p id="close-search-widow">&times;</p>
    </div>
    `

  getElement('p#close-search-widow').onclick = () => floatingWindow.classList.remove('search-window')
}

