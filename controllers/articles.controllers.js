const { fetchArticleById, updateArticleVotesById, fetchArticles } = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.patchArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotesById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const sort_by = req.query.sort_by || "created_at";
  const order = req.query.order || "desc";
  const author = req.query.author || "";
  const topic = req.query.topic || "";
  fetchArticles(sort_by, order, author, topic)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};