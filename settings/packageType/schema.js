const settingSchema = {
  settingSchema: {
    type: 'object',
    additionalProperties: false,
    required: ['value', 'multiplier'],
    properties: {
      value: {
        type: 'string',
      },
      length: {
        type: 'number',
      },
      width: {
        type: 'number',
      },
      height: {
        type: 'number',
      },
      weight: {
        type: 'number',
      },
      multiplier: {
        type: 'number',
      },
    },
  },
};

module.exports = settingSchema;
