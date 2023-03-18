// import axios from "axios";

// const city = "Hefei";
// const apiKey = "8a7bbabb9c8f695f82c5a29ba966cf86";
// const apiUrl = "http://api.openweathermap.org/data/2.5/weather";

// const GetWeatherData = async (): Promise < void > => axios({
//   url: apiUrl,
//   method: "GET",
//   params: {
//     q: city,
//     appid: apiKey,
//     units: "metric"
//   },
// })
//   .then(({ data: weatherData }) => {
//     console.log(weatherData);
//     console.log(`${city}今天的天气：${weatherData.weather[0].description}，温度为 ${weatherData.main.temp} 摄氏度。`);
//   })
//   .catch((error) => {
//     console.error(`Error fetching weather data: ${error}`);
//   });
// export default GetWeatherData;