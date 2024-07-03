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
  
});

app.post("/add", async (req, res) => {
  let countryName = req.body.country;
  console.log(countryName);

  const check_country = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE $1;", [`%${countryName.toLowerCase()}%`]);

    let new_country_code;
    check_country.rows.forEach((country) => {
      new_country_code = country.country_code;
  });
   console.log(new_country_code);

   const check_code = await db.query("SELECT * FROM visited_countries");
   let checked_code;
   check_code.rows.forEach((country) => {
      checked_code = country.country_code;
   });
   console.log(checked_code);

   if(checked_code !== new_country_code){
    try{
      const insert_country = await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)" , [new_country_code]);
      res.redirect("/");
     }
     catch(err){
      console.error('Error fetching data:', err);
      // Redirect to the home page with an error message
      res.redirect(`/?error=${encodeURIComponent('Failed to fetch data')}`);
     }
   }
   else if(checked_code == new_country_code){
    res.redirect(`/?error=${encodeURIComponent('Country Already Added')}`);
   }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
