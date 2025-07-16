import React, { useState } from 'react';

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${import.meta.env.VITE_API_KEY}`
      );
      const data = await res.json();
      console.log(data);

      if (data.cod === 200) {
        setWeather(data);
        setError("");
      } else {
        setWeather(null);
        setError(data.message || "City not found");
      }
    } catch (err) {
      setError("Network error");
      setWeather(null);
    }
  };

  return (
    <div>
      <h1>Погода</h1>
      <input
        type="text"
        placeholder="Город (например, Астана)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeather}>Поиск</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: "1rem" }}>
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p>Температура: {weather.main.temp}°C</p>
          <p>Погода: {weather.weather[0].description}</p>
          <p>Скорость ветра: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;
