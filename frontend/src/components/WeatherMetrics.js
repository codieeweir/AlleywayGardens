import { useState, useEffect } from "react";

const WeatherMetrics = ({ project_id }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/project_weather/${project_id}/`
        );
        if (!response.ok) {
          alert("Couldnt fetch data");
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

  return (
    <div className="weather-metrics">
      <h3>7 Day Forecast</h3>
      {weatherData.map((entry, index) => (
        <div key={index} className="weather-entry">
          <p>
            <strong>Date:</strong> {entry.date}
          </p>
          <p>
            <strong>Max Temperature:</strong>{" "}
            {entry.temperature_2m_max.toFixed(2)} °C
          </p>
          <p>
            <strong>Daylight Duration:</strong>{" "}
            {(entry.daylight_duration / 3600).toFixed(2)} hours
          </p>
          <p>
            <strong>Sunshine Duration:</strong>{" "}
            {(entry.sunshine_duration / 3600).toFixed(2)} hours
          </p>
          <p>
            <strong>UV Index Max:</strong> {entry.uv_index_max.toFixed(2)}
          </p>
          <p>
            <strong>Precipitation:</strong> {entry.precipitation_sum.toFixed(2)}{" "}
            mm
          </p>
          <p>
            <strong>Precipitation Hours:</strong>{" "}
            {entry.precipitation_hours.toFixed(2)} hours
          </p>
        </div>
      ))}
    </div>
  );
};

export default WeatherMetrics;
