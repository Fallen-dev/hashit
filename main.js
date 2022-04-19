import './style.css'

// Utilities
const getElement = (selector, type=document) => type.querySelector(selector)
const log = (...args) => console.debug(...args)
const log_err = (...args) => console.error(...args)

const toString = (value) => JSON.stringify(value)
const toObject = (value) => JSON.parse(value)

// DOM stuff
const input = getElement('textarea')
const submit = getElement('input[type=submit]')
const text = getElement('div#text')
const previewLink = getElement('p#previewlink')
const errortext = getElement('h3#error')
const hashStr = getElement('h1#hash')

const validateURL = (url) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?'+                                // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+                      // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+                  // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+                         // query string
    '(\\#[-a-z\\d_]*)?$','i'                            // fragment locator
  )
  return !!pattern.test(url);
}

const createData = (generated_hash, content, type) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

  const userLocale = navigator.languages != undefined ? navigator.language : 'en-US'

  return {
    "id" : Date.now(),
    "hash" : generated_hash,
    "content" : content,
    "type" : type,
    "date": new Date().toLocaleDateString(userLocale, options),
    "time": `${new Date().getHours()} : ${new Date().getMinutes()}`
  }
}

const handleInput = (generated_hash, content) => {
  // validate link first
  if (validateURL(input.value)) {
    save_link(generated_hash, toString(createData(generated_hash, content, 'link')))
    text.innerHTML = `<a href="${input.value}" target="_blank">${input.value}</a>`
  } else {
    save_link(generated_hash, toString(createData(generated_hash, content, 'text')))
    text.innerHTML = `<h3>${input.value}</h3>`
  }
}

const hash = () => (Math.random() + 1).toString(36).substring(7).toUpperCase()

const save_link = (key, link) => localStorage.setItem(key, link)
const get_link = link => localStorage.getItem(link)


// Start main here
const disable_on_keyup = () => submit.disabled = true
const show_err = (error) => errortext.textContent = error

const helpText = 'put a link here'

let generate_hash = ''

input.value = helpText
submit.disabled = true

input.onfocus = (e) => {
  e.target.value = ''
  show_err('')
}

input.onkeyup = (e) => {
  e.target.value == '' ? submit.disabled = true : submit.disabled = false

  for (let i=0; i<=100; i++) clearInterval(i)
}

submit.onclick = () => {

  generate_hash = hash()

  handleInput(generate_hash, input.value)

  input.value = helpText

  hashStr.textContent = '#' + generate_hash

  setInterval(disable_on_keyup, 100)
}