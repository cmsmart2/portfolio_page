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

module.exports = routes;