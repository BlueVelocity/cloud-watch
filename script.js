const citySearchButton = document.getElementById('city-search-btn')
const forecastLength = "3"

citySearchButton.addEventListener('click', () => {
  const cityInput = document.getElementById('city-name').value
  updateForecasts(cityInput)
})

async function updateForecasts(cityName) {
  try {
    const forecastWidgetContainers = document.querySelectorAll('.forecast-container')
    const weatherData = await getWeatherForecastData(cityName, forecastLength)
    const forecastData = await extractForecastData(weatherData)

    forecastWidgetContainers.forEach((widgetContainer, index) => {
      widgetContainer.appendChild(generateForecastWidget(forecastData[index]))
    })
  } catch (err){
    console.log(err)
  }
}

async function getWeatherForecastData(location, numOfDays) {
  try {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=e37177f58ac44c8e92442933242702&q=${location}&days=${numOfDays}`)
    if (!response.ok){
      console.log(`HTTP Error!, Status: ${response.status}`)
    } else {
      const data = await response.json()
      return data
    }
  } catch (err) {
   console.log(err) 
  }
}

function extractForecastData(rawData) {
  const targetDataSet = rawData.forecast.forecastday
  console.log(targetDataSet)

  const processedData = targetDataSet.map( dailyForecastData => {
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

function resetWeatherWidgets() {
  document.querySelectorAll('.forecast-container')
}
