const connection = require("../db/connection");
const { fetchArticleById } = require("../models/articles.models");

exports.addCommentByArticleId = (article_id, username, body) => {
  return connection
    .returning("*")
    .insert({ author: username, body: body, article_id: article_id })
    .into("comments")
    .then((comments) => {
      return { comment: comments[0] };
    });
};

exports.fetchCommentsByArticleId = (article_id, sort_by, order) => {
  return fetchArticleById(article_id)
    .then(() => {
      return connection
        .select("comment_id", "votes", "created_at", "author", "body")
        .from("comments")
        .where("article_id", article_id)
        .orderBy(sort_by, order);
    })
    .then((comments) => {
      if (comments.length === 0) {
        return { comments: [] };
      }
      return { comments: comments };
    });
};

exports.updateCommentVotesById = (comment_id, inc_votes) => {
  return connection
    .returning("*")
    .where("comment_id", comment_id)
    .increment("votes", inc_votes)
    .into("comments")
    .then((comments) => {
      if (comments.length === 0) {
        return Promise.reject({ code: 400, msg: "Comment Not Found" });
      }
      return { comment: comments[0] };
    });
};

exports.fetchComments = () => {
  return connection
    .select("*")
    .from("comments")
    .then((comments) => {
      if (comments.length === 0) {
        return Promise.reject({ code: 404, msg: "Comments Not Found" });
      }
      return { comments };
    });
};

exports.removeCommentById = (comment_id) => {
  return connection
    .select("*")
    .from("comments")
    .then((comments) => {
      let commentExists = false;
      comments.forEach((comment) => {
        if (comment.comment_id == comment_id) {
          commentExists = true;
        }
      });
      if (commentExists) {
        return connection
          .where("comment_id", comment_id)
          .del()
          .from("comments");
      }
      return Promise.reject({ code: 404, msg: "Comment Not Found" });
    });
};
