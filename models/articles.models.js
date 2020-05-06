const connection = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return connection
    .select("articles.*")
    .count("comments.article_id as comment_count")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id")
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.reject({ code: 404, msg: "Article Not Found" });
      }
      corrArticles = articles.map(article => {
        article.comment_count = parseInt(article.comment_count);
        return article;
      });
      return { article: articles[0] };
    });
};

exports.updateArticleVotesById = (article_id, inc_votes) => {
  return connection
    .returning("*")
    .where("article_id", article_id)
    .increment("votes", inc_votes)
    .into("articles")
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.reject({ code: 404, msg: "Article Not Found" });
      }
      return { article: articles[0] };
    });
};

exports.fetchArticles = (sort_by, order, author, topic) => {
  const filterFunction = (query, field, value) => {
    if (value !== "") {
      if (field === "author") {
        query.where("articles.author", value);
      } else if (field === "topic") {
        query.where("articles.topic", value);
      }
    }
  };
  return connection
    .select("articles.article_id", "articles.title", "articles.votes", "articles.topic", "articles.author", "articles.created_at")
    .count("comments.article_id as comment_count")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .modify(filterFunction, "author", author)
    .modify(filterFunction, "topic", topic)
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.reject({ code: 404, msg: "Article Not Found" });
      }
      corrArticles = articles.map(article => {
        article.comment_count = parseInt(article.comment_count);
        return article;
      });
      return { articles: corrArticles };
    });
};
