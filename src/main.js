/* eslint-disable no-unused-expressions */
import allData from './data/data.json'
import { $ } from './utils'

!(function () {
  console.info('%cYou can view the project at\nhttps://github.com/edicsonabel/paypalator', 'font-weight:bold')

  const drawApp = () => {
    existLS('paypalator:user') || setLS(
      'paypalator:user',
      JSON.stringify({
        lang: 'en',
        country: 'us',
        value: 0,
        calc: 0
      })
    )
    drawCountry()
    getUser()
    drawLanguage()
    drawFee()
    updateOpts()
    drawSymbol()
    drawCalculator()
  }

  const drawLanguage = () => {
    optCalculator.classList.add('d-none')
    const e = userLS.lang
    document.getElementsByTagName('html').forEach(t => t.setAttribute('lang', e))
    optReceive.innerHTML = WORDS[e].rp
    optSend.innerHTML = WORDS[e].sp
    optCalculator.classList.remove('d-none')
  }

  const drawCalculator = () => {
    switch (userLS.calc) {
      case 0:
        optSend.setAttribute('aria-selected', 'false')
        optSend.classList.remove('active')
        optReceive.setAttribute('aria-selected', 'true')
        optReceive.classList.add('active')
        sendHTML.classList.remove('active')
        receiveHTML.classList.add('active')
        break
      case 1:
        optReceive.setAttribute('aria-selected', 'false')
        optReceive.classList.remove('active')
        optSend.setAttribute('aria-selected', 'true')
        optSend.classList.add('active')
        receiveHTML.classList.remove('active')
        sendHTML.classList.add('active')
    }
  }

  const drawCountry = () => {
    optCountry.classList.add('d-none')
    let e = ''
    for (const t of allData) e += `<option value="${t.country}">${t.name} (${t.currency})</option>`
    optCountry.innerHTML = e
    optCountry.classList.remove('d-none')
  }

  const drawFee = () => {
    optFee.classList.add('d-none')
    let e = ''
    const t = getIndex()
    const a = allData[t]
    const n = userLS.lang
    for (const t of a.data) {
      const r = t.values
      e += `<optgroup label="${t.section[n]}">`
      for (const t of r) {
        e += `
      <option value="${t.id}">
        ${t.perc}% + ${a.symbol} ${pretty(t.fee)} ${t.text[n] ? '(' + t.text[n] + ')' : ''}
      </option>`
      }
      e += '</optgroup>'
    }
    optFee.innerHTML = e
    optFee.classList.remove('d-none')
  }

  const drawSymbol = () => {
    const e = getIndex()
    txtPaypal.classList.add('d-none')
    txtSymbol.innerHTML = allData[e].symbol
    txtPaypal.classList.remove('d-none')
  }

  const existLS = e => !!window.localStorage.getItem(e)

  const getUser = () => {
    const e = getLS('paypalator:user')
    userLS = JSON.parse(`${e}`)
  }

  const getLS = e => window.localStorage.getItem(e)

  const pretty = e => {
    e = parseFloat(e).toFixed(2)
    return isNaN(e) ? 0 : e
  }

  const changeOpt = (e, t) => {
    e.value = t
  }

  const setLS = (value, key) => {
    window.localStorage.setItem(value, key)
  }

  const resetFee = () => {
    changeUser('value', 0)
    drawSymbol()
  }

  const changeUser = (key, value, reset = false) => {
    getUser()
    userLS[key] = value
    setLS('paypalator:user', JSON.stringify(userLS))
    reset && resetFee()
    getUser()
    updateOpts()
    reset && drawFee()
  }

  const updateOpts = () => {
    changeOpt(optCountry, userLS.country)
    changeOpt(optFee, userLS.value)
    calculate()
  }

  const calculate = () => {
    const e = userLS.lang
    const t = inputPaypal.value.replace(',', '.')
    isNaN(t)
      ? ((receiveHTML.innerHTML = `
      <strong class='text-center h4 d-block'>
        ${inputPaypal.value} ${WORDS[e].nan}
      </strong>`),
        (sendHTML.innerHTML = `
        <strong class='text-center h4 d-block'>
          ${inputPaypal.value} ${WORDS[e].nan}
        </strong>`))
      : ((receiveHTML.innerHTML = fnReceive(t)), (sendHTML.innerHTML = fnSend(t)))
  }

  const fnReceive = e => {
    const t = userLS.lang
    const a = getIndex()
    e = parseFloat(e)
    const n = getValues()
    const r = parseFloat(n.fee)
    const s = parseFloat(n.perc)
    const l = allData[a].symbol
    const o = allData[a].currency
    let c = (e + r) / (1 - s / 100)
    let d = (c * s) / 100
    return (
      c < 0 && ((c = 0), (d = 0), (e = 0)),
      `<table class="table">
      <thead class="primary-color white-text">
        <tr >
          <th scope="col">${o}</th>
          <th scope="col">${s}%</th> 
          <th scope="col">fee</th>
        </tr>
      </thead>
      <tbody>
        <tr >
          <td>${l} ${pretty(e)}</td>
          <td>${l} ${pretty(d)}</td>
          <td>${l} ${pretty(r)}</td>
        </tr>
      </tbody>
      </table>
      <div class="text-center">
        <span><strong class='h4'>${WORDS[t].ts}: ${l} ${pretty(c)} (${o})</strong></span>
      </div>`
    )
  }

  const fnSend = e => {
    const t = userLS.lang
    const a = getIndex()
    e = parseFloat(e)
    const n = getValues()
    const r = parseFloat(n.fee)
    const s = parseFloat(n.perc)
    const l = allData[a].symbol
    const o = allData[a].currency
    let c = (e * s) / 100
    let d = e - c - r
    return (
      d < 0 && ((d = 0), (c = 0), (e = 0)),
      `<table class="table">
        <thead class="primary-color white-text">
          <tr > 
            <th scope="col">${o}</th>
            <th scope="col">${s}%</th>
            <th scope="col">fee</th>
          </tr>
        </thead>
        <tbody>
          <tr >
            <td>${l} ${pretty(e)}</td>
            <td>${l} ${pretty(c)}</td>
            <td>${l} ${pretty(r)}</td>
          </tr>
        </tbody>
      </table>
      <div class="text-center">
        <span><strong class='h4'>${WORDS[t].tr}: ${l} ${pretty(d)} (${o})</strong></span>
      </div>`
    )
  }

  const getValues = () => {
    let e = 0
    let t = 0
    const a = parseFloat(userLS.value)
    const n = getIndex()
    const r = allData[n].data
    r.map(n => (n.values.map(n => (n.id === a ? (t = e) : '')) ? e++ : ''))
    return r[t].values.filter(e => e.id === a)[0]
  }

  const getIndex = () => {
    let e = 0
    let t = 0
    const a = userLS.country
    allData.map(n => (n.country === a ? (t = e) : e++))
    return t
  }

  const WORDS = { en: { rp: 'Receive Payments', sp: 'Send Payments', tr: 'To receive', ts: 'To send', nan: "it's not a number" }, es: { rp: 'Recibir Pagos', sp: 'Enviar Pagos', tr: 'Recibir', ts: 'Enviar', nan: 'no es un número' } }

  let userLS
  const inputPaypal = $('#quantityPaypal')
  const receiveHTML = $('#pills-receive')
  const sendHTML = $('#pills-send')
  const optCalculator = $('#pills-tab')
  const optReceive = $('#pills-receive-tab')
  const optSend = $('#pills-send-tab')
  const optCountry = $('#optCountry')
  const optFee = $('#optFee')
  const txtSymbol = $('#txtSymbol')
  const txtPaypal = $('#txtPaypal')
  const langEN = $('#langEN')
  const langES = $('#langES')
  inputPaypal.addEventListener('keyup', calculate)
  optCountry.addEventListener('change', () => changeUser('country', optCountry.value, true))
  optFee.addEventListener('change', () => changeUser('value', +optFee.value))
  optReceive.addEventListener('click', () => {
    changeUser('calc', 0)
    drawCalculator()
  })
  optSend.addEventListener('click', () => {
    changeUser('calc', 1)
    drawCalculator()
  })
  langEN.addEventListener('click', () => {
    changeUser('lang', 'en')
    drawApp()
  })
  langES.addEventListener('click', () => {
    changeUser('lang', 'es')
    drawApp()
  })
  drawApp()
})()
