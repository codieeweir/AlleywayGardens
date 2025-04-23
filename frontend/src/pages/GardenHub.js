import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, InputGroup, FormControl, CardBody } from "react-bootstrap";
import { Container, Row, Col, Card, Tab, Tabs } from "react-bootstrap";
import placeholderImage from "../assets/placeholder-image.png";

const GardenHub = () => {
  const [plants, setPlants] = useState([]);
  const [cachedPlants, setCachedPlants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const apiKey = "8e30b454a84922b6c56b56806041330141134c2c";

  const fetchPlants = async (searchTerm = "a") => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://open.plantbook.io/api/v1/plant/search?alias=${searchTerm}&limit=10&offset=0`,
        {
          headers: {
            Authorization: `Token ${apiKey}`,
          },
        }
      );
      const data = await response.json();

      // Fetch detailed data (including images)
      const plantDetailsPromises = data.results.map(async (plant) => {
        const detailResponse = await fetch(
          `https://open.plantbook.io/api/v1/plant/detail/${plant.pid}/`,
          {
            headers: {
              Authorization: `Token ${apiKey}`,
            },
          }
        );
        const detailData = await detailResponse.json();
        return { ...plant, image_url: detailData.image_url };
      });

      const detailedPlants = await Promise.all(plantDetailsPromises);

      if (searchTerm === "a") {
        setCachedPlants(detailedPlants);
      }

      setPlants(detailedPlants);
    } catch (error) {
      console.error("Error fetching plants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value.trim();
    setSearchQuery(value);

    if (value.length >= 3) {
      fetchPlants(value);
    } else if (value === "") {
      setPlants(cachedPlants);
    }
  };

  return (
    <Container className="garden-hub">
      <Row className="container">
        <h2 className="text-center mb-4">Garden Hub</h2>
        <Col md={8}>
          <Card className="mb-3 shadow-sm">
            <CardBody>
              <Tabs defaultActiveKey="yourPlants" className="mb-3">
                <Tab eventKey="yourPlants" title="Your Plants">
                  <Row>
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <Col key={item} md={6} lg={4} className="mc-3">
                        <Card className="shadow-sm">
                          <Card.Img variant="top" src={placeholderImage} />
                          <Card.Body>
                            <Card.Title>Plant {item}</Card.Title>
                            <Card.Text>
                              Short description or placeholder for Plant {item}.
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Tab>
                <Tab eventKey="gardenVisitors" title="Garden Visitors">
                  <Row>
                    {[1, 2, 3].map((item) => (
                      <Col key={item} md={6} lg={4} className="mc-3">
                        <Card className="shadow-sm">
                          <Card.Img variant="top" src={placeholderImage} />
                          <Card.Body>
                            <Card.Title>Animal {item}</Card.Title>
                            <Card.Text>
                              Short description or placeholder for Animal {item}
                              .
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Tab>
                <Tab eventKey="gardenInsights" title="Garden Insights">
                  <Row>
                    {[1, 2, 3].map((item) => (
                      <Col key={item} md={6} lg={4} className="mc-3">
                        <Card className="shadow-sm">
                          <Card.Img variant="top" src={placeholderImage} />
                          <Card.Body>
                            <Card.Title>How to: {item}</Card.Title>
                            <Card.Text>
                              Short description or placeholder for Skill {item}.
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Search for plants..."
                  aria-label="Search for plants"
                  aria-describedby="search-bar"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="form-control-lg"
                />
                <Button variant="outline-secondary" id="search-bar">
                  Search
                </Button>
              </InputGroup>

              {loading ? (
                <p
                  className="fs-4"
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: "500",
                    color: "#4CAF50",
                  }}
                >
                  Loading plants...
                </p>
              ) : (
                <div>
                  {plants.slice(0, 5).map((plant) => (
                    <div key={plant.pid} className="mb-4 shadow-sm">
                      <Card className="card shadow-sm">
                        <Link
                          to={`/plant-page/${plant.pid}`}
                          className="text-decoration-none"
                        >
                          <p className="card-title">{plant.display_pid}</p>
                          <div className="card-body">
                            {plant.image_url ? (
                              <img
                                src={plant.image_url}
                                alt={plant.display_pid}
                                className="card-img-top"
                                style={{ height: "150px", objectFit: "cover" }}
                              />
                            ) : (
                              <p>No Image Available</p>
                            )}
                          </div>
                        </Link>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GardenHub;
