import { useState, useEffect } from "react";

const WeatherAverages = ({ project_id }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/project_weather_averages/${project_id}/`
        );
        if (!response.ok) {
          alert("Couldnt fetch data");
        }
        const data = await response.json();
        setWeatherData(data.monthly_averages);
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

  // Just some logic to tidy up the raw data for each field
  return (
    <div className="weather-metrics">
      <h3>Monthly Weather Metrics 🌦️</h3>
      <div className="weather-entry">
        <p>
          🌡️ <strong>Average Max Temperature:</strong>{" "}
          {weatherData.temperature_2m_max?.toFixed(2) ?? "N/A"} °C
        </p>
        <p>
          ☀️ <strong>Average Daylight Duration:</strong>{" "}
          {weatherData.daylight_duration
            ? (weatherData.daylight_duration / 3600).toFixed(2)
            : "N/A"}{" "}
          hours
        </p>
        <p>
          🌞 <strong>Average Sunshine Duration:</strong>{" "}
          {weatherData.sunshine_duration
            ? (weatherData.sunshine_duration / 3600).toFixed(2)
            : "N/A"}{" "}
          hours
        </p>
        <p>
          🕶️ <strong>Average UV Index Max:</strong>{" "}
          {weatherData.uv_index_max?.toFixed(2) ?? "N/A"}
        </p>
        <p>
          🌧️ <strong>Average Precipitation:</strong>{" "}
          {weatherData.precipitation_sum?.toFixed(2) ?? "N/A"} mm
        </p>
        <p>
          ⏳ <strong>Average Precipitation Hours:</strong>{" "}
          {weatherData.precipitation_hours?.toFixed(2) ?? "N/A"} hours
        </p>
      </div>
    </div>
  );
};

export default WeatherAverages;
