const express = require("express");
var mysql = require("mysql");

const app = express();
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

connection.connect();

app.get("/", (req, res) => {
  const { q } = req.query;

  connection.query(
    "SELECT product.id as id, product.name as name, product.url_image as url_image, product.price as price, product.discount as discount, category.name as category FROM product INNER JOIN category ON product.category=category.id" +
      (q ? ` WHERE product.name LIKE '%${q}%'` : ""),
    function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.status(500).json({
          error: "Ha ocurrido un error. Por favor, intenta de nuevo.",
          status: 500,
        });
      } else {
        res.json(rows);
      }
    }
  );
});

const port = 8000;
app.listen(port, () => {
  console.log("Listening on port " + port);
});
