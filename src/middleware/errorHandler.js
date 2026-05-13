function errorHandler(err, req, res, next) {
  const status = err.response?.status || 500;
  const metaError = err.response?.data?.error;

  res.status(status).json({
    success: false,
    error: metaError || { message: err.message, code: status },
  });
}

function asyncWrap(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = { errorHandler, asyncWrap };
