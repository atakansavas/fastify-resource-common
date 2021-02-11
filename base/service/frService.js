const moment = require('moment');
const { ObjectId } = require('mongodb');

const FrRepo = require('../repo/frRepo');
const Validator = require('../../helpers/validationHelper');
const Utilities = require('../../helpers/utilities');
const frError = require('../../error/frError');
const ErrorCodes = require('../../error/errorCodes');
const Enums = require('../../enums/index');

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
    settings = {},
    token = '',
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

    if (settings.ReadOnlyColumns) {
      let whereClause = [];
      for (let i = 0; i < settings.ReadOnlyColumns.length; i++) {
        const key = settings.ReadOnlyColumns[i];
        let keyObject = {};
        keyObject[key] = body[key];
        whereClause.push(keyObject);
      }
      const where = {
        $or: [...whereClause],
      };

      let result = await FrRepo.query(
        where,
        {},
        null,
        null,
        null,
        db,
        tableName,
        token
      );

      if (result.items.length > 0) {
        throw new frError({
          message: 'Read only columns cant be duplicated.',
          code: ErrorCodes.ReadOnlyColumns,
          status: 409,
          context: {
            provided: settings.ReadOnlyColumns,
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
      token: token,
    };

    let resource = body;

    if (
      !body.user_id &&
      settings.IsUser &&
      user.userType == Enums.UserTypes.User.value.Id
    ) {
      resource.user_id = ObjectId(user._id.toString());
      if (!body.user_parent_id && !!user.parent.parentId) {
        resource.user_parent_id = ObjectId(user.parent.parentId.toString());
      }
    }

    if (
      !body.courier_id &&
      settings.IsCourier &&
      user.userType == Enums.UserTypes.Courier.value.Id
    ) {
      resource.courier_id = ObjectId(user._id.toString());
      if (!body.courier_parent_id && !!user.parent.parentId) {
        resource.courier_parent_id = ObjectId(user.parent.parentId.toString());
      }
    }

    const unix = moment().unix();
    const metaObject = {
      created_at: unix,
      created_at_string: moment.unix(unix).format(),
      created_by_id: user._id,
      created_by: user.name + ' ' + user.lastName,
      is_deleted: false,
    };

    resource['_meta'] = metaObject;

    if (beforeCreate !== []) {
      resource = await Utilities.runFunctionPool(beforeCreate, pipelineParams);
    }

    resource = await FrRepo.create(db, tableName, resource);

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
    settings = {},
    token = '',
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

    if (settings.ReadOnlyColumns) {
      const bodyKeys = [...Object.keys(body), '_id', '_meta'];
      for (let i = 0; i < settings.ReadOnlyColumns.length; i++) {
        const key = settings.ReadOnlyColumns[i];
        if (
          bodyKeys.indexOf(key) > -1 &&
          resource[key] != updatedResource[key]
        ) {
          throw new frError({
            message: 'Read only columns cant be updated.',
            code: ErrorCodes.ReadOnlyColumns,
            status: 409,
            context: {
              provided: settings.ReadOnlyColumns,
            },
          });
        }
      }
    }

    const unix = moment().unix();
    const metaObject = {
      modified_at: unix,
      modified_at_string: moment.unix(unix).format(),
      modified_by_id: user._id,
      modified_by: user.name + ' ' + user.lastName,
    };

    resource['_meta'] = { ...resource['_meta'], ...metaObject };

    const pipelineParams = {
      db: db,
      Repo: FrRepo,
      resource: updatedResource,
      user: user,
      tableName: tableName,
      body: body,
      _resource: _resource,
      token: token,
    };

    if (beforeUpdate !== [] && beforeUpdate.length > 0) {
      resource = await Utilities.runFunctionPool(beforeUpdate, pipelineParams);
    }

    resource = await FrRepo.update(db, tableName, updatedResource);

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
    token = '',
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
      token: token,
    };

    const unix = moment().unix();
    const metaObject = {
      is_deleted: true,
      deleted_at: unix,
      deleted_at_string: moment.unix(unix).format(),
      deleted_by: user.name + ' ' + user.lastName,
      deleted_by_id: userId,
    };

    resource['_meta'] = { ...resource['_meta'], ...metaObject };

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
    where = {},
    select = {},
    limit = 0,
    page = 0,
    sort = null,
    tableName = null,
    user = null,
    settings = {},
    token = '',
  } = {}) => {
    let _where = {
      ...where,
      status: true,
    };

    let result = await FrRepo.query(
      _where,
      select,
      limit,
      page,
      sort,
      db,
      tableName,
      token
    );
    return result;
  },

  partial: async ({
    db,
    where = {},
    select = {},
    limit = 0,
    page = 0,
    sort = null,
    tableName = null,
    user = null,
    settings = {},
    token = '',
  } = {}) => {
    let _where = {
      ...where,
      status: true,
    };

    if (user.userType == Enums.UserTypes.User.value.Id) {
      _where['$or'] = [{ user_parent_id: user._id }, { user_id: user._id }];
    } else if (user.userType == Enums.UserTypes.Courier.value.Id) {
      _where['$or'] = [
        { courier_parent_id: user._id },
        { courier_id: user._id },
      ];
    }

    let result = await FrRepo.query(
      _where,
      select,
      limit,
      page,
      sort,
      db,
      tableName,
      token
    );
    return result;
  },
};

module.exports = FrService;
