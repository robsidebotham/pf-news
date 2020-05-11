const connection = require("../db/connection"); //invokes the connection by passing dbConfig into knex()

exports.fetchTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .then((topics) => {
      if (topics.length === 0) {
        return Promise.reject({ code: 404, msg: "Topics Not Found" });
      }
      return { topics };
    });
};

exports.fetchTopicBySlug = (slug) => {
  return connection
    .select("*")
    .from("topics")
    .where("slug", slug)
    .then((topics) => {
      if (topics.length === 0) {
        return Promise.reject({ code: 404, msg: "Topic Not Found" });
      }
      return { topic: topics[0] };
    });
};

