const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics.controllers");

topicsRouter
  .route("/")
  .get(getTopics)
  .all((req, res, next) => {
    next({ code: 405, msg: "Method Not Allowed" });
  });

module.exports = topicsRouter;
