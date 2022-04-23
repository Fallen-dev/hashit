import {
  toString,
  toObject,
  getElement,
  getAllElement,
  save_to_storage,
  get_from_storage,
} from './utils.js'

// will use it in future
import {
  getLinkPreview
} from 'link-preview-js'

// DOM stuff
const theme_btn = getElement('button#btn-theme')
theme_btn.onclick = () => getElement('html').classList.toggle('dark')

const home = getElement('#home')
const Nlist = getElement('#list')

const input = getElement('textarea')
const submit = getElement('input[type=submit]')

const hash_card = getElement('#hash')
const hash_tag = getElement('#hash-tag')
const hash_tip = getElement('#hash-tip')

const search_card = getElement('#search-card')
const search_input = getElement('#search-list')

const error_card = getElement('#error')
const error_title = getElement('#error-title')
const error_content = getElement('#error-content')
const error_tip = getElement('#error-tip')

const nav_home = getElement('#nav-home')
const nav_list = getElement('#nav-list')

const validateURL = (url) => {
  const res = url.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  )

  return res !== null
}

let list = []
let page = 'hash'

const createData = (generated_hash, content, type) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  const userLocale =
    navigator.languages != undefined ? navigator.language : 'en-US'

  list.push({
    hash: generated_hash,
    content: content,
    type: type,
    date: new Date().toLocaleDateString(userLocale, options),
    time: `${new Date().getHours()}:${new Date().getMinutes()}`,
  })
  return list
}

const handleInput = (generated_hash, content) => {
  if (validateURL(input.value)) {
    save_to_storage(
      'list',
      toString(createData(generated_hash, content, 'link'))
    )
  } else {
    save_to_storage(
      'list',
      toString(createData(generated_hash, content, 'text'))
    )
  }
}

const hash = () => (Math.random() + 1).toString(36).substring(7).toUpperCase()

// Start main here
const disable_on_keyup = () => (submit.disabled = true)

const show_err = (type, content, tip) => {
  error_card.classList.remove('hidden')
  error_card.classList.add('visible')

  error_title.textContent = type
  error_content.textContent = content
  error_tip.textContent = tip
}

let generate_hash = ''

submit.disabled = true
search_input.disabled = true

// This function is used to keep the data stored in LS even after a page reload.
// As after a page reload, the list[] becomes empty and the LS item "list" will
// be overwritten by the createData()
window.onload = () => {
  const stored_list = get_from_storage('list') || false
  if (!stored_list) return
  toObject(stored_list).forEach((data) => list.push(data))

  input.value = ''

  error_card.classList.add('hidden')
  error_card.classList.remove('visible')
}

input.onfocus = () => {
  error_card.classList.add('hidden')
  error_card.classList.remove('visible')
}

input.onkeyup = (e) => {
  input.value.length > input.offsetHeight ?
    input.classList.add('h-80') :
    input.classList.remove('h-80')

  e.target.value == '' ? (submit.disabled = true) : (submit.disabled = false)

  for (let i = 0; i <= 100; i++) clearInterval(i)
}

submit.onclick = () => {
  generate_hash = hash()

  handleInput(generate_hash, input.value)

  input.value = ''

  hash_card.classList.remove('hidden')
  hash_card.classList.add('visible')
  hash_tag.textContent = '#' + generate_hash
  hash_tip.textContent = 'Click the hashtag to copy to clipboard'

  hash_tag.onclick = () => {
    if (!navigator.clipboard)
      return show_err(
        'Clipboard error',
        'Your browser does not support clipboard functionality',
        'Update the browser'
      )
    const el = document.createElement('input')
    el.textContent = '#' + generate_hash

    el.select()
    el.setSelectionRange(0, 99999)

    navigator.clipboard.writeText(el.textContent)

    hash_tip.textContent = 'Copied to clipboard'

    setTimeout(
      () => (hash_tip.textContent = 'Click the hashtag to copy to clipboard'),
      7000
    )
  }

  setInterval(disable_on_keyup, 100)
}

// TODO Search functionality
const nav_active = ['bg-teal-800', 'text-teal-200' , "dark:bg-teal-400", "dark:text-teal-800"]

nav_home.onclick = () => {
  home.classList.remove('hidden')
  Nlist.classList.add('hidden')

  nav_home.classList.add(...nav_active)
  nav_list.classList.remove(...nav_active)

  search_card.innerHTML = ``
}

nav_list.onclick = () => {
  home.classList.add('hidden')
  Nlist.classList.remove('hidden')

  nav_list.classList.add(...nav_active)
  nav_home.classList.remove(...nav_active)

  fetchLocalStorage()
}

function fetchLocalStorage() {
  const stored_list = toObject(get_from_storage('list')) || false

  if (!stored_list)
    return (search_card.innerHTML = `
    <div class="vis w-full space-y-4 p-6 rounded-3xl bg-teal-600 text-white">
      <p class="w-max rounded-full px-4 py-1 bg-teal-200 text-teal-800">Nothing here</p>
      <h1 id="error-content" class="cursor-pointer rounded-xl text-base">
        You haven't created any hashtags yet
      </h1>
      <p id="error-tip" class="text-center text-xs text-teal-200">
        Create a hashtag <a href="inex.html" class="font-bold">now!</a>
      </p>
    </div>
    `)

  const stored_list_reverse = stored_list.reverse()

  stored_list_reverse.forEach((list) => {
    search_card.innerHTML += `
    <div class="w-full space-y-4 p-6 rounded-3xl overflow-hidden bg-teal-200 dark:bg-teal-800 dark:text-teal-200">
      <div class="flex w-full items-end justify-between">
        <h1 class="text-2xl font-code text-teal-800 dark:text-teal-200 leading-none">#${list.hash}</h1>
        <div class="text-xs text-teal-600 dark:text-teal-400">
          <p>On ${list.date}</p>
          <p class="text-right dark:text-teal-400">At ${list.time}</p>
        </div>
      </div>
      <div class="mt-2 flex w-full items-end space-x-3 text-xs text-teal-800 dark:text-teal-600">
        <div class="rounded-lg border border-teal-600 dark:border-teal-400 px-3 py-0.5">
          <p class="capitalize dark:text-teal-400">${list.type}</p>
        </div>
      </div>
      <p class="hash_content font-code truncate text-teal-800 dark:text-teal-200">${list.content}</p>
    </div>
    `
    getAllElement('.hash_content').forEach((el) => {
      el.onclick = (inner_el) => {
        inner_el.target.classList.toggle('truncate')
        inner_el.target.classList.toggle('break-words')
      }
    })
  })
}
