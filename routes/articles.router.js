const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleVotesById,
} = require("../controllers/articles.controllers");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/comments.controllers");

articlesRouter
  .route("/")
  .get(getArticles)
  .all((req, res, next) => {
    next({ code: 405, msg: "Method Not Allowed" });
  });

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotesById)
  .all((req, res, next) => {
    next({ code: 405, msg: "Method Not Allowed" });
  });

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all((req, res, next) => {
    next({ code: 405, msg: "Method Not Allowed" });
  });

module.exports = articlesRouter;
