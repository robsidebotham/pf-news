const express = require("express");
const app = express();
const apiRouter = require("./routes/api.router");
const { send404, handlePSQLErrors, handleCustomErrors, handleInternalErrors } = require("./error_handlers");

app.use(express.json());
app.use("/api", apiRouter);

app.use(send404);
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalErrors);



module.exports = app;

