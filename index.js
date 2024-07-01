import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user : "postgres",
  host : "localhost",
  database : "world",
  password : "Ted123",
  port : "5432"
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log(result.rows);
  res.render("index.ejs", {countries : countries, total : countries.length});
  db.end();
});

app.post("/add", async (req, res) => {
  let countryName = req.body.country;
  console.log(countryName);

  const check_country = await db.query("SELECT country_code FROM countries WHERE country_name = $1", [countryName]);
   console.log(check_country);
   res.render("index.ejs");
   db.end();
  // const input = await db.query("INSERT INTO visited_countries(country_code) VALUES($A)", [input_country]);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
