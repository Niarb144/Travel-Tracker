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
db.query("SELECT country_code FROM visited_countries", (err,res) => {
  if(err){
    console.error("Error executing query", err.stack);
  }else{
    country = res.rows;
  }
  db.end();
});

let country = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  function displayCountryCodes(array) {
    const countries = array
      .filter(item => item.hasOwnProperty('country_code'))
      .map(item => item.country_code);
  
      res.render("index.ejs", {countries, total : countries.length});
    console.log(countries);
  }
  displayCountryCodes(country);
  
  
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
