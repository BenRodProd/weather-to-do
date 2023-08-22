export default async function requestWeather(city) {
    
const response = await fetch("https://api.weatherapi.com/v1/forecast.json?key=ad3034e1ab4b4aaa873152308232208&q=" + city + "&days=3&aqi=no")
const data = await response.json()
console.log(data)
return data
}
