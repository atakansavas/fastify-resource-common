const Utilities = require('../../helpers/utilities');
const statusCodes = require('./statusCodes');
const agentSchema = require('../../models/agent');
const service = require('../service/frService');
const frError = require('../../error/frError');
const ErrorCodes = require('../../error/errorCodes');

module.exports = class FrApi {
  constructor(
    fastify,
    opts,
    routePrefix,
    settings,
    tableName,
    service,
    authMethod,
    keyProps
  ) {
    this.fastify = fastify;
    this.opts = opts;
    this.routePrefix = '' + routePrefix;
    this.settings = settings;
    this.tableName = tableName;
    this.service = service;
    this.authMethod = authMethod;
    this.keyProps = keyProps;
  }

  generateUrls() {
    return {
      read: this.routePrefix + '/:resourceId',
      create: this.routePrefix,
      update: this.routePrefix + '/:resourceId',
      delete: this.routePrefix + '/:resourceId',
      query: this.routePrefix + '/_query',
      partial: this.routePrefix + '/_partial',
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

    const methodsList = this.settings.Methods;
    console.info(this.routePrefix + ' resource initialized on', methodsList);

    const GET = methodsList.find((item) => item.Method == 'GET');
    const POST = methodsList.find((item) => item.Method == 'POST');
    const PUT = methodsList.find((item) => item.Method == 'PUT');
    const DELETE = methodsList.find((item) => item.Method == 'DELETE');
    const QUERY = methodsList.find((item) => item.Method == 'QUERY');
    const PARTIAL = methodsList.find((item) => item.Method == 'PARTIAL');

    if (QUERY) {
      this.fastify.post(
        urls.query,
        {
          schema: {
            tags: [this.tableName],
            summary: QUERY.Description,
          },
        },
        async (request, reply) => {
          if (process.env.KEEPLOGS == 1) {
            console.log(urls.query + ' METHOD INIT : ', request);
          }
          let authHeader = request.headers.authorization || null;
          const user = await this.authMethod(
            authHeader,
            this.opts.secret,
            this.opts.db
          );

          if (!QUERY.UserTypes.includes(user.userType)) {
            throw new frError({
              message: 'Unauthorized process.',
              code: ErrorCodes.Unauthorized,
              status: 403,
            });
          }

          let where = request.body.where || {};
          let select = request.body.select || {};
          let limit = parseInt(request.body.limit) || 30;
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
            settings: this.settings.ServiceSettings,
            token: authHeader,
          });

          let _response = [];
          for (let document of result.items) {
            let _document = Utilities.runReadFormatter(
              readFormatters,
              document
            );
            _response.push(_document);
          }

          if (process.env.KEEPLOGS == 1) {
            console.log(urls.query + ' METHOD RESPONSE : ', {
              items: _response,
              totalCount: result.count,
            });
          }

          reply.code(statusCodes.QUERY).send({
            items: _response,
            totalCount: result.count,
          });
        }
      );
    }

    if (PARTIAL) {
      this.fastify.post(
        urls.partial,
        {
          schema: {
            tags: [this.tableName],
            summary: PARTIAL.Description,
            response: {
              201: createValidationSchema,
            },
          },
        },
        async (request, reply) => {
          if (process.env.KEEPLOGS == 1) {
            console.log(urls.partial + ' METHOD INIT : ', request);
          }
          let user = {};
          let authHeader = request.headers.authorization || null;
          user = await this.authMethod(
            authHeader,
            this.opts.secret,
            this.opts.db
          );

          if (!PARTIAL.UserTypes.includes(user.userType)) {
            throw new frError({
              message: 'Unauthorized process.',
              code: ErrorCodes.Unauthorized,
              status: 403,
            });
          }

          let where = {};
          let select = {};
          let limit = 50;
          let page = 0;
          let sort = { _id: 1 };

          if (request.body) {
            where = request.body.where || {};
            select = request.body.select || {};
            limit = parseInt(request.body.limit) || 30;
            page = parseInt(request.body.page) || 0;
            sort = request.body.sort || { _id: 1 };
          }

          let result = await this.service.partial({
            db: this.opts.db,
            where: where,
            select: select,
            limit: limit,
            page: page,
            sort: sort,
            tableName: this.tableName,
            user: user,
            settings: this.settings.ServiceSettings,
            token: authHeader,
          });

          let _response = [];
          for (let document of result.items) {
            let _document = Utilities.runReadFormatter(
              readFormatters,
              document
            );
            _response.push(_document);
          }

          if (process.env.KEEPLOGS == 1) {
            console.log(urls.partial + ' METHOD RESPONSE : ', {
              items: _response,
              totalCount: result.count,
            });
          }

          reply.code(statusCodes.QUERY).send({
            items: _response,
            totalCount: result.count,
          });
        }
      );
    }

    if (GET) {
      this.fastify.get(
        urls.read,
        {
          schema: {
            tags: [this.tableName],
            summary: GET.Description,
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

          if (!GET.UserTypes.includes(user.userType)) {
            throw new frError({
              message: 'Unauthorized process.',
              code: ErrorCodes.Unauthorized,
              status: 403,
            });
          }

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

    if (POST) {
      this.fastify.post(
        urls.create,
        {
          schema: {
            tags: [this.tableName],
            summary: POST.Description,
            body: {
              ...this.clearSchemas(createValidationSchema),
              agent: agentSchema,
            },
          },
        },
        async (request, reply) => {
          if (process.env.KEEPLOGS == 1) {
            console.log(urls.create + ' METHOD INIT : ', request);
          }
          let authHeader = request.headers.authorization || null;
          const user = await this.authMethod(
            authHeader,
            this.opts.secret,
            this.opts.db
          );

          if (!POST.UserTypes.includes(user.userType)) {
            throw new frError({
              message: 'Unauthorized process.',
              code: ErrorCodes.Unauthorized,
              status: 403,
            });
          }

          let providedBody = request.body;

          let document = await this.service.create({
            db: this.opts.db,
            body: providedBody,
            schema: createValidationSchema,
            beforeCreate: beforeCreate,
            afterCreate: afterCreate,
            tableName: this.tableName,
            user,
            settings: this.settings.ServiceSettings,
            token: authHeader,
          });
          const formattedDocument = await Utilities.runReadFormatter(
            readFormatters,
            document
          );

          if (process.env.KEEPLOGS == 1) {
            console.log(urls.create + ' METHOD RESPONSE : ', formattedDocument);
          }

          reply.code(statusCodes.CREATE).send(formattedDocument);
        }
      );
    }

    if (PUT) {
      this.fastify.put(
        urls.update,
        {
          schema: {
            tags: [this.tableName],
            summary: PUT.Description,
            body: {
              ...this.clearSchemas(createValidationSchema),
              agent: agentSchema,
            },
            response: {
              201: createValidationSchema,
            },
          },
        },
        async (request, reply) => {
          if (process.env.KEEPLOGS == 1) {
            console.log(urls.update + ' METHOD INIT : ', request);
          }
          let authHeader = request.headers.authorization || null;
          const user = await this.authMethod(
            authHeader,
            this.opts.secret,
            this.opts.db
          );

          if (!PUT.UserTypes.includes(user.userType)) {
            throw new frError({
              message: 'Unauthorized process.',
              code: ErrorCodes.Unauthorized,
              status: 403,
            });
          }

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
            settings: this.settings.ServiceSettings,
            user: user,
            token: authHeader,
          });

          document = await Utilities.runReadFormatter(readFormatters, document);

          if (process.env.KEEPLOGS == 1) {
            console.log(urls.update + ' METHOD RESPONSE : ', document);
          }
          reply.code(statusCodes.UPDATE).send(document);
        }
      );
    }

    if (DELETE) {
      this.fastify.delete(
        urls.delete,
        {
          schema: {
            summary: DELETE.Description,
            tags: [this.tableName],
          },
        },
        async (request, reply) => {
          if (process.env.KEEPLOGS == 1) {
            console.log(urls.delete + ' METHOD INIT : ', request);
          }
          let authHeader = request.headers.authorization || null;
          var user = await this.authMethod(
            authHeader,
            this.opts.secret,
            this.opts.db
          );

          if (!DELETE.UserTypes.includes(user.userType)) {
            throw new frError({
              message: 'Unauthorized process.',
              code: ErrorCodes.Unauthorized,
              status: 403,
            });
          }

          let resourceId = request.params.resourceId;

          await this.service.delete({
            db: this.opts.db,
            _id: resourceId,
            beforeDelete: beforeDelete,
            afterDelete: afterDelete,
            tableName: this.tableName,
            user: user,
            token: authHeader,
          });

          reply.code(statusCodes.DELETE).send();
        }
      );
    }
  }
};
