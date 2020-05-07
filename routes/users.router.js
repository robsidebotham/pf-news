const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users.controllers");

usersRouter.route("/").all((req, res, next) => {
  next({ code: 405, msg: "Method Not Allowed" });
});

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all((req, res, next) => {
    next({ code: 405, msg: "Method Not Allowed" });
  });

module.exports = usersRouter;
