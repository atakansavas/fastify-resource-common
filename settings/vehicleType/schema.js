const settingSchema = {
  settingSchema: {
    type: 'object',
    additionalProperties: false,
    required: ['groupId', 'key', 'value', 'multiplier'],
    properties: {
      groupId: {
        type: 'number',
      },
      key: {
        type: 'string',
      },
      title: {
        type: 'string',
      },
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
