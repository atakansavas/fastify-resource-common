const ErrorCodes = require('./errorCodes');

function KuryemError({
  message = '',
  code = 'errors.internalError',
  status = 500,
  context = {},
} = {}) {
  this.name = 'KuryemError';
  this.message = message;
  this.code = code;
  this.status = status;
  this.context = context;
  const error = new Error(this.errMsg);
  error.name = this.name;
}
KuryemError.prototype = Object.create(Error.prototype);
module.exports = { KuryemError, ErrorCodes };
