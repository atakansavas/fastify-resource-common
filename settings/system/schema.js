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
      value: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
    },
  },
};

module.exports = settingSchema;
