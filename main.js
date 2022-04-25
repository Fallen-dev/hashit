import {
  toString,
  toObject,
  getElement,
  getAllElement,
  save_to_storage,
  get_from_storage,
  log,
  isEmpty,
} from './utils.js'

// will use it in future
import {
  getLinkPreview
} from 'link-preview-js'
import {
  sepia
} from 'tailwindcss/defaultTheme'

// DOM stuff
const theme_btn = getElement('#btn-theme')
const theme_toggle_menu = getElement('#theme-toggle-menu')
const theme_btn_dark = getElement('#theme-btn-dark')
const theme_btn_light = getElement('#theme-btn-light')
const theme_btn_system = getElement('#theme-btn-system')

const home = getElement('#home')
const Nlist = getElement('#list')

const input = getElement('textarea')
const submit = getElement('input[type=submit]')

const hash_card = getElement('#hash')
const hash_tag = getElement('#hash-tag')
const hash_tip = getElement('#hash-tip')

const query_card = getElement('#query-card')
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

const setSystemTheme = () => {
  theme_btn_system.classList.add(...theme_btn_active)
  theme_btn_dark.classList.remove(...theme_btn_active)
  theme_btn_light.classList.remove(...theme_btn_active)

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark')
    theme = 'media'
    return save_to_storage('theme', theme)
  }
  document.documentElement.classList.remove('dark')
  theme = 'media'
  return save_to_storage('theme', theme)
}

const theme_btn_active = ['bg-teal-800', 'text-teal-200']

const nav_active = ['bg-teal-800', 'text-teal-200', "dark:bg-teal-200", "dark:text-teal-800"]

let currentTheme = get_from_storage('theme')
let theme

let generate_hash = ''

// Start main here
theme_btn.onclick = () =>
  theme_toggle_menu.classList.toggle('hidden')

// check theme on page refresh
if (currentTheme == null || currentTheme == undefined) setSystemTheme()
else if (currentTheme == 'light') {
  theme_btn_system.classList.remove(...theme_btn_active)
  theme_btn_light.classList.add(...theme_btn_active)
  theme_btn_dark.classList.remove(...theme_btn_active)

  document.documentElement.classList.remove('dark')
  theme = 'light'
  save_to_storage('theme', theme)
} else if (currentTheme == 'dark') {
  theme_btn_system.classList.remove(...theme_btn_active)
  theme_btn_dark.classList.add(...theme_btn_active)
  theme_btn_light.classList.remove(...theme_btn_active)

  document.documentElement.classList.add('dark')
  theme = 'dark'
  save_to_storage('theme', theme)
} else if (currentTheme == 'media') setSystemTheme()

theme_btn_light.onclick = () => {
  theme_btn_system.classList.remove(...theme_btn_active)
  theme_btn_light.classList.add(...theme_btn_active)
  theme_btn_dark.classList.remove(...theme_btn_active)

  document.documentElement.classList.remove('dark')
  theme = 'light'
  return save_to_storage('theme', theme)
}

theme_btn_dark.onclick = () => {
  theme_btn_system.classList.remove(...theme_btn_active)
  theme_btn_dark.classList.add(...theme_btn_active)
  theme_btn_light.classList.remove(...theme_btn_active)

  document.documentElement.classList.add('dark')
  theme = 'dark'
  return save_to_storage('theme', theme)
}

theme_btn_system.onclick = () => setSystemTheme()

const show_err = (type, content, tip) => {
  error_card.classList.remove('hidden')
  error_card.classList.add('visible')

  error_title.textContent = type
  error_content.textContent = content
  error_tip.textContent = tip
}

submit.disabled = true

// This function is used to keep the data stored in LS even after a page reload.
// As after a page reload, the list[] becomes empty and the LS item "list" will
// be overwritten by the createData()
window.onload = () => {
  const stored_list = get_from_storage('list') || false
  if (!stored_list) return
  toObject(stored_list).forEach((data) => list.push(data))

  input.value = ''
  search_input.value = ''

  error_card.classList.add('hidden')
  error_card.classList.remove('visible')
}

window.onclick = (e) => {
  const clicked = e.target.id

  if (clicked != theme_toggle_menu.id && clicked != theme_btn.id &&
    clicked != theme_btn_dark.id && clicked != theme_btn_light.id &&
    clicked != theme_btn_system.id
  )
    theme_toggle_menu.classList.add('hidden')
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
  submit.disabled = true

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
}

// TODO Search functionality

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
  const stored_list_reverse = stored_list.reverse()

  if (!stored_list) {
    search_input.disabled = true

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
  }

  search_input.onkeyup = (e) => {
    if (search_input.value.length === 0 || isEmpty(search_input.value)) return query_card.innerHTML = ''

    if (e.target.value == '#') return query_card.innerHTML = ''

    const query = stored_list_reverse.filter(list => {
      if (e.target.value.charAt(0) == '#')
        return list.hash.includes(e.target.value.toUpperCase().substring(1))

      return list.hash.includes(e.target.value.toUpperCase())
    })

    query_card.innerHTML = '' // clea the list section then add to the DOM
    if (query)
      query.forEach((list) => {
        query_card.innerHTML += `
        <div class="relative min-h-full w-full overflow-hidden rounded-3xl bg-teal-400">
          <div class="w-full space-y-4 overflow-hidden p-6 bg-teal-800 text-teal-200 dark:bg-teal-400 dark:text-teal-900">
            <div class="flex w-full select-none items-center justify-between">
              <h1 class="font-code rounded-full bg-teal-200 dark:bg-teal-800 px-3 py-2 text-xl leading-none text-teal-800 dark:text-teal-200">#${list.hash}</h1>
              <div class="text-right text-xs text-teal-400 dark:text-teal-700">
                <p>On ${list.date}</p>
                <p>At ${list.time}</p>
              </div>
            </div>
            <div class="mt-2 flex w-full items-end space-x-3 text-xs">
              <div class="rounded-lg border border-teal-400 dark:border-teal-700 px-3 py-0.5">
                <p class="select-none capitalize text-teal-400 dark:text-teal-700">${list.type}</p>
              </div>
            </div>
            <p class="hash_content font-code truncate">${list.content}</p>
          </div>
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

  stored_list_reverse.forEach((list) => {
    search_card.innerHTML += `
    <div class="relative w-full min-h-full bg-teal-400 rounded-3xl overflow-hidden">
      <div class="w-full space-y-4 overflow-hidden bg-teal-200 p-6 dark:bg-teal-800 dark:text-teal-200">
        <div class="flex w-full items-end justify-between select-none">
          <h1 class="font-code text-xl leading-none text-teal-800 dark:text-teal-200">#${list.hash}</h1>
          <div class="text-xs text-teal-600 dark:text-teal-400">
            <p>On ${list.date}</p>
            <p class="text-right dark:text-teal-400">At ${list.time}</p>
          </div>
        </div>
        <div class="mt-2 flex w-full items-end space-x-3 text-xs text-teal-800 dark:text-teal-600">
          <div class="rounded-lg border border-teal-600 px-3 py-0.5 dark:border-teal-400">
            <p class="capitalize dark:text-teal-400 select-none">${list.type}</p>
          </div>
        </div>
        <p class="hash_content font-code truncate text-teal-800 dark:text-teal-200">${list.content}</p>
      </div>
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