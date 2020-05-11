exports.send404 = (req, res, next) => {
  res.status(404).send({ msg: "Resource Not Found" });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  const { code } = err;
  const errLookup = {
    "23503": { statuscode: 404, msg: "Bad Request" },
    "42703": { statuscode: 400, msg: "Bad Request" },
    "22P02": { statuscode: 400, msg: "Bad Request" },
    "23502": { statuscode: 400, msg: "Bad Request" },
  };
  if (Object.keys(errLookup).includes(code)) {
    res.status(errLookup[code].statuscode).send({ msg: errLookup[code].msg });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  const { code, msg } = err;
  if (code) {
    res.status(code).send({ msg: msg });
  } else {
    next(err);
  }
};

exports.handleInternalErrors = (err, req, res, next) => {
  console.log("Unhandled Error: ", err);
  res.status(500).send({ msg: "Internal Server Error" });
};
