const GenericRepository = require('./baseRepository');
const Validator = require('../helpers/validator');
const Helpers = require('../helpers/helpers');
const { KuryemError, ErrorCodes } = require('./error/kuryemError');
const AWS = require('aws-sdk');

const kuryemGenericService = {
  read: async ({ db, id = null, tableName = null, user = null } = {}) => {
    let where = { _id: id };

    const resource = await GenericRepository.findOneBy(
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
  } = {}) => {
    if (schema !== {}) {
      let { valid, ajv } = Validator.validateBodyBySchema(body, schema);
      if (!valid) {
        throw new KuryemError({
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
      GenericRepository: GenericRepository,
      resource: body,
      user: user,
      tableName: tableName,
      body: body,
      _resource: body,
    };

    let resource = body;

    if (beforeCreate !== []) {
      resource = await Helpers.runFunctionPool(beforeCreate, pipelineParams);
    }

    resource = await GenericRepository.create(
      db,
      tableName,
      resource,
      user._id
    );

    if (afterCreate !== []) {
      resource = await Helpers.runFunctionPool(afterCreate, pipelineParams);
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
        throw new KuryemError({
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
    let resource = await GenericRepository.findOneBy(
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
      throw new KuryemError({
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
      GenericRepository: GenericRepository,
      resource: updatedResource,
      user: user,
      tableName: tableName,
      body: body,
      _resource: _resource,
    };

    if (beforeUpdate !== [] && beforeUpdate.length > 0) {
      resource = await Helpers.runFunctionPool(beforeUpdate, pipelineParams);
    }

    // update sys with user and dates
    resource = await GenericRepository.update(
      db,
      tableName,
      updatedResource,
      user._id
    );

    if (afterUpdate !== [] && afterUpdate.length > 0) {
      resource = await Helpers.runFunctionPool(afterUpdate, pipelineParams);
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

    let resource = await GenericRepository.findOneBy(
      db,
      where,
      undefined,
      tableName,
      true
    );

    const pipelineParams = {
      db: db,
      GenericRepository: GenericRepository,
      resource: resource,
      user: user,
      tableName: tableName,
      _resource: resource,
    };

    if (beforeDelete !== []) {
      resource = await Helpers.runFunctionPool(beforeDelete, pipelineParams);
    }

    await GenericRepository.delete(db, tableName, resource, user._id);

    if (afterDelete !== []) {
      resource = await Helpers.runFunctionPool(afterDelete, pipelineParams);
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
    let result = await GenericRepository.query(
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

module.exports = kuryemGenericService;
