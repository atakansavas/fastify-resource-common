const FrApi = require('./base/api/frApi');
const FrRepo = require('./base/repo/frRepo');
const FrService = require('./base/service/frService');

const Enum = require('./enums/index');

const FrError = require('./error/frError');
const FrErrorCodes = require('./error/errorCodes');

const RequestHelper = require('./helpers/requestHelper');
const Utilities = require('./helpers/utilities');
const ValidationHelper = require('./helpers/validationHelper');
// const RequestHelper = require('./helpers/requestHelper');

const TableNames = require('./config/tableNames');

module.exports = {
  FrApi,
  FrRepo,
  FrService,
  Enum,
  FrError,
  FrErrorCodes,
  RequestHelper,
  Utilities,
  ValidationHelper,
  TableNames,
};
