const FrApi = require('./base/api/frApi');
const FrRepo = require('./base/repo/frRepo');
const FrService = require('./base/service/frService');

const enumSettings = require('./enums/settings');
const enumSettingsGroup = require('./enums/settingsGroups');

const FrError = require('./error/frError');
const FrErrorCodes = require('./error/errorCodes');

const RequestHelper = require('./helpers/requestHelper');
const Utilities = require('./helpers/utilities');
const ValidationHelper = require('./helpers/validationHelper');
// const RequestHelper = require('./helpers/requestHelper');

module.exports = {
  FrApi,
  FrRepo,
  FrService,
  enumSettings,
  enumSettingsGroup,
  FrError,
  FrErrorCodes,
  RequestHelper,
  Utilities,
  ValidationHelper,
};
