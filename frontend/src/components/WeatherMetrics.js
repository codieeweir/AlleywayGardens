import { useState, useEffect } from "react";

const WeatherMetrics = ({ project_id }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null); // Track which day is selected

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/project_weather/${project_id}/`
        );
        if (!response.ok) {
          alert("Couldn't fetch data");
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [project_id]);

  if (loading) return <p>Loading weather data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!weatherData) return <p>No weather data available.</p>;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

  return (
    <div className="weather-metrics">
      <h3>7 Day Forecast</h3>
      <div className="day-buttons">
        {weatherData.map((entry, index) => (
          <button
            key={index}
            onClick={() => setSelectedDay(index === selectedDay ? null : index)}
            className="mb-2"
          >
            {formatDate(entry.date)}{" "}
          </button>
        ))}
      </div>
      {/* Tidying up the data display to a cleaner format, as raw data is large and not summarised to a decimal place */}
      {selectedDay !== null && (
        <div className="weather-entry">
          <p>
            🌡️ <strong>Max Temperature:</strong>{" "}
            {weatherData[selectedDay].temperature_2m_max.toFixed(2)} °C
          </p>
          <p>
            ☀️ <strong>Daylight Duration:</strong>{" "}
            {(weatherData[selectedDay].daylight_duration / 3600).toFixed(2)}{" "}
            hours
          </p>
          <p>
            🌞<strong>Sunshine Duration:</strong>{" "}
            {(weatherData[selectedDay].sunshine_duration / 3600).toFixed(2)}{" "}
            hours
          </p>
          <p>
            🕶️<strong>UV Index Max:</strong>{" "}
            {weatherData[selectedDay].uv_index_max.toFixed(2)}
          </p>
          <p>
            🌧️ <strong>Precipitation:</strong>{" "}
            {weatherData[selectedDay].precipitation_sum.toFixed(2)} mm
          </p>
          <p>
            ⏳ <strong>Precipitation Hours:</strong>{" "}
            {weatherData[selectedDay].precipitation_hours.toFixed(2)} hours
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherMetrics;
