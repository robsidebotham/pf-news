const connection = require("../db/connection");

exports.fetchUserByUsername = (username) => {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .then((users) => {
      if (users.length === 0) {
        return Promise.reject({ code: 404, msg: "User Not Found" });
      }
      return { user: users[0] };
    });
};
