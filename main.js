// import "./style.css";
import { log, log_err, toString, toObject, getElement, save_to_storage, get_from_storage } from "./utils.js"

// DOM stuff
const home = getElement('#home')
const Nlist = getElement('#list')

const input = getElement("textarea");
const submit = getElement("input[type=submit]");

const hash_card = getElement('#hash')
const hash_tag = getElement('#hash-tag')
const hash_tip = getElement('#hash-tip')

const search_card = getElement('#search-card')
const search_input = getElement('#search-text')

const error_card = getElement('#error')
const error_title = getElement('#error-title')
const error_content = getElement('#error-content')
const error_tip = getElement('#error-tip')

const nav_home = getElement('p#nav-home')
const nav_list = getElement('p#nav-list')

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
search_input.disabled = true

const home_height = home.offsetHeight
const window_height = window.innerHeight

if (home_height < window_height) home.classList.toggle('h-screen')

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
const nav_active = ['bg-teal-800', 'text-teal-200']

nav_list.onclick = () => {
  home.classList.add('hidden')
  Nlist.classList.remove('hidden')

  nav_list.classList.add(...nav_active)
  nav_home.classList.remove(...nav_active)

  fetchLocalStorage()
}

nav_home.onclick = () => {
  home.classList.remove('hidden')
  Nlist.classList.add('hidden')

  nav_home.classList.add(...nav_active)
  nav_list.classList.remove(...nav_active)

  search_card.innerHTML = ``
}

function fetchLocalStorage() {
  const a =  toObject(get_from_storage('list')) || false

  if (!a)
    return search_card.innerHTML =
    `
    <!-- No card text -->
    <div class="vis w-full space-y-4 p-6 rounded-xl bg-teal-600 text-white">
      <p class="w-max rounded-full px-4 py-1 bg-teal-200 text-teal-800">Nothing here</p>
      <h1 id="error-content" class="cursor-pointer rounded-xl text-base">
        You haven't created any hashtags yet
      </h1>
      <!-- helper text -->
      <p id="error-tip" class="text-center text-xs text-teal-200">
        Create a hashtag <a href="inex.html" class="text-teal-900">now!</a>
      </p>
    </div>
    `

  return a.forEach(list => {
    search_card.innerHTML +=
    `
    <div class="w-full space-y-4 p-6 rounded-xl overflow-hidden bg-teal-200">
      <div class="flex w-full items-end justify-between">
        <h1 id="hash_title" class="text-xl text-teal-800 leading-none">#${list.hash}</h1>
        <div class="text-xs text-teal-600">
          <p id="hash_date">${list.date}</p>
          <p id="hash_time" class="text-right">${list.time}</p>
        </div>
      </div>
      <p id="hash_content" class="truncate text-teal-600">${list.content}</p>
    </div>
    `
  })
}