const commentsRouter = require("express").Router();
const {
  getComments,
  patchCommentVotesById,
  deleteCommentById,
} = require("../controllers/comments.controllers");

commentsRouter.route("/").get(getComments);
commentsRouter
  .route("/:comment_id")
  .patch(patchCommentVotesById)
  .delete(deleteCommentById);

module.exports = commentsRouter;
