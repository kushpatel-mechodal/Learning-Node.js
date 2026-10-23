//dotenv module import
import dotenv from "dotenv";

// express module import
import express from "express";

// create express application
const app = express();

//read dotenv
dotenv.config();

// port no
const port = process.env.PORT;

app.get("/api/products", (req, res) => {
  const product = [
    {
      id: 1,
      modal: "samsung s23",
      price: 45000
    },
    {
      id: 2,
      modal: "samsung s24",
      price: 55000
    },
    {
      id: 3,
      modal: "samsung s26 Ultra",
      price: 150000
    },
  ];
  res.json(product);
});
// run the server
app.listen(port, () => {
  console.log(`Application Run to PORT ${port}`);
});
