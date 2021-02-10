const errorCodes = {
  IdNotFound: 'errors.IdNotFound',
  CantDeleted: 'errors.ResourceCantDeleted',
  ResourceAddError: 'errors.resourceAddError',
  ResourceNotFound: 'errors.resourceNotFound',
  BodyNotValid: 'errors.BodyNotValid',
  SmsSendError: 'errors.SmsSendError',
  ResourceAlreadyDeleted: 'errors.resourceAlreadyDeleted',
  IdenticalDocument: 'errors.identicalDocuments',
  TokenRequired: 'errors.tokenRequired',
  BadRequest: 'errors.badRequest',
  ValidationAlreadyAccepted: 'errors.validationAlreadyAccepted',
  PassiveData: 'errors.PassiveData',
  DisallowEmailUpdate: 'errors.disallowEmailUpdate',
  TokenInvalid: 'errors.InvalidToken',
  RequestError: 'errors.RequestError',
  ServerError: 'errors.internalServerError',
  Unauthorized: 'errors.unauthorizedProcess',
  FrozenAccount: 'errors.frozenAccount',
  CreditAccount: 'errors.creditAccount',
  ReadOnlyColumns: 'errors.readOnlyColumns',
};

module.exports = errorCodes;
