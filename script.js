const citySearchButton = document.getElementById('city-search-btn')
const defaultForecastLength = "3"

citySearchButton.addEventListener('click', () => {
  const cityInput = document.getElementById('city-name').value
  updateForecasts(cityInput)
})

async function getWeatherForecast(location, numOfDays) {
  try {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=e37177f58ac44c8e92442933242702&q=${location}&days=${numOfDays}`)
    if (!response.ok){
      console.log(`HTTP Error!, Status: ${response.status}`)
    } else {
      const data = await response.json()
      return data.forecast.forecastday
    }
  } catch (err) {
   console.log(err) 
  }
}

function updateName(locationName) {
  const cityName = document.getElementById('city-name')

  cityname.textContent = locationName
}

async function updateForecasts(cityName) {
  try {
    const forecastWidgets = document.querySelectorAll('.forecast-widget')
    const weatherData = await getWeatherForecast(cityName, defaultForecastLength)

    forecastWidgets.forEach((widget, index) => {
      widget.textContent = 'On ' + weatherData[index].date + ' it will average ' + weatherData[index].day.avgtemp_c + ' degrees celcius! '
    })
  } catch (err){
    console.log(`Error: ${err}`)
  }
}
