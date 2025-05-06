import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PlantPage = () => {
  const { pid } = useParams();
  const [plantDetails, setPlantDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Displaying information about each plant in a clear way, gained through a different version of the API with more detailed data

  const fetchPlantDetails = async () => {
    // genertaed on the external webpage
    const apiKey = "8e30b454a84922b6c56b56806041330141134c2c";

    try {
      const response = await fetch(
        `https://open.plantbook.io/api/v1/plant/detail/${pid}/`,
        {
          headers: {
            //api key at top is used here
            Authorization: `Token ${apiKey}`,
          },
        }
      );
      const data = await response.json();
      setPlantDetails(data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching plant details.");
      setLoading(false);
      console.error("Error fetching plant details:", error);
    }
  };

  useEffect(() => {
    fetchPlantDetails();
  }, [pid]);

  if (loading) return <div>Loading plant details...</div>;
  if (error) return <div>{error}</div>;

  const getLightRange = (minLightMmol, maxLightMmol) => {
    return `${minLightMmol} - ${maxLightMmol} mmol`;
  };

  const getTemperatureRange = (minTemp, maxTemp) => {
    return `${minTemp}°C - ${maxTemp}°C`;
  };

  const getHumidityRange = (minHumidity, maxHumidity) => {
    return `${minHumidity}% - ${maxHumidity}%`;
  };

  const getSoilMoistureRange = (minSoilMoist, maxSoilMoist) => {
    return `${minSoilMoist}% - ${maxSoilMoist}%`;
  };

  const getSoilECRange = (minSoilEC, maxSoilEC) => {
    return `${minSoilEC} - ${maxSoilEC}`;
  };

  const lightRange = getLightRange(
    plantDetails.min_light_mmol,
    plantDetails.max_light_mmol
  );
  const temperatureRange = getTemperatureRange(
    plantDetails.min_temp,
    plantDetails.max_temp
  );
  const humidityRange = getHumidityRange(
    plantDetails.min_env_humid,
    plantDetails.max_env_humid
  );
  const soilMoistureRange = getSoilMoistureRange(
    plantDetails.min_soil_moist,
    plantDetails.max_soil_moist
  );
  const soilECRange = getSoilECRange(
    plantDetails.min_soil_ec,
    plantDetails.max_soil_ec
  );

  return (
    <section className="plant-page">
      <div className="container mt-5">
        <div className="card shadow-sm">
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src={plantDetails.image_url}
                alt={plantDetails.display_pid}
                className="img-fluid rounded-start"
                style={{ objectFit: "cover", height: "100%" }}
              />
            </div>

            <div className="col-md-8">
              <div className="card-body">
                <h1 className="card-title">{plantDetails.display_pid}</h1>
                <div className="plant-metrics">
                  <h2>Plant Metrics</h2>
                  <ul className="list-unstyled">
                    <li>
                      <strong>Light Exposure:</strong> {lightRange} 🌞
                    </li>
                    <li>
                      <strong>Temperature:</strong> {temperatureRange} 🌡️
                    </li>
                    <li>
                      <strong>Humidity:</strong> {humidityRange} 💧
                    </li>
                    <li>
                      <strong>Soil Moisture:</strong> {soilMoistureRange} 🌱
                    </li>
                    <li>
                      <strong>Soil EC:</strong> {soilECRange} 🌍
                    </li>
                  </ul>
                </div>
                <div>
                  <p>
                    For more information on plant care, please visit this site
                    for more detailed information.
                  </p>
                  <a
                    href="https://perenual.com/plant-database-search-guide"
                    className="btn btn-link"
                  >
                    Perenual Plant Database!
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlantPage;
