const commentsRouter = require("express").Router();
const {
  getComments,
  patchCommentVotesById,
  deleteCommentById,
} = require("../controllers/comments.controllers");

commentsRouter
  .route("/")
  .get(getComments)
  .all((req, res, next) => {
    next({ code: 405, msg: "Method Not Allowed" });
  });
commentsRouter
  .route("/:comment_id")
  .patch(patchCommentVotesById)
  .delete(deleteCommentById)
  .all((req, res, next) => {
    next({ code: 405, msg: "Method Not Allowed" });
  });

module.exports = commentsRouter;
