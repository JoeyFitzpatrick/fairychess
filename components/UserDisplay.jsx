import React from "react";
import Card from "react-bootstrap/Card";

const anonymousCard = () => {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>Anonymous</Card.Title>
        <Card.Text>Rating: </Card.Text>
      </Card.Body>
    </Card>
  );
};

const userCard = ({ user, data }) => {
  <div>{JSON.stringify(data)}</div>;
};

const UserDisplay = ({ user, data }) => {
  return data ? (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{data?.name}</Card.Title>
        <Card.Text>Rating: {data?.rating}</Card.Text>
      </Card.Body>
    </Card>
  ) : (
    anonymousCard()
  );
};

export default UserDisplay;
