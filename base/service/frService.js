const FrRepo = require('../repo/frRepo');
const Validator = require('../../helpers/validationHelper');
const Utilities = require('../../helpers/utilities');
const frError = require('../../error/frError');
const ErrorCodes = require('../../error/errorCodes');

const FrService = {
  read: async ({ db, id = null, tableName = null, user = null } = {}) => {
    let where = { _id: id };

    const resource = await FrRepo.findOneBy(
      db,
      where,
      undefined,
      tableName,
      true
    );

    return resource;
  },
  create: async ({
    db,
    body = {},
    schema = {},
    beforeCreate = [],
    afterCreate = [],
    tableName = null,
    user = null,
    isUseMeService = false,
  } = {}) => {
    if (schema !== {}) {
      let { valid, ajv } = Validator.validateBodyBySchema(body, schema);
      if (!valid) {
        throw new frError({
          message: 'Provided body is invalid',
          code: ErrorCodes.BadRequest,
          status: 400,
          context: {
            providedBody: body,
            message: ajv.errorsText(ajv.errors, {
              dataVar: 'body',
            }),
            errors: ajv.errors,
          },
        });
      }
    }

    const pipelineParams = {
      db: db,
      Repo: FrRepo,
      resource: body,
      user: user,
      tableName: tableName,
      body: body,
      _resource: body,
    };

    let resource = body;

    if (isUseMeService) {
      resource.user_id = user._id;
    }

    if (beforeCreate !== []) {
      resource = await Utilities.runFunctionPool(beforeCreate, pipelineParams);
    }

    resource = await FrRepo.create(db, tableName, resource, user._id);

    if (afterCreate !== []) {
      resource = await Utilities.runFunctionPool(afterCreate, pipelineParams);
    }

    return resource;
  },
  update: async ({
    db,
    _id = null,
    body = {},
    schema = {},
    beforeUpdate = [],
    afterUpdate = [],
    tableName = null,
    user = null,
  } = {}) => {
    if (schema !== {}) {
      let { valid, ajv } = Validator.validateBodyBySchema(body, schema);
      if (!valid) {
        throw new frError({
          message: 'Provided body is invalid',
          code: ErrorCodes.BodyNotValid,
          status: 400,
          context: {
            providedBody: body,
            essage: ajv.errorsText(ajv.errors, {
              dataVar: 'body',
            }),
            errors: ajv.errors,
          },
        });
      }
    }

    let where = { _id: _id };
    let resource = await FrRepo.findOneBy(
      db,
      where,
      undefined,
      tableName,
      true
    );

    let _resource = resource;

    let updatedResource = {
      ...resource,
      ...body,
    };

    if (JSON.stringify(updatedResource) === JSON.stringify(_resource)) {
      throw new frError({
        message: 'Identical document error',
        code: ErrorCodes.IdenticalDocument,
        status: 409,
        context: {
          provided: body,
          updated: updatedResource,
        },
      });
    }

    const pipelineParams = {
      db: db,
      Repo: FrRepo,
      resource: updatedResource,
      user: user,
      tableName: tableName,
      body: body,
      _resource: _resource,
    };

    if (beforeUpdate !== [] && beforeUpdate.length > 0) {
      resource = await Utilities.runFunctionPool(beforeUpdate, pipelineParams);
    }

    resource = await FrRepo.update(db, tableName, updatedResource, user._id);

    if (afterUpdate !== [] && afterUpdate.length > 0) {
      resource = await Utilities.runFunctionPool(afterUpdate, pipelineParams);
    }

    return resource;
  },
  delete: async ({
    db,
    _id = null,
    beforeDelete = [],
    afterDelete = [],
    tableName = null,
    user = null,
  } = {}) => {
    let where = { _id: _id };

    let resource = await FrRepo.findOneBy(
      db,
      where,
      undefined,
      tableName,
      true
    );

    const pipelineParams = {
      db: db,
      Repo: FrRepo,
      resource: resource,
      user: user,
      tableName: tableName,
      _resource: resource,
    };

    if (beforeDelete !== []) {
      resource = await Utilities.runFunctionPool(beforeDelete, pipelineParams);
    }

    await FrRepo.delete(db, tableName, resource, user._id);

    if (afterDelete !== []) {
      resource = await Utilities.runFunctionPool(afterDelete, pipelineParams);
    }

    return resource;
  },
  filter: async ({
    db,
    where = where,
    select = {},
    limit = 0,
    page = 0,
    sort = null,
    tableName = null,
    user = null,
  } = {}) => {
    let result = await FrRepo.query(
      where,
      select,
      limit,
      page,
      sort,
      db,
      tableName
    );
    return result;
  },
};

module.exports = FrService;
