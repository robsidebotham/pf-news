
exports.up = function(knex) {
    //console.log("Creating 'users' table.");
    return knex.schema.createTable("users", (users) => {
        users.string("username").primary();
        users.string("avatar_url");
        users.string("name");
        users.unique("username");
    });
};

exports.down = function(knex) {
    //console.log("Removing 'users' table.");
    return knex.schema.dropTable("users");
};
