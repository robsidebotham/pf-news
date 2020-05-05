
exports.up = function(knex) {
    //console.log("Creating 'comments' table.");
    return knex.schema.createTable("comments", (comments) => {
        comments.increments("comment_id").primary();
        comments.string("author");
        comments.foreign("author").references("users.username");
        comments.integer("article_id");
        comments.foreign("article_id").references("articles.article_id");
        comments.integer("votes").defaultTo(0);
        comments.timestamp("created_at", { useTz: false }).defaultTo(knex.fn.now());
        comments.text("body");
    });
};

exports.down = function(knex) {
    //console.log("Removing 'comments' table.");
    return knex.schema.dropTable("comments");
};
