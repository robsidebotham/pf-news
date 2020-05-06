const articlesRouter = require("express").Router();
const { getArticles, getArticleById, patchArticleVotesById } = require("../controllers/articles.controllers");
const { getCommentsByArticleId, postCommentByArticleId } = require("../controllers/comments.controllers");

articlesRouter.route("/").get(getArticles);
articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticleVotesById);
articlesRouter.route("/:article_id/comments").get(getCommentsByArticleId).post(postCommentByArticleId);

module.exports = articlesRouter;
