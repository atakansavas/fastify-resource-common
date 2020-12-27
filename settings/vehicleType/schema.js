const settingSchema = {
  settingSchema: {
    type: 'object',
    additionalProperties: false,
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
      type: {
        type: 'string',
      },
      multiplier: {
        type: 'number',
      },
    },
  },
};

module.exports = settingSchema;
