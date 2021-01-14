const settingSchema = {
  settingSchema: {
    type: 'object',
    additionalProperties: false,
    required: ['value'],
    properties: {
      citySide: {
        type: 'string',
      },
      multiplier: {
        type: 'number',
      },
    },
  },
};

module.exports = settingSchema;
