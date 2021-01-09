const enums = require('../../enums/index');

const settingSchema = {
  settingSchema: {
    type: 'object',
    additionalProperties: false,
    required: ['from', 'to'],
    properties: {
      from: {
        type: 'number',
      },
      to: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            zone: {
              type: 'number',
              enums: [enums.Zones.keys()],
            },
            multipler: {
              type: 'number',
            },
            duration: {
              type: 'number',
            },
          },
        },
      },
    },
  },
};

module.exports = settingSchema;
