const settingSchema = {
  settingSchema: {
    type: 'object',
    additionalProperties: false,
    required: ['value', 'multiplier'],
    properties: {
      value: {
        type: 'string',
      },
      multiplier: {
        type: 'number',
      },
    },
  },
};

module.exports = settingSchema;
