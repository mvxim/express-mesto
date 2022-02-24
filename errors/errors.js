const BAD_REQUEST_ERROR = 400;
const UNAUTHORIZED_ERROR = 401;
const NOT_FOUND_ERROR = 404;
const DEFAULT_ERROR = 500;

const handleError = (error, res) => {
  switch (error.name) {
    case 'ValidationError':
      res.status(BAD_REQUEST_ERROR).send({ message: `${error.name}: ${error.message}` });
      break;
    case 'CastError':
      res.status(NOT_FOUND_ERROR).send({ message: `${error.name}: ${error.message}` });
      break;
    default:
      res.status(DEFAULT_ERROR).send({
        message: `${error.name} — беда на сервере`,
        error: error.message,
      });
      break;
  }
};

module.exports = {
  BAD_REQUEST_ERROR,
  UNAUTHORIZED_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  handleError,
};
