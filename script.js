const citySearchButton = document.getElementById('city-search-btn')
const forecastLength = "3"

citySearchButton.addEventListener('click', () => {
  const cityInput = document.getElementById('city-name').value
  updateForecasts(cityInput)
})

async function updateForecasts(cityName) {
  try {
    const forecastWidgetContainers = document.querySelectorAll('.forecast-widget-container')
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

  const processedData = targetDataSet.map( dailyForecastData => {
    const date = dailyForecastData.date
    const conditions = dailyForecastData.day.condition.text
    const conditionsImgCode = dailyForecastData.day.condition.code
    const maxTemp = dailyForecastData.day.maxTemp_c
    const minTemp = dailyForecastData.day.minTemp_c
    const totalPrecip = dailyForecastData.day.totalPrecip_mm

    return {date, conditions, conditionsImgCode, maxTemp, minTemp, totalPrecip}
  }) 

  return processedData
}


function generateForecastWidget(dayWeatherData) {
  const widgetElement = document.createElement('div')

  const dateElement = document.createElement('p')

  const conditionsText = document.createElement('p')
  conditionsText.textContent = dayWeatherData.conditions;

  [conditionsText].forEach(element => widgetElement.appendChild(element))

  return widgetElement
}
