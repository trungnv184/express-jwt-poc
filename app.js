const { request } = require("express");
const express = require("express");
const jwt = require("jsonwebtoken");

// TODO: Start API Call using nodemon pacakge
// nodemon app.js

const app = express();

app.set("port", process.env.PORT || 5000);

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Welcome to the api",
  });
});

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Post created...",
        authData,
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  // Mock user
  const user = {
    id: 1,
    userName: "brad",
    email: "brad@gmail.com",
  };

  jwt.sign({ user: user }, "secretKey", { expiresIn: "30s" }, (err, token) => {
    res.json({
      token,
    });
  });
});

// FORMAT TOKEN
// Authoriation: Bearer < access_token>
// Verify Token

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");

    // Get The token
    const bearerToken = bearer[1];
    req.token = bearerToken;

    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

app.listen(app.get("port"), () => console.log("Server started on port 5000"));
