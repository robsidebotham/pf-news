const {
  addCommentByArticleId,
  fetchCommentsByArticleId,
  updateCommentVotesById,
  fetchComments,
  removeCommentById,
} = require("../models/comments.models");

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  addCommentByArticleId(article_id, username, body)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const sort_by = req.query.sort_by || "created_at";
  const order = req.query.order || "desc";
  fetchCommentsByArticleId(article_id, sort_by, order)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch(next);
};

exports.patchCommentVotesById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentVotesById(comment_id, inc_votes || 0)
    .then((comment) => {
      res.status(200).send(comment);
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  fetchComments()
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
