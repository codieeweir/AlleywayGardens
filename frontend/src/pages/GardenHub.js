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

  //external api key, in a mor advnaced system this would not be hard coded, so if developing further, change how this is stored
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

      // fetching data from external API for plant infomration https://open.plantbook.io/docs/
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

  // let user lchange the serach
  const handleSearchChange = (e) => {
    const value = e.target.value.trim();
    setSearchQuery(value);

    if (value.length >= 3) {
      fetchPlants(value);
    } else if (value === "") {
      setPlants(cachedPlants);
    }
  };

  // download file inspiration taken from 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#attr-download' and modified
  const downloadFile = (e) => {
    const fileURL = "/files/NeighbourhoodReachOut.docx";
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = "NeighbourhoodReachOut.docx";
    link.click();
  };

  return (
    <Container className="garden-hub">
      <Row className="container">
        <h2 className="text-center mb-4">Garden Hub</h2>
        <Col md={8}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h4>About Us</h4>
              <p>
                Welcome to the Garden Hub! Our mission is to inspire and support
                Belfast communities in transforming alleyways and shared spaces
                into vibrant green areas. Greening these spaces brings nature
                into urban environments, fosters community connections, and
                creates habitats for local wildlife. Benefits include improved
                mental well-being, reduced litter, and enhanced biodiversity,
                contributing to a healthier and more sustainable city.
              </p>
              <p>
                {" "}
                If you are concerned about your eighbourhoods reaction or
                thoughts on setting up a project, feel free to download out form
                template that you can deliever to your deired neighbours
              </p>
              <button
                onClick={downloadFile}
                className="btn btn-outline-success mt-2"
              >
                {" "}
                Download Your template letter here!
              </button>
            </Card.Body>
          </Card>

          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Tabs defaultActiveKey="yourPlants" className="mb-3">
                <Tab eventKey="yourPlants" title="Local Plants">
                  <Row>
                    <Col md={6} lg={4} className="mb-3">
                      <Card className="shadow-sm">
                        {/* Image and description referenced from 'https://www.jeremybartlett.co.uk/2024/06/10/foxglove-digitalis-purpurea/' */}
                        <Card.Img variant="top" src="/images/Foxglove.png" />
                        <Card.Body>
                          <Card.Title>Foxglove</Card.Title>
                          <Card.Text>
                            A native plant that attracts bees and butterflies,
                            enhancing pollination in your garden.
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} lg={4} className="mb-3">
                      <Card className="shadow-sm">
                        <Card.Img variant="top" src="/images/Primrose.png" />
                        <Card.Body>
                          <Card.Title>Primrose</Card.Title>
                          <Card.Text>
                            Provides early nectar for pollinators emerging in
                            spring, supporting local biodiversity.
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} lg={4} className="mb-3">
                      <Card className="shadow-sm">
                        {/* Image from
                        https://www.ulsterwildlife.org/wildlife-explorer/trees-and-shrubs/bilberry
                        and description from https://www.woodlandtrust.org.uk/about-us/where-we-work/northern-ireland/ */}
                        <Card.Img variant="top" src="/images/Bilberry.png" />
                        <Card.Body>
                          <Card.Title>Bilberry</Card.Title>
                          <Card.Text>
                            provide a vital food source for various animals,
                            including pollinators, birds, and mammals. Their
                            berries are also rich in antioxidants, which play a
                            role in plant defense and can contribute to the
                            overall health of the ecosystem
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab>

                <Tab eventKey="gardenVisitors" title="Garden Visitors">
                  <Row>
                    <Col md={6} lg={4} className="mb-3">
                      <Card className="shadow-sm">
                        {/* Information gathered from https://en.wikipedia.org/wiki/European_robin */}
                        <Card.Img variant="top" src="/images/Robin.png" />
                        <Card.Body>
                          <Card.Title>European Robin</Card.Title>
                          <Card.Text>
                            A familiar garden bird known for its melodic song
                            and presence throughout the year.
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} lg={4} className="mb-3">
                      <Card className="shadow-sm">
                        {/* I have lost my reference for the description facts but the image is referenced from https://www.goodhousekeeping.com/life/pets/g20706693/how-to-care-for-a-pet-hedgehog/ */}
                        <Card.Img variant="top" src="/images/hedgehog.png" />
                        <Card.Body>
                          <Card.Title>Hedgehog</Card.Title>
                          <Card.Text>
                            A nocturnal mammal that helps control garden pests;
                            ensure connectivity between gardens to support their
                            movement.
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} lg={4} className="mb-3">
                      <Card className="shadow-sm">
                        {/* This image and description is from https://carboncopy.eco/initiatives/parliament-buildings-apiary */}
                        <Card.Img variant="top" src="/images/bee.png" />
                        <Card.Body>
                          <Card.Title>Honey Bee</Card.Title>
                          <Card.Text>
                            Honey bees are crucial in Belfast and Northern
                            Ireland for several reasons, primarily due to their
                            pollination role in supporting agriculture and
                            maintaining a healthy environment
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab>

                <Tab eventKey="gardeningTips" title="Gardening Tips">
                  <Row>
                    <Col md={6} lg={4} className="mb-3">
                      <Card className="shadow-sm">
                        {/* Image and description referenced from https://www.sustainableni.org/blog/no-mow-may */}
                        <Card.Img variant="top" src="/images/Nomow.png" />
                        <Card.Body>
                          <Card.Title>No Mow May</Card.Title>
                          <Card.Text>
                            Participate in No Mow May to allow wildflowers to
                            bloom, providing essential nectar for pollinators.
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} lg={4} className="mb-3">
                      <Card className="shadow-sm">
                        {/* image and description referenced from https://www.themakermakes.com/blog/how-to-grow-creeping-thyme-from-seed */}
                        <Card.Img variant="top" src="/images/Thyme.png" />
                        <Card.Body>
                          <Card.Title>Natural Weed Control</Card.Title>
                          <Card.Text>
                            Use ground cover plants like creeping thyme to
                            suppress weeds naturally, reducing the need for
                            chemical herbicides.
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} lg={4} className="mb-3">
                      <Card className="shadow-sm">
                        {/* Images and descripions refereced from 'https://www.groundwork.org.uk/how-to-create-a-rain-garden-planter/' */}
                        <Card.Img variant="top" src="/images/planter.png" />
                        <Card.Body>
                          <Card.Title>Rain Garden Planters</Card.Title>
                          <Card.Text>
                            Rain garden planters provide habitats for insects
                            and wildlife, capture excess rainwater to prevent
                            flooding and filter out pollutants to keep our water
                            clean!
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab>
              </Tabs>
            </Card.Body>
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
