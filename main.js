// import "./style.css";
import { log, log_err, toString, toObject, getElement, save_to_storage, get_from_storage } from "./utils.js"

// DOM stuff
const main = getElement('#main')

const input = getElement("textarea");
const submit = getElement("input[type=submit]");

const hash_card = getElement('#hash')
const hash_tag = getElement('#hash-tag')
const hash_tip = getElement('#hash-tip')

const error_card = getElement('#error')
const error_title = getElement('#error-title')
const error_content = getElement('#error-content')
const error_tip = getElement('#error-tip')

const errortext = getElement("h3#error");
const hashStr = getElement("h1#hash");
const search = getElement('p#search')

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
  } else {
    save_to_storage(
      "list",
      toString(createData(generated_hash, content, "text")),
    );
  }
};

const hash = () => (Math.random() + 1).toString(36).substring(7).toUpperCase();

// Start main here
const disable_on_keyup = () => submit.disabled = true;

const show_err = (type, content, tip) => {
  error_title.textContent = type
  error_content.textContent = content;
  error_tip.textContent = tip;
}


const placeholder = "Start pasting and tagging";

let generate_hash = "";

let list = []

input.value = placeholder;
submit.disabled = true;

const main_height = main.offsetHeight
const window_height = window.innerHeight

if (main_height < window_height) main.classList.toggle('h-screen')

input.onfocus = () => {
  if (input.value == placeholder) return input.value = "";
  if (input.value != placeholder && input.value != "") return;

  hash_tip.textContent = 'Click the hashtag to copy to clipboard'
  show_err("", '', '');
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

  hash_card.classList.remove('hidden')
  hash_card.classList.add('visible')
  hash_tag.textContent = "#" + generate_hash;
  
  hash_tip.textContent = 'Click the hashtag to copy to clipboard'

  hash_tag.onclick = () => {
    if (!navigator.clipboard)
      return show_err(
        'Clipboard error',
        'Your browser does not support clipboard functionality',
        'Update the browser'
      )
    const el = document.createElement('input')
    el.textContent = "#" + generate_hash

    el.select();
    el.setSelectionRange(0, 99999)

    navigator.clipboard.writeText(el.textContent)

    hash_tip.textContent = 'Copied to clipboard'
  }

  setInterval(disable_on_keyup, 100);
};

// TODO Search functionality
