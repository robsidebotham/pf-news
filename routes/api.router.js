const apiRouter = require("express").Router();
const topicsRouter = require("./topics.router");
const usersRouter = require("./users.router");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");

const endPointDetails = {
  endpoints: [
    {
      method: "GET",
      path: "/api/topics",
      description: "Retrieves all topics.",
    },
    {
      method: "GET",
      path: "/api/users/:username",
      description: "Retrieves user details by the specified username.",
    },
    {
      method: "GET",
      path: "/api/articles/:article_id",
      description: "Retrieves article details by the specified article id.",
    },
    {
      method: "PATCH",
      path: "/api/articles/:article_id",
      description: "Increases the number of votes for the specified article.",
    },
    {
      method: "POST",
      path: "/api/articles/:article_id/comments",
      description: "Posts a new comment against the specified article id.",
    },
    {
      method: "GET",
      path: "/api/articles/:article_id/comments",
      description: "Retrieves all comments for a given article.",
    },
    {
      method: "GET",
      path: "/api/articles",
      description: "Retrieves all articles.",
    },
    {
      method: "PATCH",
      path: "/api/comments/:comment_id",
      description: "Increases the number of votes for the specified comment.",
    },
    {
      method: "DELETE",
      path: "/api/comments/:comment_id",
      description: "Deletes the specified comment.",
    },
  ],
};

apiRouter
  .route("/")
  .get((req, res) => {
    res.status(200).send(endPointDetails);
  })
  .all((req, res, next) => {
    next({ code: 405, msg: "Method Not Allowed" });
  });
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
