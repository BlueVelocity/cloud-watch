const citySearchButton = document.getElementById('city-search-btn')
const forecastWidgetContainers = document.querySelectorAll('.forecast-container')
const locationDisplay = document.getElementById('city-name-display')
const loadingBar = document.querySelector('.loading-bar')
const forecastLength = "3"

citySearchButton.addEventListener('click', () => {
  const userInput = document.getElementById('city-name').value
  updateForecasts(userInput)
})

async function updateForecasts(cityName) {
  try {
    loadingBar.classList.add('active')
    const weatherData = await getWeatherForecastData(cityName, forecastLength)
    loadingBar.classList.remove("active")
    const extractedData = await Promise.all([await extractForecastData(weatherData), await extractLocationData(weatherData)])

    updateLocationDisplay(extractedData[1])

    forecastWidgetContainers.forEach((widgetContainer, index) => {
      widgetContainer.innerHTML = ''
      setTimeout(() => widgetContainer.classList.add("bounce"), index * 50)
      setTimeout(() => widgetContainer.classList.remove("bounce"), 200 + (index * 50))
      widgetContainer.appendChild(generateForecastWidget(extractedData[0][index]))
    })
  } catch (err){
    console.log(err)
  }
}

async function getWeatherForecastData(location, numOfDays) {
  try {
    const response = await fetch(`//api.weatherapi.com/v1/forecast.json?key=e37177f58ac44c8e92442933242702&q=${location}&days=${numOfDays}`, {
      mode: 'cors'
    })
    if (!response.ok){
      console.log(`HTTP Error!, Status: ${response.status}`)
      alert("Location unknown!")
    } else {
      const data = await response.json()
      return data
    }
  } catch (err) {
    console.log(err)
    alert('Location Unkown')
  }
}

function extractLocationData(rawData) {
  const locationData = rawData.location

  return locationData
}

function extractForecastData(rawData) {
  const weatherDataSet = rawData.forecast.forecastday

  const processedData = weatherDataSet.map( dailyForecastData => {
    const date = dateFns.format(new Date(dailyForecastData.date), 'MMM DD, YYYY')
    const conditions = dailyForecastData.day.condition.text
    const conditionsImgUrl = dailyForecastData.day.condition.icon
    const maxTemp = dailyForecastData.day.maxtemp_c
    const minTemp = dailyForecastData.day.mintemp_c
    const totalPrecip = dailyForecastData.day.totalprecip_mm

    return {date, conditions, conditionsImgUrl, maxTemp, minTemp, totalPrecip}
  }) 

  return processedData
}

function updateLocationDisplay(locationData) {
  locationDisplay.textContent = ''
  locationDisplay.textContent = `${locationData.name}, ${locationData.country}`
}

function generateForecastWidget(dayWeatherData) {
  const widgetElement = document.createElement('div')

  const dateElement = document.createElement('p')
  dateElement.textContent = dayWeatherData.date

  const conditionsText = document.createElement('p')
  conditionsText.textContent = dayWeatherData.conditions

  const tempElement = document.createElement('p')
  tempElement.textContent = `${dayWeatherData.minTemp}℃ - ${dayWeatherData.maxTemp}℃`

  const totalPrecipElement = document.createElement('p')
  totalPrecipElement.textContent = `${dayWeatherData.totalPrecip}mm Total Precip.`

  const weatherIcon = document.createElement('img')
  weatherIcon.src = dayWeatherData.conditionsImgUrl;

  [dateElement, conditionsText, tempElement, totalPrecipElement, weatherIcon].forEach(element => widgetElement.appendChild(element))

  return widgetElement
}
