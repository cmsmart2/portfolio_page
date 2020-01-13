const express = require("express");
const routes = require("./public/routing/htmlRoutes.js");
const PORT = process.env.PORT || 8080;
const path = require("path")
const app = express();

app.use(express.static(path.join(__dirname, '/public')))



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(routes);


app.listen(PORT, function() {
 
  console.log("Server listening on: http://localhost:" + PORT);
});