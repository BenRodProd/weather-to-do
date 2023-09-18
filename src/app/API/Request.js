export default async function requestWeather(city) {
  const response = await fetch(
    process.env.HOST + '?key=' + process.env.KEY + '&q=' + city + '&days=3&aqi=no'
  );
  const data = await response.json();

  return data;
}
