const { frError, ErrorCodes } = require('../error/frError');
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

  normalizeIds: (where) => {
    if (!where) {
      return where;
    }

    if (where['_id'] instanceof Array && '$in' in where['_id']) {
      let _ids = [];

      where['_id']['$in'].forEach((id) => {
        _ids.push(helpers.makeObjectId(id));
      });

      where['_id']['$in'] = _ids;

      return where;
    } else if (typeof where['_id'] === 'string') {
      where['_id'] = helpers.makeObjectId(where['_id']);

      return where;
    }
    return where;
  },
  preProcessWhere: (where) => {
    let normalizedWhere = helpers.normalizeIds(where);
    return normalizedWhere;
  },
  runFunctionPool: async (functions, params) => {
    let resource = params.resource;
    if (!resource) {
      throw new KuryemError({
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
