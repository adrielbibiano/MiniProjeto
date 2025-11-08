const apiKey = "835a647d01bf89b72afc0a430535d948";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const icon = document.getElementById("icon");
const forecastContainer = document.createElement("div");

forecastContainer.id = "forecast";
weatherInfo.appendChild(forecastContainer);

// Atualiza clima atual
function updateCurrentWeather(data) {
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  description.textContent = data.weather[0].description;
  icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherInfo.classList.remove("hidden");
}

// Atualiza previsão de 5 dias
function updateForecast(data) {
  forecastContainer.innerHTML = ""; // limpa previsões anteriores

  const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  dailyData.forEach(day => {
    const forecastDay = document.createElement("div");
    forecastDay.classList.add("forecast-day");

    const date = new Date(day.dt_txt);
    const options = { weekday: "long" };
    const dayName = date.toLocaleDateString("pt-BR", options);

    forecastDay.innerHTML = `
      <div class="day">${dayName}</div>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Ícone do tempo">
      <div>${Math.round(day.main.temp)}°C</div>
      <div style="text-transform: capitalize;">${day.weather[0].description}</div>
    `;

    forecastContainer.appendChild(forecastDay);
  });
}

// Função principal
async function getWeather(city) {
  try {
    // Clima atual
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`
    );
    const weatherData = await weatherResponse.json();

    if (weatherData.cod === "404") {
      alert("Cidade não encontrada!");
      weatherInfo.classList.add("hidden");
      return;
    }

    updateCurrentWeather(weatherData);

    // Previsão de 5 dias
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`
    );
    const forecastData = await forecastResponse.json();

    updateForecast(forecastData);
  } catch (error) {
    alert("Erro ao buscar os dados do clima. Tente novamente mais tarde.");
    console.error(error);
  }
}

// Evento de clique no botão
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
});

// Permitir busca pressionando Enter
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
  }
});
