const express = require("express");
const exphbs = require("express-handlebars");
const app = express();

app.listen(3000, () => {console.log("I'm listening...")});

app.engine("handlebars", exphbs());
app.set('view engine', "handlebars");

app.use(express.static(__dirname + "/public"));
app.use(express.json());

app.use(express.urlencoded({
    extended: true
  }))

app.get("/", (req, res) => {

    res.render('index', {});

})

app.post("/submit", (req, res) => {
    console.log(req.body);
})