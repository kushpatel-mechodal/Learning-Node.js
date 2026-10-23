require("dotenv").config(); //import dotenv package and config() read the .env file

const express = require("express"); //import express package

const app = express(); //create express application
const port = process.env.PORT; //get the port from .env file

const data = {
  username: "kush patel",
  age: 23,
  profession: "PHP and Mern Stack developer"
};

// this is a route
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/user", (req, res) => {
  res.send("User Logged in");
});

//pass the json data to this route
app.get("/myData", (req, res) => {
  res.json(data);
});

// listend or run the server
app.listen(port, () => {
  console.log(`✅ Application is running on http://localhost:${port}`);
});
