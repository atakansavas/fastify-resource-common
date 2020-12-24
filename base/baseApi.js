const GenericHelpers = require('../helpers/helpers');
const AuthFunctions = require('../services/auth/auth');

const STATUS_CODE_MAPPING = {
  CREATE: 201,
  READ: 200,
  QUERY: 200,
  UPDATE: 200,
  DELETE: 204,
  DISTINCT: 200,
};

module.exports = class GenericKuryemApi {
  constructor(fastify, opts, routePrefix, methods, tableName, service) {
    this.fastify = fastify;
    this.opts = opts;
    this.routePrefix = '' + routePrefix;
    this.methods = methods;
    this.tableName = tableName;
    this.service = service || 'atakan';
  }

  generateUrls() {
    let deleteUrl = this.routePrefix + '/:resourceId';
    let readUrl = this.routePrefix + '/:resourceId';
    let updateUrl = this.routePrefix + '/:resourceId';
    let createUrl = this.routePrefix;
    let queryUrl = this.routePrefix + '/_query';
    return {
      read: readUrl,
      create: createUrl,
      update: updateUrl,
      delete: deleteUrl,
      query: queryUrl,
    };
  }

  clearSchemas(schema) {
    delete schema.properties._id;

    return schema;
  }

  generateEndpoints({
    createValidationSchema = {},
    updateValidationSchema = {},
    beforeCreate = [],
    afterCreate = [],
    beforeUpdate = [],
    afterUpdate = [],
    beforeDelete = [],
    afterDelete = [],
    readFormatters = [],
  } = {}) {
    const urls = this.generateUrls();

    console.info('Resource initialized on', Object.values(urls));

    if (this.methods.includes('QUERY')) {
      this.fastify.post(
        urls.query,
        {
          schema: {
            tags: [this.tableName],
          },
        },
        async (request, reply) => {
          let user = {};
          let authHeader = request.headers.authorization || null;
          user = await AuthFunctions.validateAuthHeader(
            authHeader,
            this.opts.secret,
            this.opts.db
          );

          let where = request.body.where || {};
          let select = request.body.select || {};
          let limit = parseInt(request.body.limit) || 50;
          let page = parseInt(request.body.page) || 0;
          let sort = request.body.sort || { _id: 1 };

          let result = await this.service.filter({
            db: this.opts.db,
            where: where,
            select: select,
            limit: limit,
            page: page,
            sort: sort,
            tableName: this.tableName,
            user: user,
          });

          let _response = [];
          for (let document of result.items) {
            let _document = GenericHelpers.runReadFormatter(
              readFormatters,
              document
            );
            _response.push(_document);
          }

          reply.code(STATUS_CODE_MAPPING.QUERY).send({
            items: _response,
            totalCount: result.count,
          });
        }
      );
    }

    if (this.methods.includes('GET')) {
      this.fastify.get(
        urls.read,
        {
          schema: {
            tags: [this.tableName],
            response: {
              201: createValidationSchema,
            },
          },
        },
        async (request, reply) => {
          let user = {};
          let authHeader = request.headers.authorization || null;
          user = await AuthFunctions.validateAuthHeader(
            authHeader,
            this.opts.secret,
            this.opts.db
          );

          let resourceId = request.params.resourceId;

          let document = await this.service.read({
            db: this.opts.db,
            id: resourceId,
            tableName: this.tableName,
            user: user,
          });

          document = await GenericHelpers.runReadFormatter(
            readFormatters,
            document
          );

          document = GenericHelpers.hideSystemProps(document);

          reply.code(STATUS_CODE_MAPPING.READ).send(document);
        }
      );
    }

    if (this.methods.includes('POST')) {
      this.fastify.post(
        urls.create,
        {
          schema: {
            tags: [this.tableName],
            body: this.clearSchemas(createValidationSchema),
            response: {
              201: createValidationSchema,
            },
          },
        },
        async (request, reply) => {
          let authHeader = request.headers.authorization || null;
          var user = await AuthFunctions.validateAuthHeader(
            authHeader,
            this.opts.secret,
            this.opts.db
          );

          let providedBody = request.body;

          let document = await this.service.create({
            db: this.opts.db,
            body: providedBody,
            schema: createValidationSchema,
            beforeCreate: beforeCreate,
            afterCreate: afterCreate,
            tableName: this.tableName,
            user,
          });
          document = await GenericHelpers.runReadFormatter(
            readFormatters,
            document
          );

          reply.code(STATUS_CODE_MAPPING.CREATE).send(document);
        }
      );
    }

    if (this.methods.includes('PUT')) {
      this.fastify.put(
        urls.update,
        {
          schema: {
            tags: [this.tableName],
            body: this.clearSchemas(createValidationSchema),
            response: {
              201: createValidationSchema,
            },
          },
        },
        async (request, reply) => {
          let user = {};
          let authHeader = request.headers.authorization || null;
          user = await AuthFunctions.validateAuthHeader(
            authHeader,
            this.opts.secret,
            this.opts.db
          );

          let providedBody = request.body;
          let resourceId = request.params.resourceId;

          let document = await this.service.update({
            db: this.opts.db,
            _id: resourceId,
            body: providedBody,
            schema: updateValidationSchema,
            beforeUpdate: beforeUpdate,
            afterUpdate: afterUpdate,
            tableName: this.tableName,
            user: user,
          });

          document = await GenericHelpers.runReadFormatter(
            readFormatters,
            document
          );

          reply.code(STATUS_CODE_MAPPING.UPDATE).send(document);
        }
      );
    }

    if (this.methods.includes('DELETE')) {
      this.fastify.delete(
        urls.delete,
        {
          schema: {
            tags: [this.tableName],
          },
        },
        async (request, reply) => {
          let authHeader = request.headers.authorization || null;
          var user = await AuthFunctions.validateAuthHeader(
            authHeader,
            this.opts.secret,
            this.opts.db
          );

          let resourceId = request.params.resourceId;

          await this.service.delete({
            db: this.opts.db,
            _id: resourceId,
            beforeDelete: beforeDelete,
            afterDelete: afterDelete,
            tableName: this.tableName,
            user: user,
          });

          reply.code(STATUS_CODE_MAPPING.DELETE).send();
        }
      );
    }
  }
};
