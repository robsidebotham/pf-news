
exports.up = function(knex) {
    //console.log("Creating 'articles' table.");
    return knex.schema.createTable("articles", (articles) => {
        articles.increments("article_id").primary();
        articles.string("title");
        articles.text("body");
        articles.integer("votes").defaultTo(0);
        articles.string("topic");
        articles.foreign("topic").references("topics.slug");
        articles.string("author");
        articles.foreign("author").references("users.username");
        articles.timestamp("created_at", { useTz: false }).defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  //console.log("Removing 'articles' table.");
  return knex.schema.dropTable("articles");
};
