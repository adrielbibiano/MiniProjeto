const apiKey = "835a647d01bf89b72afc0a430535d948"; // Pegue em https://openweathermap.org/api

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const icon = document.getElementById("icon");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value;
  if (!city) return alert("Digite o nome de uma cidade!");

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`)
    .then(response => response.json())
    .then(data => {
      if (data.cod === "404") {
        alert("Cidade não encontrada!");
        return;
      }

      cityName.textContent = `${data.name}, ${data.sys.country}`;
      temperature.textContent = `🌡 ${data.main.temp.toFixed(1)}°C`;
      description.textContent = `☁️ ${data.weather[0].description}`;
      icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      weatherInfo.classList.remove("hidden");
    })
    .catch(() => alert("Erro ao buscar dados!"));
});
