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
      minValue: {
        type: 'number',
      },
      active: {
        type: 'string',
      },
      startingPrice: {
        type: 'number',
      },
    },
  },
};

module.exports = settingSchema;
