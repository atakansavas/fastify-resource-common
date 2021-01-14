const settingSchema = {
  settingSchema: {
    type: 'object',
    additionalProperties: false,
    required: ['citySide'],
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
