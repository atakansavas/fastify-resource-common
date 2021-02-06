const frError = require('../error/frError');
const ErrorCodes = require('../error/errorCodes');
const { ObjectId } = require('mongodb');

const utilities = {
  capitalizeString: (string) => {
    const capitalize = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return string.split(' ').map(capitalize).join(' ');
  },

  makeObjectId: (_id) => {
    if (_id instanceof ObjectId) {
      return _id;
    } else if (ObjectId.isValid(_id)) {
      return ObjectId(_id);
    } else {
      return _id;
    }
  },

  // * Hides system params in db document
  hideSystemProps: (document) => {
    delete document['_is_active'];
    delete document['is_active'];

    return document;
  },

  getRandomInt: (min, max) => {
    const _min = Math.ceil(min);
    const _max = Math.floor(max);
    return Math.floor(Math.random() * (_max - _min) + _min); //The maximum is exclusive and the minimum is inclusive
  },

  normalizeArrayIds: (where) => {
    return where.map((item) => {
      return utilities.normalizeIds(item);
    });
  },

  normalizeIds: (where) => {
    if (!where) {
      return where;
    }

    if (Array.isArray(where)) {
      //* or kullanimlari icin
      return utilities.normalizeArrayIds(where);
    }

    if (where['_id']) {
      if (where['_id'] instanceof Object && '$in' in where['_id']) {
        let _ids = [];

        where['_id']['$in'].forEach((id) => {
          _ids.push(utilities.makeObjectId(id));
        });

        where['_id']['$in'] = _ids;
      } else if (typeof where['_id'] === 'string') {
        where['_id'] = utilities.makeObjectId(where['_id']);
      }
    }

    if (where['user_id']) {
      where['user_id'] = utilities.makeObjectId(where['user_id']);
    }

    if (where['parent_id']) {
      where['parent_id'] = utilities.makeObjectId(where['parent_id']);
    }

    if (where['_meta.user_id']) {
      where['_meta.user_id'] = utilities.makeObjectId(where['_meta.user_id']);
    }

    if (where['_meta.created_by']) {
      where['_meta.created_by'] = utilities.makeObjectId(
        where['_meta.created_by']
      );
    }

    if (where['_meta.modified_by']) {
      where['_meta.modified_by'] = utilities.makeObjectId(
        where['_meta.modified_by']
      );
    }

    if (where['_meta.deleted_by']) {
      where['_meta.deleted_by'] = utilities.makeObjectId(
        where['_meta.deleted_by']
      );
    }

    return where;
  },
  preProcessWhere: (where) => {
    const objectWithoutOr = Object.keys(where).filter(
      (item) => !item.includes('$or')
    );

    const keysWithoutOr = objectWithoutOr.map((item) => {
      return {
        [item]: where[item],
      };
    });

    keysWithoutOr.push({
      $or: utilities.normalizeIds(where['$or']),
    });

    let normalizedWhere = utilities.normalizeIds(keysWithoutOr);
    return normalizedWhere;

    // let whereClause = { $and: [...normalizedWhere] };

    // if (where['$or']) {
    //   const orKeys = where['$or'];
    //   let orClause = orKeys.forEach((item) => {
    //     return utilities.normalizedWhere(item);
    //   });

    //   whereClause['$and'] = { ...whereClause['$and'], $or: orClause };
    // }

    // return whereClause;
  },
  runFunctionPool: async (functions, params) => {
    let resource = params.resource;
    if (!resource) {
      throw new frError({
        message: 'Resource must be in parameters',
        code: 'errors.internalError',
        status: 500,
      });
    }

    for (let func of functions) {
      if (func.constructor.name == 'AsyncFunction') {
        params.resource = await func(params);
      } else {
        params.resource = func(params);
      }
    }

    return params.resource;
  },
  runReadFormatter: (functions, resource) => {
    for (let func of functions) {
      resource = func(resource);
    }
    return resource;
  },
};

module.exports = utilities;
