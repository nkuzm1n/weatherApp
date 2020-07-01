const apiParams = {
  url: 'api.openweathermap.org/data/2.5/weather',
  key: 'f6d45665dd5bc33581575df36c6c6b3d',
  defaultCity: 'Cheboksary,ru',
  lang: 'ru',
  units: 'metric'
}
const apiCall = 
  `
    https://${apiParams.url}?q=${apiParams.defaultCity}&appid=${apiParams.key}&units=${apiParams.units}&lang=${apiParams.lang}app.js
  `
// const geoCall = `https://${apiParams.url}?lat={lat}&lon={lon}&appid=${apiParams.key}`

const monthNames = [
  'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
  'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
]

const dayNames = [
  'Sun', 'Mon', 'Tue', 'Wed',
  'Thu', 'Fri', 'Sat'
]

document.addEventListener('DOMContentLoaded', onAppLoaded)

function onAppLoaded() {
  setCurrentDate()
  setInterval(() => {
    setCurrentDate()
  }, 3000)
  
  getWeather(apiCall)
    .then(weather => {
      console.log(weather)
      setLocation(weather)
      setCurrentDate()
      setTemperature(weather)
      setWind(weather)
    })
    .catch((weather) => {
      console.error(weather)
    })
}

function getWeather(url, method = 'GET', body = null) {
  fetchParams = {}
  if (method === 'POST') {
    const sendHeaders = {
      'Content-Type': 'application/json'
    }
    fetchParams = {
      method: method,
      headers: sendHeaders,
      body: JSON.stringify(body)
    }
  }
  return fetch(url, fetchParams).then(response => {
    if (response.ok) {
      return response.json()
    }
    return response.json().then(error => {
      const e = new Error('Что-то пошло не так')
      e.data = error
      throw e
    })
  })
}

function setTemperature(weather) {
  const weatherDescript = document.querySelector('.weather-descript')
  const weatherTemp = document.querySelector('.weather-temp__main')
  const weatherMin = document.querySelector('.weather-temp__min')
  const weatherMax = document.querySelector('.weather-temp__max')
  const realFeel = document.querySelector('.weather-feels__temp')

  const descrTransformed = firstLetterUppCase(weather.weather[0].description)
  weatherDescript.textContent = descrTransformed
  
  weatherTemp.innerHTML = `${weather.main.temp}&#0176;`
  weatherMin.innerHTML = `${weather.main.temp_min}&#0176;`
  weatherMax.innerHTML = `${weather.main.temp_max}&#0176;`
  realFeel.innerHTML = `${Math.round(weather.main.feels_like)}&#0176;`
}

function getCurrentDate() {
  const cTime = new Date()
  let mins = cTime.getMinutes().toString()
  if (mins.length < 2) {
    mins = '0' + mins
  }
  return {
    day: dayNames[cTime.getDay()],
    date: cTime.getDate(),
    hours: cTime.getHours(),
    minutes: mins
  }
}

function setLocation(weather) {
  const weatherLocation = document.querySelector('.location')
  weatherLocation.textContent = `${weather.name}, ${weather.sys.country}`
}

function setCurrentDate() {
  const currentDate = document.querySelector('.date')
  const cDate = getCurrentDate()
  currentDate.textContent = `${cDate.day}, ${cDate.date} ${cDate.hours}:${cDate.minutes}`
}

function firstLetterUppCase(descr) {
  return descr.charAt(0).toUpperCase() + descr.slice(1)
}

function setWind(weather) {
  const wDirection = [
    {deg: 11.25, res: 'NNE'},
    {deg: 33.75, res: 'NE'},
    {deg: 56.25, res: 'ENE'},
    {deg: 78.75, res: 'E'},
    {deg: 101.25, res: 'ESE'},
    {deg: 123.75, res: 'SE'},
    {deg: 146.25, res: 'SSE'},
    {deg: 168.75, res: 'S'},
    {deg: 191.25, res: 'SSW'},
    {deg: 213.75, res: 'SS'},
    {deg: 236.25, res: 'WSW'},
    {deg: 258.75, res: 'W'},
    {deg: 281.25, res: 'WNW'},
    {deg: 303.75, res: 'NW'},
    {deg: 326.25, res: 'NNW'},
    {deg: 348.75, res: 'N'},
  ]

  const degree = weather.wind.deg
  let wDir = 'N'

  for (let index = 0; index < wDirection.length; index++) {
    const dir1 = wDirection[index]
    let dir2
    if (wDirection[index + 1]) {
      dir2 = wDirection[index + 1]
      if (degree >= dir1.deg && degree < dir2.deg) {
        wDir = dir1.res
      }
    } else {
      dir2 = wDirection[0]
      if (degree >= dir1.deg || degree < dir2.deg) {
        wDir = dir1.res
      }
    }
  }

  const windDegree = document.querySelector('.wind__degree')
  const windSpeed = document.querySelector('.wind__speed')

  windDegree.textContent = `${wDir}`
  windSpeed.textContent = `${weather.wind.speed} m/s`
}
