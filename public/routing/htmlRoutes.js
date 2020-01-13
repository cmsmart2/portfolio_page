const Router = require("express").Router;

const routes = new Router();

routes.get("/", async (req, res) => {

  res.render("index", {});
});

routes.get("/contact", async (req, res) => {
  res.render("contact", {});
});

routes.get("/portfolio", async (req, res) => {
    res.render("portfolio", {});
  });
// Render 404 page for any unmatched routes
routes.get("*", async (req, res) => {
  res.render("404");
});

module.exports = routes;