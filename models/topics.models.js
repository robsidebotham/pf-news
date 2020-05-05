const connection = require("../db/connection"); //invokes the connection by passing dbConfig into knex()

exports.fetchTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .then((topics) => {
      return { topics };
    });
};
