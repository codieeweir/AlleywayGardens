import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import "./../styles/ProjectPage.css";
import ForumPostPreviews from "../components/ForumImagesPreviews";
import { CardBody, CardTitle } from "react-bootstrap";
import { Container, Row, Col, Card, Tab, Tabs } from "react-bootstrap";

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/posts/")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching Posts :", error));

    // Fetch users to link with posts and provide id for the username links to profile
    fetch("http://127.0.0.1:8000/api/users/")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching User :", error));
  }, []);

  return (
    <section className="forum bg-light py-5">
      <Container className="container mt-5">
        <h2 className="mb-4 text-center">Alleyway Gardens Community Forum!</h2>

        <div className="text-center mb-4">
          <Link to={`/create-post`}>
            <button className="btn btn-success btn-lg">Create A Post</button>
          </Link>
        </div>
        <Row className="justify-content-center">
          <Col md={10}>
            {posts.map((post) => {
              const user = users.find((user) => user.id === post.user);
              const timeago = formatDistanceToNow(new Date(post.created), {
                addSuffix: true,
              });
              return (
                <Card
                  key={post.id}
                  style={{ backgroundColor: "#f5f8f6" }}
                  className="mb-4 shadow-sm border-0"
                >
                  <CardBody>
                    <CardTitle className="mb-2">
                      <Link
                        to={`/forum-post/${post.id}`}
                        className="text-dark text-decoration-none"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>

                    <Card.Subtitle className="mb-3 text-muted small">
                      Posted By{"  "}
                      <Link
                        to={`/profile/${post.user}`}
                        className="text-decoration-non text-success fw-semibold"
                      >
                        {" "}
                        @{user ? user.username : "Unknown"}{" "}
                      </Link>
                      {""}. {timeago}
                    </Card.Subtitle>
                    <div
                      className="rounded p-3"
                      style={{ backgroundColor: "#e0ece4" }}
                    >
                      <p className="mb-2">{post.body}</p>
                      <ForumPostPreviews postId={post.id} />
                    </div>

                    <div className="mt-3">
                      <span>
                        💬 {post.comments.length} Comment{" "}
                        {post.comments.length !== 1 && "s"}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Forum;
