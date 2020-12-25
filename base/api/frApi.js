const Utilities = require('../../helpers/utilities');
const statusCodes = require('./statusCodes');

module.exports = class FrApi {
  constructor(
    fastify,
    opts,
    routePrefix,
    methods,
    tableName,
    service,
    authMethod
  ) {
    this.fastify = fastify;
    this.opts = opts;
    this.routePrefix = '' + routePrefix;
    this.methods = methods;
    this.tableName = tableName;
    this.service = service || 'fr';
    this.authMethod = authMethod;
  }

  generateUrls() {
    return {
      read: this.routePrefix + '/:resourceId',
      create: this.routePrefix,
      update: this.routePrefix + '/:resourceId',
      delete: this.routePrefix + '/:resourceId',
      query: this.routePrefix + '/_query',
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
    if (this.service == 'fr') {
    }

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
          user = await this.authMethod(
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
            let _document = Utilities.runReadFormatter(
              readFormatters,
              document
            );
            _response.push(_document);
          }

          reply.code(statusCodes.QUERY).send({
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
          user = await this.authMethod(
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

          document = await Utilities.runReadFormatter(readFormatters, document);

          // document = Utilities.hideSystemProps(document);

          reply.code(statusCodes.READ).send(document);
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
          var user = await this.authMethod(
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
          document = await Utilities.runReadFormatter(readFormatters, document);

          reply.code(statusCodes.CREATE).send(document);
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
          user = await this.authMethod(
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

          document = await Utilities.runReadFormatter(readFormatters, document);

          reply.code(statusCodes.UPDATE).send(document);
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
          var user = await this.authMethod(
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

          reply.code(statusCodes.DELETE).send();
        }
      );
    }
  }
};
