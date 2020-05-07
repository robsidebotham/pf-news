exports.up = function (knex) {
  //console.log("Creating 'topics' table.");
  return knex.schema.createTable("topics", (topics) => {
    topics.string("slug").primary();
    topics.string("description");
    topics.unique("slug");
  });
};

exports.down = function (knex) {
  //console.log("Removing 'topics' table.");
  return knex.schema.dropTable("topics");
};
