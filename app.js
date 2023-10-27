const express = require("express");
const app = express();
const port = 3000;
const path = require("path")
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(express.static('public'));

const config = require("./public/js/config");

const bodyParser = require("body-parser");
const { error } = require("console");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

const secretKey = "1234" 


app.get("/search", (req, res) => {
    res.sendFile(__dirname + "/views/fallback.html")
})

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/Login.html");
});

app.post("/", (req, res) => {
  const email = req.body.email;
  const apikey = req.body.api;

  console.log(email, apikey);

  if(email === config.email && apikey === config.theApiKey) {
    const payload = { apikey };
    const token = jwt.sign(payload, secretKey, {expiresIn: "1h"})

    res.redirect("/search")
  } else {
    // res.status(404).json({message: "tsy mande"})
    res.redirect("/")
  }

});

