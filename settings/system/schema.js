const settingSchema = {
  settingSchema: {
    type: 'object',
    additionalProperties: false,
    required: ['groupId', 'key', 'title', 'value'],
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
