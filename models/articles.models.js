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
      return { article: articles[0] };
    });
};
