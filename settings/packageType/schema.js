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
