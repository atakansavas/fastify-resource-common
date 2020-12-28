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
